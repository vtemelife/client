import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useHistory } from "react-router";
import { InputGroup, Form, Modal, ListGroup, Alert } from "react-bootstrap";
import { useGet } from "restful-react";
import Loading from "generic/components/Loading";

import { _ } from "trans";
import { ROLE_MODERATOR } from "generic/constants";
import { SERVER_URLS } from "routes/server";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import Header from "mobile/containers/Header";
import ImageGallery from "generic/components/ImageGallery";
import VideoGallery from "generic/components/VideoGallery";
import PaginateList from "generic/components/PaginateList";
import { Link } from "react-router-dom";
import { CLIENT_URLS } from "mobile/routes/client";
import DeleteItem from "mobile/components/DeleteItem";

const MENU_PAGE_PHOTOS = "photo";
const MENU_PAGE_VIDEOS = "video";

const MediaFolderDetail: React.SFC<any> = ({ folderPk, mediaPk }) => {
  const { mediaFolderPk: urlFolderPk } = useParams();
  const mediaFolderPk = folderPk ? folderPk : urlFolderPk;
  const history = useHistory();

  const [showMenu, toggleShowMenu] = useState(false);

  const [search, changeSearch] = useState("");
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState(MENU_PAGE_PHOTOS);

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {}
    }
  };

  const { data: mediaFolderData, loading: mediaFolderDataLoading } = useGet({
    path: SERVER_URLS.MEDIA_FOLDER_DETAIL.toPath({
      urlParams: {
        mediaFolderPk
      }
    })
  });
  const mediaFolder = mediaFolderData || {};

  const getParams = {
    search,
    content_type: "media:mediafolder",
    object_id: mediaFolderPk,
    media_type: menuPage
  };
  const { data: mediaData, loading, refetch } = useGet({
    path: SERVER_URLS.MEDIA.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const mediaItems = (mediaData || {}).results || [];
  const mediaCount = (mediaData || {}).count || 0;

  let title = `${mediaFolder.name} (${_("Photos")})`;
  switch (menuPage) {
    case MENU_PAGE_VIDEOS:
      title = `${mediaFolder.name} (${_("Videos")})`;
      break;
    default:
      break;
  }

  const isCreator = (item: any) => {
    return item.creator === user.pk || user.role === ROLE_MODERATOR;
  };
  return (
    <div className="container-media-folders-detail">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title || ""} ${mediaCount > 0 ? `(${mediaCount})` : ""}`}
        fixed={true}
      >
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
        <div>
          <Link
            to={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_CREATE.toPath({
              getParams: {
                objectId: mediaFolderPk,
                contentType: "media:mediafolder"
              }
            })}
          >
            <i className="fa fa-plus" />
          </Link>
        </div>
      </Header>
      <div className="media-folders-search">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="search">
              <i className="fa fa-search" />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text-break"
            placeholder={_("Start input here")}
            aria-describedby="search"
            value={search}
            onChange={(event: any) => changeSearch(event.target.value)}
          />
        </InputGroup>
      </div>
      <div className="media-list">
        {mediaFolderDataLoading && <Loading />}
        {!loading && mediaItems.length === 0 && (
          <Alert variant="warning">
            <div>{_("No media.")}</div>
          </Alert>
        )}
        {menuPage === MENU_PAGE_PHOTOS && (
          <PaginateList
            offset={offset}
            changeOffset={changeOffset}
            count={mediaCount}
            objs={mediaItems}
            ownRender={true}
            loading={loading}
            getParamsHash={JSON.stringify(getParams)}
          >
            {(items: any) => (
              <ImageGallery
                mediaItems={items.filter(
                  (media: any) => media.media_type === MENU_PAGE_PHOTOS
                )}
                refetch={refetch}
              />
            )}
          </PaginateList>
        )}
        {menuPage === MENU_PAGE_VIDEOS && (
          <PaginateList
            offset={offset}
            changeOffset={changeOffset}
            count={mediaCount}
            objs={mediaItems}
            ownRender={true}
            loading={loading}
            getParamsHash={JSON.stringify(getParams)}
          >
            {(items: any) => (
              <VideoGallery
                mediaItems={items.filter(
                  (media: any) => media.media_type === MENU_PAGE_VIDEOS
                )}
                refetch={refetch}
              />
            )}
          </PaginateList>
        )}
      </div>
      <Modal size="lg" show={showMenu} onHide={() => toggleShowMenu(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-bars" /> {_("Menu")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_PHOTOS);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-photo" /> {_("Photos")}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_VIDEOS);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-camera" /> {_("Videos")}
            </ListGroup.Item>
            {isCreator(mediaFolder) && (
              <ListGroup.Item>
                <Link
                  to={CLIENT_URLS.USER.MEDIA_FOLDER_UPDATE.toPath({
                    urlParams: {
                      mediaFolderPk
                    }
                  })}
                >
                  <i className="fa fa-pencil fa-lg" />{" "}
                  <span className="menu-item">
                    {_("Update the media folder")}
                  </span>
                </Link>
              </ListGroup.Item>
            )}
            {isCreator(mediaFolder) && (
              <ListGroup.Item>
                <DeleteItem
                  description={_(
                    "Are you sure you want to delete the media folder?"
                  )}
                  onSuccess={() => {
                    history.push(CLIENT_URLS.USER.MEDIA_FOLDER_LIST.toPath());
                  }}
                  path={SERVER_URLS.MEDIA_FOLDER_DELETE.toPath({
                    urlParams: {
                      mediaFolderPk
                    }
                  })}
                >
                  <i className="fa fa-trash fa-lg" />{" "}
                  <span className="menu-item">
                    {_("Delete the media folder")}
                  </span>
                </DeleteItem>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MediaFolderDetail;

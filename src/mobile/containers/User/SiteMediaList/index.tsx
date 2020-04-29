import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { InputGroup, Form, Modal, ListGroup, Alert } from "react-bootstrap";
import { useGet } from "restful-react";
import { useLocation } from "react-router";
import queryString from "query-string";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import Header from "mobile/containers/Header";
import { REQUEST_APPROVED } from "generic/constants";
import ImageGallery from "generic/components/ImageGallery";
import VideoGallery from "generic/components/VideoGallery";
import PaginateList from "generic/components/PaginateList";

const MENU_PAGE_PHOTOS = "photo";
const MENU_PAGE_VIDEOS = "video";

const SiteMediaList: React.SFC<any> = () => {
  const location = useLocation();
  const { objectId, contentType } = queryString.parse(location.search);
  const [showMenu, toggleShowMenu] = useState(false);
  const isSitePostsMode = !(objectId && contentType);

  const [search, changeSearch] = useState("");
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState(MENU_PAGE_PHOTOS);

  const getParams = {
    search,
    media_type: menuPage,
    status: isSitePostsMode ? REQUEST_APPROVED : undefined,
    object_id: !isSitePostsMode ? objectId : undefined,
    content_type: !isSitePostsMode ? contentType : undefined
  };
  const { data: mediaData, loading, refetch } = useGet({
    path: SERVER_URLS.MEDIA.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const mediaItems = (mediaData || {}).results || [];
  const mediaCount = (mediaData || {}).count || 0;

  let title = _("Photos");
  switch (menuPage) {
    case MENU_PAGE_VIDEOS:
      title = _("Videos");
      break;
    default:
      break;
  }

  return (
    <div className="container-site-media-list">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${mediaCount > 0 ? `(${mediaCount})` : ""}`}
        fixed={true}
      >
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
      </Header>
      <div className="site-media-search">
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
      <div className="site-media-list">
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
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SiteMediaList;

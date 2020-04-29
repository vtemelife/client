import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import {
  InputGroup,
  Form,
  Modal,
  ListGroup,
  Alert,
  Button,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';
import { useGet } from 'restful-react';
import Image from 'generic/components/Image';
import pictureSVG from 'generic/layout/images/picture.svg';
import DeleteItem from 'mobile/components/DeleteItem';

import { _ } from 'trans';
import {
  ROLE_MODERATOR,
  PERMISSION_NO_USERS,
  PERMISSION_ONLY_FRIENDS,
  PERMISSION_ALL_USERS,
} from 'generic/constants';
import { SERVER_URLS } from 'routes/server';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import Header from 'mobile/containers/Header';
import { CLIENT_URLS } from 'mobile/routes/client';
import PaginateList from 'generic/components/PaginateList';

const MediaFolderList: React.SFC<any> = () => {
  const location = useLocation();
  const { parentPk } = queryString.parse(location.search);
  const [showMenu, toggleShowMenu] = useState(false);

  const [search, changeSearch] = useState('');
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState('');

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    pk: null,
  };

  const creator = parentPk || user.pk;

  const queryParams = {
    search,
    creator,
    show_media: menuPage !== '' ? menuPage : undefined,
  };
  const { data: mediaFolderData, loading, refetch } = useGet({
    path: SERVER_URLS.MEDIA_FOLDER.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });
  const mediaFolderItems = (mediaFolderData || {}).results || [];
  const mediaFolderCount = (mediaFolderData || {}).count || 0;

  const title = _('Media folders');
  const isCreator = (item: any) => {
    return item.creator === user.pk || user.role === ROLE_MODERATOR;
  };
  return (
    <div className="container-media-folder">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${mediaFolderCount > 0 ? `(${mediaFolderCount})` : ''}`}
        fixed={true}
      >
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
        {parentPk === user.pk && (
          <div>
            <Link to={CLIENT_URLS.USER.MEDIA_FOLDER_CREATE.buildPath()}>
              <i className="fa fa-plus" />
            </Link>
          </div>
        )}
      </Header>
      <div className="media-folder-search">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="search">
              <i className="fa fa-search" />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text-break"
            placeholder={_('Start input here')}
            aria-describedby="search"
            value={search}
            onChange={(event: any) => changeSearch(event.target.value)}
          />
        </InputGroup>
      </div>
      <div className="media-folder-list">
        {!loading && mediaFolderItems.length === 0 && (
          <Alert variant="warning">
            <div>{_('No media folders.')}</div>
            <hr />
            <div className="d-flex">
              <Button size="sm" variant="warning">
                <i className="fa fa-search" /> {_('Add a media folder')}
              </Button>
            </div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={mediaFolderCount}
          objs={mediaFolderItems}
          loading={loading}
          queryParamsHash={JSON.stringify(queryParams)}
        >
          {(item: any) => (
            <div className="media-folder-item block" key={item.pk}>
              <Link
                to={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL.buildPath({
                  mediaFolderPk: item.pk,
                })}
              >
                <div className="media-folder-images">
                  {item.media.length === 0 && <Image src={pictureSVG} />}
                  {item.media.map((image: any, indexImage: number) => (
                    <Image
                      key={indexImage}
                      src={
                        (image.image && image.image.thumbnail_blur_500x500) ||
                        pictureSVG
                      }
                    />
                  ))}
                </div>
              </Link>
              <div className="media-folder-footer">
                <div className="media-folder-title">
                  {item.show_media.value === PERMISSION_NO_USERS && (
                    <i className="fa fa-eye-slash" />
                  )}
                  {item.show_media.value === PERMISSION_ONLY_FRIENDS && (
                    <i className="fa fa-users" />
                  )}
                  {item.show_media.value === PERMISSION_ALL_USERS && (
                    <i className="fa fa-eye" />
                  )}{' '}
                  {item.name}
                </div>
                <div className="media-folder-actions">
                  {isCreator(item) && (
                    <OverlayTrigger
                      trigger="click"
                      rootClose={true}
                      placement="left"
                      overlay={
                        <Popover id="popover-basic">
                          <Popover.Content>
                            <ListGroup variant="flush">
                              <ListGroup.Item>
                                <Link
                                  to={CLIENT_URLS.USER.MEDIA_FOLDER_UPDATE.buildPath(
                                    {
                                      mediaFolderPk: item.pk,
                                    },
                                  )}
                                >
                                  <i className="fa fa-pencil" /> {_('Update')}
                                </Link>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <DeleteItem
                                  description={_(
                                    'Are you sure you want to delete the media folder?',
                                  )}
                                  onSuccess={() => refetch()}
                                  path={SERVER_URLS.MEDIA_FOLDER_DELETE.buildPath(
                                    {
                                      mediaFolderPk: item.pk,
                                    },
                                  )}
                                >
                                  <i className="fa fa-trash" /> {_('Delete')}
                                </DeleteItem>
                              </ListGroup.Item>
                            </ListGroup>
                          </Popover.Content>
                        </Popover>
                      }
                    >
                      <i className="fa fa-bars fa-lg" />
                    </OverlayTrigger>
                  )}
                </div>
              </div>
            </div>
          )}
        </PaginateList>
      </div>
      <Modal size="lg" show={showMenu} onHide={() => toggleShowMenu(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-bars" /> {_('Menu')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage('');
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-photo" /> {_('All users')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(PERMISSION_NO_USERS);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-eye-slash" /> {_('No users can see a folder')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(PERMISSION_ONLY_FRIENDS);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-users" /> {_('Only friends can see a folder')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(PERMISSION_ALL_USERS);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-eye" /> {_('All users can see a folder')}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MediaFolderList;

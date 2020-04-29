import React, { useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import { InputGroup, Form } from 'react-bootstrap';
import { useGet } from 'restful-react';
import Loading from 'generic/components/Loading';
import { LinkContainer } from 'react-router-bootstrap';

import { _ } from 'trans';
import { ROLE_MODERATOR } from 'generic/constants';
import { SERVER_URLS } from 'routes/server';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import ImageGallery from 'generic/components/ImageGallery';
import VideoGallery from 'generic/components/VideoGallery';
import PaginateList from 'generic/components/PaginateList';
import { CLIENT_URLS } from 'mobile/routes/client';
import { Card, Row, Col, Button, Nav } from 'react-bootstrap';

import Delete from 'desktop/containers/Generics/Delete';

const MENU_PAGE_PHOTOS = 'photo';
const MENU_PAGE_VIDEOS = 'video';

const MediaFolderDetail: React.SFC<any> = ({ folderPk, mediaPk }) => {
  const { mediaFolderPk: urlFolderPk } = useParams();
  const mediaFolderPk = folderPk ? folderPk : urlFolderPk;
  const history = useHistory();

  const [search, changeSearch] = useState('');
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState(MENU_PAGE_PHOTOS);

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {},
    },
  };

  const { data: mediaFolderData, loading: mediaFolderDataLoading } = useGet({
    path: SERVER_URLS.MEDIA_FOLDER_DETAIL.buildPath({
      mediaFolderPk,
    }),
  });
  const mediaFolder = mediaFolderData || {};

  const queryParams = {
    search,
    content_type: 'media:mediafolder',
    object_id: mediaFolderPk,
    media_type: menuPage,
  };
  const { data: mediaData, loading, refetch } = useGet({
    path: SERVER_URLS.MEDIA.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });
  const mediaItems = (mediaData || {}).results || [];
  const mediaCount = (mediaData || {}).count || 0;

  let title = `${mediaFolder.name} (${_('Photos')})`;
  switch (menuPage) {
    case MENU_PAGE_VIDEOS:
      title = `${mediaFolder.name} (${_('Videos')})`;
      break;
    default:
      break;
  }

  const isCreator = (item: any) => {
    return item.creator === user.pk || user.role === ROLE_MODERATOR;
  };
  return (
    <Col lg={10} className="object-list-container media-block-container">
      <Row className="flex-column-reverse flex-lg-row">
        <Col lg={9}>
          <Card>
            <Card.Header>
              <Row>
                <Col lg={7}>
                  <Card.Title className="object-title">
                    <LinkContainer
                      to={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_CREATE.buildPath(
                        {
                          queryParams: {
                            content_type: 'media:mediafolder',
                            object_id: mediaFolderPk,
                          },
                        },
                      )}
                    >
                      <Button size="sm" variant="primary">
                        <i className="fa fa-plus" />
                      </Button>
                    </LinkContainer>
                    &nbsp;
                    {title}
                  </Card.Title>
                </Col>
                <Col lg={5}>
                  <Card.Title className="object-search">
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
                        required={true}
                        value={search}
                        onChange={(event: any) =>
                          changeSearch(event.target.value)
                        }
                        // onKeyPress={() => {}}
                      />
                    </InputGroup>
                  </Card.Title>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="object-list">
              {mediaFolderDataLoading && <Loading />}
              {menuPage === MENU_PAGE_PHOTOS && (
                <PaginateList
                  offset={offset}
                  changeOffset={changeOffset}
                  count={mediaCount}
                  objs={mediaItems}
                  ownRender={true}
                  loading={loading}
                  queryParamsHash={JSON.stringify(queryParams)}
                >
                  {(items: any) => (
                    <ImageGallery
                      mediaItems={items.filter(
                        (media: any) => media.media_type === MENU_PAGE_PHOTOS,
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
                  queryParamsHash={JSON.stringify(queryParams)}
                >
                  {(items: any) => (
                    <VideoGallery
                      mediaItems={items.filter(
                        (media: any) => media.media_type === MENU_PAGE_VIDEOS,
                      )}
                      refetch={refetch}
                    />
                  )}
                </PaginateList>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} className="right-filters">
          <>
            {isCreator(mediaFolder) && (
              <Card>
                <Card.Body>
                  <Card.Title>
                    <i className="fa fa-cogs" /> {_('Actions')}
                  </Card.Title>
                  <Nav className="flex-column">
                    <LinkContainer
                      to={CLIENT_URLS.USER.MEDIA_FOLDER_UPDATE.buildPath({
                        mediaFolderPk: mediaFolder.pk,
                      })}
                    >
                      <Nav.Link>
                        <i className="fa fa-pencil" /> {_('Update')}
                      </Nav.Link>
                    </LinkContainer>
                    <Delete
                      title={_('Are you sure?')}
                      description={_(
                        'Are you sure you want to delete the media folder?',
                      )}
                      onSuccess={() => {
                        history.push(
                          CLIENT_URLS.USER.MEDIA_FOLDER_LIST.buildPath(),
                        );
                      }}
                      destoryServerPath={SERVER_URLS.MEDIA_FOLDER_DELETE.buildPath(
                        {
                          mediaFolderPk: mediaFolder.pk,
                        },
                      )}
                    >
                      <Nav.Link>
                        <i className="fa fa-trash" /> {_('Delete')}
                      </Nav.Link>
                    </Delete>
                  </Nav>
                </Card.Body>
              </Card>
            )}
            <Card>
              <Card.Body>
                <Card.Title>
                  <i className="fa fa-filter" /> {_('Filters')}
                </Card.Title>
                <Nav className="flex-column">
                  <Nav.Link
                    onClick={() => {
                      changeOffset(0);
                      changeMenuPage(MENU_PAGE_PHOTOS);
                    }}
                  >
                    <i className="fa fa-image" /> {_('Photo')}
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => {
                      changeOffset(0);
                      changeMenuPage(MENU_PAGE_VIDEOS);
                    }}
                  >
                    <i className="fa fa-video-camera" /> {_('Video')}
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </>
        </Col>
      </Row>
    </Col>
  );
};

export default MediaFolderDetail;

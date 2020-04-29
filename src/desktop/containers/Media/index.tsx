import React, { useState } from 'react';
import { InputGroup, Form, Col, Row, Card, Nav } from 'react-bootstrap';
import { useGet } from 'restful-react';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { Helmet } from 'react-helmet-async';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import { REQUEST_APPROVED } from 'generic/constants';
import ImageGallery from 'generic/components/ImageGallery';
import VideoGallery from 'generic/components/VideoGallery';
import PaginateList from 'generic/components/PaginateList';

const MENU_PAGE_PHOTOS = 'photo';
const MENU_PAGE_VIDEOS = 'video';

const Media: React.SFC<any> = ({ folderPk, mediaPk }) => {
  const location = useLocation();
  const { objectId, contentType } = queryString.parse(location.search);
  const isSitePostsMode = !(objectId && contentType);

  const [search, changeSearch] = useState('');
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState(MENU_PAGE_PHOTOS);

  const queryParams = {
    search,
    media_type: menuPage,
    status: isSitePostsMode ? REQUEST_APPROVED : undefined,
    object_id: !isSitePostsMode ? objectId : undefined,
    content_type: !isSitePostsMode ? contentType : undefined,
  };
  const { data: mediaData, loading, refetch } = useGet({
    path: SERVER_URLS.MEDIA.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });
  const mediaItems = (mediaData || {}).results || [];
  const mediaCount = (mediaData || {}).count || 0;

  let title = _('Photos');
  switch (menuPage) {
    case MENU_PAGE_VIDEOS:
      title = _('Videos');
      break;
    default:
      break;
  }

  return (
    <Col lg={10} className="object-list-container media-block-container">
      <Helmet>
        <title>{_('Media')}</title>
        <meta name="description" content={_('Media')} />
      </Helmet>
      <Row className="flex-column-reverse flex-lg-row">
        <Col lg={9}>
          <Card>
            <Card.Header>
              <Row>
                <Col lg={7}>
                  <Card.Title className="object-title">{title}</Card.Title>
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
        </Col>
      </Row>
    </Col>
  );
};

export default Media;

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { InputGroup, Form, Modal, ListGroup } from 'react-bootstrap';
import { useGet } from 'restful-react';

import Loading from 'generic/components/Loading';
import Header from 'mobile/containers/Header';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import MapArea from 'generic/components/MapArea';

const MENU_PAGE_ALL = 'all';
const MENU_PAGE_PARTIES = 'party';
const MENU_PAGE_CLUBS = 'club';

const SiteMap: React.SFC<any> = () => {
  const [showMenu, toggleShowMenu] = useState(false);
  const [menuPage, changeMenuPage] = useState(MENU_PAGE_ALL);
  const [search, changeSearch] = useState('');
  const { data: mapData, loading } = useGet({
    path: SERVER_URLS.MAP.buildPath({
      queryParams: {
        search,
        type: menuPage !== MENU_PAGE_ALL ? menuPage : undefined,
      },
    }),
  });
  let title = _('Map (parties and clubs)');
  switch (menuPage) {
    case MENU_PAGE_PARTIES:
      title = _('Map (parties)');
      break;
    case MENU_PAGE_CLUBS:
      title = _('Map (clubs)');
      break;
    case MENU_PAGE_ALL:
    default:
      break;
  }
  return (
    <div className="container-site-map">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header name={title} fixed={true}>
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
      </Header>
      <div className="site-map-search">
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
      <div className="map-list">
        {loading && <Loading />}
        <MapArea data={mapData} />
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
                changeMenuPage(MENU_PAGE_ALL);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-map" /> {_('Parties and clubs')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeMenuPage(MENU_PAGE_PARTIES);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-calendar" /> {_('Parties')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeMenuPage(MENU_PAGE_CLUBS);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-venus-mars" /> {_('Clubs')}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SiteMap;

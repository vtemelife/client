import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  InputGroup,
  Form,
  Modal,
  Button,
  OverlayTrigger,
  Popover,
  ListGroup,
  Alert
} from "react-bootstrap";
import { useGet } from "restful-react";
import ShowMore from "react-show-more";
import { LinkContainer } from "react-router-bootstrap";

import Image from "generic/components/Image";
import defaultSVG from "generic/layout/images/picture.svg";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "mobile/routes/client";
import PaginateList from "generic/components/PaginateList";
import { renderHtml } from "utils";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import Header from "mobile/containers/Header";
import DeleteItem from "mobile/components/DeleteItem";
import { ROLE_MODERATOR } from "generic/constants";
import { withGuestAlert } from "mobile/components/GuestAlert";

const MENU_PAGE_MY = "my";
const MENU_PAGE_SEARCH = "search";

const GameList: React.SFC<any> = () => {
  const [showMenu, toggleShowMenu] = useState(false);
  const [showFilters, toggleShowFilters] = useState(false);

  const [search, changeSearch] = useState("");
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState(MENU_PAGE_MY);

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {}
    }
  };

  const defaultFilters = {
    relationship_theme: null,
    game_type: null
  } as any;
  const [filters, changeFilters] = useState(defaultFilters);
  const [applyFilters, changeApplyFilters] = useState(null);

  const serverFilters = applyFilters || defaultFilters;

  const getParams = {
    search,
    relationship_theme:
      serverFilters.relationship_theme !== null
        ? serverFilters.relationship_theme.value
        : undefined,
    game_type:
      serverFilters.game_type !== null
        ? serverFilters.game_type.value
        : undefined,
    is_participant: menuPage === MENU_PAGE_MY ? true : undefined
  };
  const { data: gamesData, loading, refetch } = useGet({
    path: SERVER_URLS.GAME_LIST.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const gamesItems = (gamesData || {}).results || [];
  const gamesCount = (gamesData || {}).count || 0;

  let title = _("Games");
  switch (menuPage) {
    case MENU_PAGE_SEARCH:
      title = _("Search a game");
      break;
    case MENU_PAGE_MY:
    default:
      break;
  }

  const isCreator = (item: any) => {
    return item.creator === user.pk || user.role === ROLE_MODERATOR;
  };
  return (
    <div className="container-games">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${gamesCount > 0 ? `(${gamesCount})` : ""}`}
        fixed={true}
      >
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
      </Header>
      <div className="games-search">
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
      <div className="games-list">
        {!loading && gamesItems.length === 0 && (
          <Alert variant="warning">
            <div>{_("No games.")}</div>
            <hr />
            <div className="d-flex">
              <Button
                size="sm"
                variant="warning"
                onClick={() => {
                  changeMenuPage(MENU_PAGE_SEARCH);
                }}
              >
                <i className="fa fa-search" /> {_("Search a game")}
              </Button>
            </div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={gamesCount}
          objs={gamesItems}
          loading={loading}
          getParamsHash={JSON.stringify(getParams)}
        >
          {(item: any) => (
            <div className="games-item block" key={item.slug}>
              <div className="games-header">
                <div className="games-avatar">
                  <Link
                    to={CLIENT_URLS.USER.GAME_DETAIL.buildPath({
                      gameSlug: item.slug
                    })}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={
                        item.image && item.image.thumbnail_100x100
                          ? item.image.thumbnail_100x100
                          : defaultSVG
                      }
                    />
                  </Link>
                </div>
                <div className="games-title">
                  <div className="games-title-name">
                    <Link
                      to={CLIENT_URLS.USER.GAME_DETAIL.buildPath({
                        gameSlug: item.slug
                      })}
                    >
                      <>{item.name}</>
                    </Link>
                  </div>
                  <div className="games-title-geo">
                    <i className="fa fa-users" /> {item.players_count}{" "}
                    {_("already playing")}
                  </div>
                </div>
                <div className="games-actions">
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
                                  to={CLIENT_URLS.USER.GAME_UPDATE.toPath({
                                    urlParams: {
                                      gameSlug: item.slug
                                    }
                                  })}
                                >
                                  <i className="fa fa-pencil" /> {_("Update")}
                                </Link>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <DeleteItem
                                  description={_(
                                    "Are you sure you want to delete the game?"
                                  )}
                                  onSuccess={() => refetch()}
                                  path={SERVER_URLS.GAME_DELETE.toPath({
                                    urlParams: {
                                      gameSlug: item.slug
                                    }
                                  })}
                                >
                                  <i className="fa fa-trash" /> {_("Delete")}
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
              <div className="games-body">
                <div className="games-text">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <span className="item-title">{_("About")}:</span>
                      <ShowMore
                        lines={10}
                        more={_("Show more")}
                        less={_("Show less")}
                        anchorClass=""
                      >
                        {renderHtml(item.description)}
                      </ShowMore>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <LinkContainer
                        to={CLIENT_URLS.USER.GAME_PLAY.buildPath({
                          gameSlug: item.slug
                        })}
                      >
                        <Button size="sm" className="float-right">
                          <i className="fa fa-play" /> {_("Play")}
                        </Button>
                      </LinkContainer>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </div>
            </div>
          )}
        </PaginateList>
      </div>
      <Modal
        size="lg"
        show={showFilters}
        onHide={() => toggleShowFilters(false)}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-filter" /> {_("Filters")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body />
        <Modal.Footer>
          <Button
            onClick={() => {
              changeOffset(0);
              changeFilters(defaultFilters);
              changeApplyFilters(null);
              toggleShowFilters(false);
            }}
            variant="danger"
          >
            {_("Reset")}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              changeOffset(0);
              changeApplyFilters(filters as any);
              toggleShowFilters(false);
            }}
          >
            {_("Apply")}
          </Button>
        </Modal.Footer>
      </Modal>
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
                changeMenuPage(MENU_PAGE_MY);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-copy" /> {_("Games")}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_SEARCH);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-search" /> {_("Search a game")}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default withGuestAlert(GameList);

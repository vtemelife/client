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
  Badge,
  Alert
} from "react-bootstrap";
import { useGet, useMutate } from "restful-react";
import ShowMore from "react-show-more";

import Image from "generic/components/Image";
import Loading from "generic/components/Loading";
import defaultSVG from "generic/layout/images/picture.svg";

import { _ } from "trans";
import { ROLE_MODERATOR } from "generic/constants";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "mobile/routes/client";
import PaginateList from "generic/components/PaginateList";
import { getGeo } from "desktop/containers/User/Profile/utils";
import { renderHtml, handleSuccess, handleErrors } from "utils";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormSelect from "generic/components/Form/FormSelect";
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from "generic/constants";
import Header from "mobile/containers/Header";
import DeleteItem from "mobile/components/DeleteItem";
import { withGuestAlert } from "mobile/components/GuestAlert";

const MENU_PAGE_MY = "my";
const MENU_PAGE_SEARCH = "search";

const ClubList: React.SFC<any> = () => {
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
    country:
      user.city && user.city.country
        ? {
            pk: user.city.country.pk,
            name: user.city.country.name
          }
        : null,
    region:
      user.city && user.city.region
        ? {
            pk: user.city.region.pk,
            name: user.city.region.name
          }
        : null,
    city: null,
    relationship_theme: null,
    club_type: null
  } as any;
  const [filters, changeFilters] = useState(defaultFilters);
  const [applyFilters, changeApplyFilters] = useState(null);

  const serverFilters = applyFilters || defaultFilters;

  const getParams = {
    search,
    city__country:
      serverFilters.country !== null ? serverFilters.country.pk : undefined,
    city__region:
      serverFilters.region !== null ? serverFilters.region.pk : undefined,
    city: serverFilters.city !== null ? serverFilters.city.pk : undefined,
    relationship_theme:
      serverFilters.relationship_theme !== null
        ? serverFilters.relationship_theme.value
        : undefined,
    club_type:
      serverFilters.club_type !== null
        ? serverFilters.club_type.value
        : undefined,
    is_participant: menuPage === MENU_PAGE_MY ? true : undefined
  };
  const { data: clubsData, loading, refetch } = useGet({
    path: SERVER_URLS.CLUB_LIST.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const clubsItems = (clubsData || {}).results || [];
  const clubsCount = (clubsData || {}).count || 0;

  let title = _("My clubs");
  switch (menuPage) {
    case MENU_PAGE_SEARCH:
      title = _("Search clubs");
      break;
    case MENU_PAGE_MY:
    default:
      break;
  }

  const { mutate: join, loading: joinLoading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.toPath()
  });

  const isModerator = (item: any) => {
    return (
      item.moderators.indexOf(user.pk) !== -1 || user.role === ROLE_MODERATOR
    );
  };

  const isParticipant = (item: any) => {
    return item.users.indexOf(user.pk) !== -1;
  };

  const hasRequest = (item: any) => {
    return Boolean(item.request);
  };

  return (
    <div className="container-clubs">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${clubsCount > 0 ? `(${clubsCount})` : ""}`}
        fixed={true}
      >
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
        <div onClick={() => toggleShowFilters(true)}>
          <i
            className={`fa fa-filter ${
              applyFilters ? "text-notification" : ""
            }`}
          />
        </div>
        <div>
          <Link to={CLIENT_URLS.USER.CLUB_CREATE.toPath()}>
            <i className="fa fa-plus" />
          </Link>
        </div>
      </Header>
      <div className="clubs-search">
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
      <div className="clubs-list">
        {joinLoading && <Loading />}
        {!loading && clubsItems.length === 0 && (
          <Alert variant="warning">
            <div>{_("No clubs.")}</div>
            <hr />
            <div className="d-flex">
              <Button
                size="sm"
                variant="warning"
                onClick={() => {
                  changeMenuPage(MENU_PAGE_SEARCH);
                }}
              >
                <i className="fa fa-search" /> {_("Search a club")}
              </Button>
            </div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={clubsCount}
          objs={clubsItems}
          loading={loading}
          getParamsHash={JSON.stringify(getParams)}
        >
          {(item: any) => (
            <div className="clubs-item block" key={item.pk}>
              <div className="clubs-header">
                <div className="clubs-avatar">
                  <Link
                    to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                      clubSlug: item.slug
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
                <div className="clubs-title">
                  <div className="clubs-title-name">
                    <Link
                      to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                        clubSlug: item.slug
                      })}
                    >
                      {isModerator(item) && item.requests_count > 0 && (
                        <Badge variant="primary">{item.requests_count}</Badge>
                      )}{" "}
                      {item.name}
                    </Link>
                  </div>
                  <div className="clubs-title-geo">{getGeo(item)}</div>
                </div>
                <div className="clubs-actions">
                  {isModerator(item) && (
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
                                  to={CLIENT_URLS.USER.CLUB_UPDATE.toPath({
                                    urlParams: {
                                      clubSlug: item.slug
                                    }
                                  })}
                                >
                                  <i className="fa fa-pencil" /> {_("Update")}
                                </Link>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <DeleteItem
                                  description={_(
                                    "Are you sure you want to delete the club?"
                                  )}
                                  onSuccess={() => refetch()}
                                  path={SERVER_URLS.CLUB_DELETE.toPath({
                                    urlParams: {
                                      clubSlug: item.slug
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
              <div className="clubs-body">
                <div className="clubs-text">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <span className="item-title">{_("Type")}:</span>
                      {item.club_type.display}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("Theme")}:</span>
                      {item.relationship_theme.display}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("Participants")}:</span>
                      {item.users.length}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("About")}:</span>
                      <ShowMore
                        lines={3}
                        more={_("Show more")}
                        less={_("Show less")}
                        anchorClass=""
                      >
                        {renderHtml(item.description)}
                      </ShowMore>
                    </ListGroup.Item>
                    {!isParticipant(item) && (
                      <ListGroup.Item className="actions">
                        {hasRequest(item) ? (
                          <DeleteItem
                            description={_(
                              "Are you sure you want to delete the request to join this club?"
                            )}
                            onSuccess={() => refetch()}
                            path={SERVER_URLS.MEMBERSHIP_REQUESTS_DELETE.toPath(
                              {
                                urlParams: {
                                  membershipPk: item.request
                                }
                              }
                            )}
                          >
                            <Button
                              size="sm"
                              className="float-right"
                              variant="danger"
                            >
                              <i className="fa fa-trash" />{" "}
                              {_("Drop your request")}
                            </Button>
                          </DeleteItem>
                        ) : (
                          <Button
                            size="sm"
                            className="float-right"
                            onClick={() => {
                              join({
                                content_type: "clubs:club",
                                object_id: item.pk
                              })
                                .then((result: any) => {
                                  handleSuccess(
                                    _(
                                      "Your request has been sent successfully."
                                    )
                                  );
                                  refetch();
                                })
                                .catch((errors: any) => {
                                  handleErrors(errors);
                                });
                            }}
                          >
                            <i className="fa fa-handshake-o" />{" "}
                            {_("Join to this club")}
                          </Button>
                        )}
                      </ListGroup.Item>
                    )}
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
        <Modal.Body>
          <FormAsyncSelect
            label={_("Country")}
            placeholder={_("Start typing...")}
            name="city__country"
            value={filters.country}
            onChange={(target: any) => {
              changeFilters({
                ...filters,
                country: target.value
              });
            }}
            fetchURL={SERVER_URLS.SELECTS.COUNTRY.toPath()}
          />
          <FormAsyncSelect
            label={_("Region/State")}
            placeholder={_("Start typing...")}
            name="city__region"
            value={filters.region}
            onChange={(target: any) => {
              changeFilters({
                ...filters,
                region: target.value
              });
            }}
            fetchURL={SERVER_URLS.SELECTS.REGION.toPath()}
            filterURL={`country=${
              filters.country && filters.country.pk
                ? filters.country.pk
                : user.city.country.pk
            }`}
          />
          <FormAsyncSelect
            label={_("City")}
            placeholder={_("Start typing...")}
            name="city"
            value={filters.city}
            onChange={(target: any) => {
              changeFilters({
                ...filters,
                city: target.value
              });
            }}
            fetchURL={SERVER_URLS.SELECTS.CITY.toPath()}
            filterURL={`region=${
              filters.region && filters.region.pk
                ? filters.region.pk
                : user.city.region.pk
            }`}
          />
          <hr />
          <FormSelect
            label={_("Theme")}
            name="relationship_theme"
            isClearable={true}
            options={COMMUNITY_THEMES}
            value={filters.relationship_theme}
            onChange={(target: any) =>
              changeFilters({
                ...filters,
                relationship_theme: target.value
              })
            }
          />
          <FormSelect
            label={_("Type")}
            name="club_type"
            isClearable={true}
            options={COMMUNITY_TYPES}
            value={filters.club_type}
            onChange={(target: any) =>
              changeFilters({
                ...filters,
                club_type: target.value
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
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
                changeMenuPage(MENU_PAGE_MY);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-venus-mars" /> {_("My clubs")}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeMenuPage(MENU_PAGE_SEARCH);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-search" /> {_("Search clubs")}
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to={CLIENT_URLS.USER.CLUB_REQUESTS.toPath()}>
                <i className="fa fa-list-ol" /> {_("My requests to join clubs")}
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default withGuestAlert(ClubList);

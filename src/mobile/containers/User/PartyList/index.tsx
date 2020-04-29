import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import queryString from "query-string";
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
import Moment from "react-moment";

import Image from "generic/components/Image";
import defaultSVG from "generic/layout/images/picture.svg";

import { ROLE_MODERATOR } from "generic/constants";
import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "mobile/routes/client";
import PaginateList from "generic/components/PaginateList";
import { getGeo } from "desktop/containers/User/Profile/utils";
import { renderHtml, getLocale } from "utils";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormSelect from "generic/components/Form/FormSelect";
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from "generic/constants";
import Header from "mobile/containers/Header";
import DeleteItem from "mobile/components/DeleteItem";
import { withGuestAlert } from "mobile/components/GuestAlert";

import Likes from "desktop/components/Likes";
import PartyActions from "../../../../generic/components/PartyActions";

const MENU_PAGE_SEARCH = "search";
const MENU_PAGE_MY = "my";
const MENU_PAGE_PAST = "past";

const PartyList: React.SFC<any> = () => {
  const location = useLocation();
  const { objectId, contentType } = queryString.parse(location.search);

  const [showMenu, toggleShowMenu] = useState(false);
  const [showFilters, toggleShowFilters] = useState(false);

  const [search, changeSearch] = useState("");
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState(MENU_PAGE_SEARCH);

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
    theme: null,
    party_type: null
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
    theme: serverFilters.theme !== null ? serverFilters.theme.value : undefined,
    party_type:
      serverFilters.party_type !== null
        ? serverFilters.party_type.value
        : undefined,
    is_participant: menuPage === MENU_PAGE_MY ? true : undefined,
    is_past: menuPage === MENU_PAGE_PAST ? true : false,
    object_id: objectId,
    content_type: contentType
  };
  const { data: partiesData, loading, refetch } = useGet({
    path: SERVER_URLS.PARTY_LIST.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const partiesItems = (partiesData || {}).results || [];
  const partiesCount = (partiesData || {}).count || 0;

  let title =
    contentType === "clubs:club" ? _("Club parties") : _("My parties");
  switch (menuPage) {
    case MENU_PAGE_SEARCH:
      title = _("Search a party");
      break;
    case MENU_PAGE_PAST:
      title = _("Past parties");
      break;
    case MENU_PAGE_MY:
    default:
      break;
  }

  const isModerator = (item: any) => {
    return (
      item.moderators.indexOf(user.pk) !== -1 || user.role === ROLE_MODERATOR
    );
  };

  return (
    <div className="container-parties">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${partiesCount > 0 ? `(${partiesCount})` : ""}`}
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
          <Link
            to={CLIENT_URLS.USER.PARTY_CREATE.toPath({
              getParams: {
                objectId,
                contentType
              }
            })}
          >
            <i className="fa fa-plus" />
          </Link>
        </div>
      </Header>
      <div className="parties-search">
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
      <div className="parties-list">
        {!loading && partiesItems.length === 0 && (
          <Alert variant="warning">
            <div>{_("No parties.")}</div>
            <hr />
            <div className="d-flex">
              <Button
                size="sm"
                variant="warning"
                onClick={() => {
                  changeMenuPage(MENU_PAGE_SEARCH);
                }}
              >
                <i className="fa fa-search" /> {_("Search a party")}
              </Button>
            </div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={partiesCount}
          objs={partiesItems}
          loading={loading}
          getParamsHash={JSON.stringify(getParams)}
        >
          {(item: any) => (
            <div className="parties-item block" key={item.pk}>
              <div className="parties-header">
                <div className="parties-avatar">
                  <Link
                    to={CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
                      partySlug: item.slug
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
                <div className="parties-title">
                  <div className="parties-title-name">
                    <Link
                      to={CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
                        partySlug: item.slug
                      })}
                    >
                      <>{item.name}</>
                    </Link>
                  </div>
                  <div className="parties-title-geo">{getGeo(item)}</div>
                </div>
                <div className="parties-actions">
                  {isModerator(item.club) && (
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
                                  to={CLIENT_URLS.USER.PARTY_UPDATE.toPath({
                                    urlParams: {
                                      partySlug: item.slug
                                    }
                                  })}
                                >
                                  <i className="fa fa-pencil" /> {_("Update")}
                                </Link>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <DeleteItem
                                  description={_(
                                    "Are you sure you want to delete the party?"
                                  )}
                                  onSuccess={() => refetch()}
                                  path={SERVER_URLS.PARTY_DELETE.toPath({
                                    urlParams: {
                                      partySlug: item.slug
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
              <div className="parties-body">
                <div className="parties-text">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <span className="item-title">{_("Club")}:</span>
                      <Link
                        to={CLIENT_URLS.USER.CLUB_DETAIL.toPath({
                          urlParams: {
                            clubSlug: item.club.slug
                          }
                        })}
                      >
                        {item.club.name}
                      </Link>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("Type")}:</span>
                      {item.party_type.display}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("Theme")}:</span>
                      {item.theme.display}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("Start date")}:</span>
                      <Moment locale={getLocale()} format="DD.MM.YYYY HH:mm">
                        {item.start_date}
                      </Moment>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("End date")}:</span>
                      <Moment locale={getLocale()} format="DD.MM.YYYY HH:mm">
                        {item.end_date}
                      </Moment>
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
                    <ListGroup.Item className="actions">
                      <PartyActions item={item} refetch={refetch} user={user} />
                    </ListGroup.Item>
                  </ListGroup>
                </div>
                <div className="parties-footer">
                  <Likes
                    likePath={SERVER_URLS.PARTY_LIKE.buildPath({
                      partySlug: item.slug
                    })}
                    item={item}
                  />
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
            placeholder={_("Start typing...")}
            name="relationship_theme"
            isClearable={true}
            options={COMMUNITY_THEMES}
            value={filters.theme}
            onChange={(target: any) =>
              changeFilters({
                ...filters,
                theme: target.value
              })
            }
          />
          <FormSelect
            label={_("Type")}
            placeholder={_("Start typing...")}
            name="party_type"
            isClearable={true}
            options={COMMUNITY_TYPES}
            value={filters.party_type}
            onChange={(target: any) =>
              changeFilters({
                ...filters,
                party_type: target.value
              })
            }
          />
        </Modal.Body>
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
                changeMenuPage(MENU_PAGE_SEARCH);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-search" /> {_("Search a party")}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_MY);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-calendar" /> {_("My parties")}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_PAST);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-step-backward" /> {_("Past parties")}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default withGuestAlert(PartyList);

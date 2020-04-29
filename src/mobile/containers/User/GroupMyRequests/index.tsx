import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Modal, ListGroup, Alert } from "react-bootstrap";
import { useGet } from "restful-react";
import ShowMore from "react-show-more";

import Image from "generic/components/Image";
import defaultSVG from "generic/layout/images/picture.svg";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "mobile/routes/client";
import PaginateList from "generic/components/PaginateList";
import { renderHtml } from "utils";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import Header from "mobile/containers/Header";
import RequestActions from "mobile/components/RequestActions";

const FILTER_PAGE_WAITING = "waiting";
const FILTER_PAGE_APPROVED = "approved";
const FILTER_PAGE_DECLINED = "declined";

const GroupMyRequests: React.SFC<any> = () => {
  const [showFilter, toggleShowFilter] = useState(false);

  const [offset, changeOffset] = useState(0);

  const [filterPage, changeFilterPage] = useState(FILTER_PAGE_WAITING);

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    pk: null
  };

  const getParams = {
    content_type: "groups:group",
    status: filterPage,
    user: user.pk
  };
  const { data: requestsData, loading, refetch } = useGet({
    path: SERVER_URLS.MEMBERSHIP_REQUESTS_LIST.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const requestsItems = (requestsData || {}).results || [];
  const requestsCount = (requestsData || {}).count || 0;

  let faStatusIcon = "fa-clock-o";
  switch (filterPage) {
    case FILTER_PAGE_APPROVED:
      faStatusIcon = "fa-check";
      break;
    case FILTER_PAGE_DECLINED:
      faStatusIcon = "fa-ban";
      break;
    case FILTER_PAGE_WAITING:
    default:
      break;
  }
  return (
    <div className="container-requests">
      <Helmet>
        <title>{"My requests to join groups"}</title>
        <meta name="description" content={"My requests to join groups"} />
      </Helmet>
      <Header
        name={`${"My requests to join groups"} ${
          requestsCount > 0 ? `(${requestsCount})` : ""
        }`}
        fixed={true}
      >
        <div onClick={() => toggleShowFilter(true)}>
          <i className="fa fa-filter" />
        </div>
      </Header>
      <div className="requests-list">
        {!loading && requestsItems.length === 0 && (
          <Alert variant="warning">
            <div>{_("No requests.")}</div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={requestsCount}
          objs={requestsItems}
          loading={loading}
          getParamsHash={JSON.stringify(getParams)}
        >
          {(item: any) => (
            <div className="requests-item block" key={item.content_object.pk}>
              <div className="requests-header">
                <div className="requests-avatar">
                  <Link
                    to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                      groupSlug: item.content_object.slug
                    })}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={
                        item.content_object.image &&
                        item.content_object.image.thumbnail_100x100
                          ? item.content_object.image.thumbnail_100x100
                          : defaultSVG
                      }
                    />
                  </Link>
                </div>
                <div className="requests-title">
                  <div className="requests-title-name">
                    <i className={`fa ${faStatusIcon}`} />{" "}
                    <Link
                      to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                        groupSlug: item.content_object.slug
                      })}
                    >
                      {item.content_object.name}
                    </Link>
                  </div>
                  <div className="requests-title-geo" />
                </div>
                <div className="requests-actions">
                  <RequestActions
                    mine={true}
                    membershipPk={item.pk}
                    refetch={refetch}
                  />
                </div>
              </div>
              <div className="requests-body">
                <div className="requests-text">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <span className="item-title">{_("Type")}:</span>
                      {item.content_object.group_type.display}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("Theme")}:</span>
                      {item.content_object.relationship_theme.display}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("Participants")}:</span>
                      {item.content_object.users.length}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_("About")}:</span>
                      <ShowMore
                        lines={3}
                        more={_("Show more")}
                        less={_("Show less")}
                        anchorClass=""
                      >
                        {renderHtml(item.content_object.description)}
                      </ShowMore>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </div>
            </div>
          )}
        </PaginateList>
      </div>
      <Modal size="lg" show={showFilter} onHide={() => toggleShowFilter(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-filter" /> {_("Filters")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeFilterPage(FILTER_PAGE_WAITING);
                toggleShowFilter(false);
              }}
            >
              <i className="fa fa-clock-o" /> {_("Pending")}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeFilterPage(FILTER_PAGE_APPROVED);
                toggleShowFilter(false);
              }}
            >
              <i className="fa fa-check" /> {_("Approved")}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeFilterPage(FILTER_PAGE_DECLINED);
                toggleShowFilter(false);
              }}
            >
              <i className="fa fa-ban" /> {_("Declined")}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GroupMyRequests;

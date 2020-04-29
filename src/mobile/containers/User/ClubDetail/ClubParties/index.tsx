import React from "react";
import { useGet } from "restful-react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { OverlayTrigger, Popover, ListGroup, Button } from "react-bootstrap";
import { getGeo } from "desktop/containers/User/Profile/utils";

import { ROLE_MODERATOR } from "generic/constants";
import { _ } from "trans";
import Image from "generic/components/Image";
import { SERVER_URLS } from "routes/server";
import Loading from "generic/components/Loading";
import { CLIENT_URLS } from "desktop/routes/client";
import DeleteItem from "mobile/components/DeleteItem";
import ShowMore from "react-show-more";
import { renderHtml } from "utils";
import defaultSVG from "generic/layout/images/picture.svg";
import Likes from "desktop/components/Likes";

const ClubParties: React.SFC<any> = ({ club, user }) => {
  const { data: partiesData, loading: partiesLoading, refetch } = useGet({
    path: SERVER_URLS.PARTY_LIST.toPath({
      getParams: {
        limit: 10,
        offset: 0,
        club: club.pk
      }
    })
  });
  const partiesItems = (partiesData || {}).results || [];

  const isModerator = (item: any) => {
    return (
      item.moderators.map((m: any) => m.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR
    );
  };

  return (
    <div className="club-parties block">
      <h2>
        {_("Parties")} (
        <Link
          to={CLIENT_URLS.USER.PARTY_LIST.toPath({
            getParams: {
              club: club.pk
            }
          })}
        >
          {_("All")}
        </Link>
        )
      </h2>
      {partiesLoading && <Loading />}
      {isModerator(club) && (
        <LinkContainer
          to={CLIENT_URLS.USER.PARTY_CREATE.toPath({
            getParams: {
              club: club.pk
            }
          })}
        >
          <Button size="sm">
            <i className="fa fa-plus" /> {_("Create a party")}
          </Button>
        </LinkContainer>
      )}
      {!isModerator(club) && partiesItems.length === 0 && (
        <span className="empty-value">--</span>
      )}
      <div className="party-items">
        {partiesItems.slice(0, 3).map((item: any, index: number) => (
          <div className="site-party-item" key={index}>
            <div className="site-party-header">
              <div className="site-party-avatar">
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
              <div className="site-party-title">
                <div className="site-party-title-name">
                  <Link
                    to={CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
                      partySlug: item.slug
                    })}
                  >
                    <>{item.name}</>
                  </Link>
                </div>
                <div className="site-party-title-geo">{getGeo(item)}</div>
              </div>
              <div className="site-party-actions">
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
            <div className="site-party-body">
              <div className="site-party-text">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <ShowMore
                      lines={10}
                      more={_("Show more")}
                      less={_("Show less")}
                      anchorClass=""
                    >
                      {renderHtml(item.description)}
                    </ShowMore>
                  </ListGroup.Item>
                </ListGroup>
              </div>
              <div className="site-party-footer">
                <Likes
                  likePath={SERVER_URLS.PARTY_LIKE.buildPath({
                    partySlug: item.slug
                  })}
                  item={item}
                />
              </div>
            </div>
          </div>
        ))}
        {partiesItems.length > 3 && (
          <div className="show-more">
            <Link
              to={CLIENT_URLS.USER.PARTY_LIST.toPath({
                getParams: {
                  club: club.pk
                }
              })}
            >
              {_("Show more")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubParties;

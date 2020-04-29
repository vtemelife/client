import React from "react";
import { useGet } from "restful-react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { OverlayTrigger, Popover, ListGroup, Button } from "react-bootstrap";

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

const ProfilePosts: React.SFC<any> = ({ profile, user }) => {
  const { data: postsData, loading: postsLoading, refetch } = useGet({
    path: SERVER_URLS.POSTS.toPath({
      getParams: {
        limit: 10,
        offset: 0,
        object_id: profile.pk,
        content_type: "users:user"
      }
    })
  });
  const postsItems = (postsData || {}).results || [];

  const isCreator = (item: any) => {
    return item.creator === user.pk || user.role === ROLE_MODERATOR;
  };

  return (
    <div className="profile-posts block">
      <h2>
        {_("Posts")} (
        <Link
          to={CLIENT_URLS.POSTS.toPath({
            getParams: {
              objectId: profile.pk,
              contentType: "users:user"
            }
          })}
        >
          {_("All")}
        </Link>
        )
      </h2>
      {postsLoading && <Loading />}
      {profile.pk === user.pk && postsItems.length === 0 && (
        <LinkContainer
          to={CLIENT_URLS.USER.POST_CREATE.toPath({
            getParams: {
              objectId: profile.pk,
              contentType: "users:user"
            }
          })}
        >
          <Button size="sm">
            <i className="fa fa-plus" /> {_("Create a post")}
          </Button>
        </LinkContainer>
      )}
      {profile.pk !== user.pk && postsItems.length === 0 && (
        <span className="empty-value">--</span>
      )}
      <div className="post-items">
        {postsItems.slice(0, 3).map((item: any, index: number) => (
          <div className="site-post-item" key={index}>
            <div className="site-post-header">
              <div className="site-post-avatar">
                <Link
                  to={CLIENT_URLS.POSTS_DETAIL.buildPath({
                    postSlug: item.slug
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
              <div className="site-post-title">
                <div className="site-post-title-name">
                  <Link
                    to={CLIENT_URLS.POSTS_DETAIL.buildPath({
                      postSlug: item.slug
                    })}
                  >
                    <>{item.title}</>
                  </Link>
                </div>
                <div className="site-post-title-geo" />
              </div>
              <div className="site-post-actions">
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
                                to={CLIENT_URLS.USER.POST_UPDATE.toPath({
                                  urlParams: {
                                    postSlug: item.slug
                                  }
                                })}
                              >
                                <i className="fa fa-pencil" /> {_("Update")}
                              </Link>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <DeleteItem
                                description={_(
                                  "Are you sure you want to delete the post?"
                                )}
                                onSuccess={() => refetch()}
                                path={SERVER_URLS.POSTS_DELETE.toPath({
                                  urlParams: {
                                    postSlug: item.slug
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
            <div className="site-post-body">
              <div className="site-post-text">
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
              <div className="site-post-footer">
                <Likes
                  likePath={SERVER_URLS.POSTS_LIKE.buildPath({
                    postSlug: item.slug
                  })}
                  item={item}
                />
              </div>
            </div>
          </div>
        ))}
        {postsItems.length > 3 && (
          <div className="show-more">
            <Link
              to={CLIENT_URLS.POSTS.toPath({
                getParams: {
                  objectId: profile.pk,
                  contentType: "users:user"
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

export default ProfilePosts;

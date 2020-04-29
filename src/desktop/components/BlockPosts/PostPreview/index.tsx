import React from "react";
import { Media, Col, ButtonGroup, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import compose from "lodash/flowRight";

import { ROLE_MODERATOR } from "generic/constants";
import { withAuthUser } from "generic/containers/Decorators";
import Delete from "desktop/containers/Generics/Delete";

import Image from "generic/components/Image";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import { renderHtml } from "utils";
import { _ } from "trans";
import Likes from "../../Likes";

import postSVG from "generic/layout/images/picture.svg";
import ShowMore from "react-show-more";

interface IProps {
  item: any;
  refetch: any;
  authUser: any;
}

class PostPreview extends React.PureComponent<IProps> {
  public render() {
    const user = this.props.authUser.user;
    const item = this.props.item;

    const isCreator = item.creator === user.pk;
    const isUpdateCreator = isCreator || user.role === ROLE_MODERATOR;
    return (
      <Col lg={12} md={12} sm={12} className="post-item-container">
        <Media>
          <Link
            to={CLIENT_URLS.POSTS_DETAIL.buildPath({
              postSlug: item.slug
            })}
          >
            {item.image && item.image.thumbnail_500x500 ? (
              <Image
                width={200}
                height={200}
                className="mr-3"
                src={item.image.thumbnail_500x500}
              />
            ) : (
              <Image width={200} height={200} className="mr-3" src={postSVG} />
            )}
          </Link>
          <Media.Body>
            <Row className="post-item-data">
              <Col lg={9} md={9} sm={9} xs={9}>
                <Link
                  to={CLIENT_URLS.POSTS_DETAIL.buildPath({
                    postSlug: item.slug
                  })}
                >
                  <div className="text-break post-item-title">{item.title}</div>
                </Link>
                {item.theme && (
                  <div className="info">
                    <i className="fa fa-tags" /> {_("Theme")}:{" "}
                    {item.theme.display}
                  </div>
                )}
                <div className="text-break post-item-info" />
                {item.description && (
                  <div className="text-break post-item-description">
                    <ShowMore
                      lines={10}
                      more={_("Show more")}
                      less={_("Show less")}
                      anchorClass=""
                    >
                      {renderHtml(item.description)}
                    </ShowMore>
                  </div>
                )}
              </Col>
              <Col lg={3} md={3} sm={3} xs={3} className="post-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  {isUpdateCreator && (
                    <LinkContainer
                      to={CLIENT_URLS.USER.POST_UPDATE.buildPath({
                        postSlug: item.slug
                      })}
                    >
                      <Button size="sm">
                        <i className="fa fa-pencil" />
                      </Button>
                    </LinkContainer>
                  )}
                  {isCreator && (
                    <Delete
                      description={_(
                        "Are you sure you want to delete the post?"
                      )}
                      onSuccess={(result: any) => this.props.refetch()}
                      destoryServerPath={SERVER_URLS.POSTS_DELETE.buildPath({
                        postSlug: item.slug
                      })}
                      method="PATCH"
                    >
                      <Button size="sm" variant="danger">
                        <i className="fa fa-trash" />
                      </Button>
                    </Delete>
                  )}
                </ButtonGroup>
              </Col>
            </Row>
          </Media.Body>
        </Media>
        <Likes
          likePath={SERVER_URLS.POSTS_LIKE.buildPath({ postSlug: item.slug })}
          item={item}
        />
        <hr />
      </Col>
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

export default compose(withAuth)(PostPreview);

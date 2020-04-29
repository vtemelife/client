import React from "react";
import compose from "lodash/flowRight";
import { Media, Button, Col, ButtonGroup, Row, Badge } from "react-bootstrap";
import { Mutate } from "restful-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import clubSVG from "generic/layout/images/picture.svg";

import Image from "generic/components/Image";
import { renderHtml } from "utils";
import handleErrors from "desktop/components/ResponseErrors/utils";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import { _ } from "trans";
import { getGeo } from "../../Profile/utils";
import Delete from "desktop/containers/Generics/Delete";

import { withAuthUser } from "generic/containers/Decorators";
import { ROLE_MODERATOR } from "generic/constants";
import ShowMore from "react-show-more";

interface IProps {
  item: any;
  refetch: any;
  authUser: any;
}

class ClubItem extends React.PureComponent<IProps> {
  public render() {
    const user = this.props.authUser.user;
    const item = this.props.item;

    const isUser = item.users.indexOf(user.pk) !== -1;
    const isModerator =
      item.moderators.indexOf(user.pk) !== -1 || user.role === ROLE_MODERATOR;
    return (
      <Col lg={12} className="club-item-container">
        <Media>
          <Link
            to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({ clubSlug: item.slug })}
          >
            <div>
              {item.image && item.image.thumbnail_500x500 ? (
                <Image
                  width={200}
                  height={200}
                  className="mr-3"
                  src={item.image.thumbnail_500x500}
                />
              ) : (
                <Image
                  width={200}
                  height={200}
                  className="mr-3"
                  src={clubSVG}
                />
              )}
            </div>
          </Link>
          <Media.Body>
            <Row className="club-item-data">
              <Col lg={9}>
                <Link
                  to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                    clubSlug: item.slug
                  })}
                >
                  <div className="text-break club-item-title">
                    {isModerator && item.requests_count > 0 && (
                      <>
                        <Badge variant="primary">{item.requests_count}</Badge>{" "}
                      </>
                    )}
                    {item.name}
                  </div>
                </Link>
                <div className="text-break club-item-info">
                  <p>
                    <span className="title">{_("Geo")}:</span> {getGeo(item)}
                  </p>
                  <p>
                    <span className="title">{_("Type")}:</span>{" "}
                    {item.club_type.display}
                  </p>
                  <p>
                    <span className="title">{_("Theme")}:</span>{" "}
                    {item.relationship_theme.display}
                  </p>
                  <p>
                    <span className="title">{_("Participants")}:</span>{" "}
                    {item.users.length}
                  </p>
                </div>
                {item.description && (
                  <div className="text-break club-item-description">
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
              <Col lg={3} className="club-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  {!isUser && (
                    <Mutate
                      verb="POST"
                      path={SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.buildPath()}
                    >
                      {(joinClub, response) => (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => {
                            joinClub({
                              content_type: "clubs:club",
                              object_id: item.pk
                            })
                              .then((result: any) => {
                                this.props.refetch();
                                toast.success(
                                  _(
                                    "You have sent a request to join the club. Waiting for moderation."
                                  )
                                );
                              })
                              .catch((errors: any) => {
                                handleErrors(errors);
                              });
                          }}
                        >
                          <i className="fa fa-plus" /> {_("Join")}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {isModerator && (
                    <LinkContainer
                      to={CLIENT_URLS.USER.CLUB_UPDATE.buildPath({
                        clubSlug: item.slug
                      })}
                    >
                      <Button size="sm">
                        <i className="fa fa-pencil" />
                      </Button>
                    </LinkContainer>
                  )}
                  {isModerator && (
                    <Delete
                      title={_("Are you sure?")}
                      description={_(
                        "Are you sure you want to delete the club?"
                      )}
                      onSuccess={(result: any) => this.props.refetch()}
                      destoryServerPath={SERVER_URLS.CLUB_DELETE.buildPath({
                        clubSlug: item.slug
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
        <hr />
      </Col>
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

export default compose(withAuth)(ClubItem);

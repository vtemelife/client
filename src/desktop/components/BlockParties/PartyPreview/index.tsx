import React from "react";
import { Media, Col, ButtonGroup, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { LinkContainer } from "react-router-bootstrap";
import compose from "lodash/flowRight";

import { ROLE_MODERATOR } from "generic/constants";
import { withAuthUser, withRestMutate } from "generic/containers/Decorators";
import { getGeo } from "desktop/containers/User/Profile/utils";
import Delete from "desktop/containers/Generics/Delete";
import Likes from "desktop/components/Likes";

import Image from "generic/components/Image";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";

import { renderHtml } from "utils";

import { _ } from "trans";

import partySVG from "generic/layout/images/picture.svg";
import { getLocale } from "utils";
import PartyActions from "generic/components/PartyActions";
import ShowMore from "react-show-more";

interface IProps {
  item: any;
  refetch: any;
  authUser: any;
  applyParty: any;
}

class PartyPreview extends React.PureComponent<IProps> {
  public render() {
    const user = this.props.authUser.user;
    const item = this.props.item;
    const locale = getLocale();

    const isModerator =
      item.club.moderators.indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR;
    return (
      <Col lg={12} md={12} sm={12} className="party-item-container">
        <Media>
          <Link
            to={CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
              partySlug: item.slug
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
              <Image width={200} height={200} className="mr-3" src={partySVG} />
            )}
          </Link>
          <Media.Body>
            <Row className="party-item-data">
              <Col lg={9} md={8} sm={8} xs={8}>
                <Link
                  to={CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
                    partySlug: item.slug
                  })}
                >
                  <div className="text-break party-item-title">{item.name}</div>
                </Link>
                <div className="text-break party-item-info">
                  <p>
                    <span className="title">{_("Club")}:</span>{" "}
                    <Link
                      to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                        clubSlug: item.club.slug
                      })}
                    >
                      {item.club.name}
                    </Link>
                  </p>
                  <p>
                    <span className="title">{_("Theme")}:</span>{" "}
                    {item.theme.display}
                  </p>
                  <p>
                    <span className="title">{_("Geo")}:</span> {getGeo(item)}
                  </p>
                  <p>
                    <span className="title">{_("Start date")}:</span>{" "}
                    <Moment locale={locale} format="DD.MM.YYYY HH:mm">
                      {item.start_date}
                    </Moment>
                  </p>
                  <p>
                    <span className="title">{_("End date")}:</span>{" "}
                    <Moment locale={locale} format="DD.MM.YYYY HH:mm">
                      {item.end_date}
                    </Moment>
                  </p>
                  <p>
                    <span className="title">{_("Participants")}:</span>{" "}
                    {item.users.length}
                  </p>
                </div>
                {item.short_description && (
                  <div className="text-break party-item-description">
                    <ShowMore
                      lines={10}
                      more={_("Show more")}
                      less={_("Show less")}
                      anchorClass=""
                    >
                      {renderHtml(item.short_description)}
                    </ShowMore>
                  </div>
                )}
              </Col>
              <Col lg={3} md={4} sm={4} xs={4} className="party-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  <PartyActions
                    item={item}
                    refetch={this.props.refetch}
                    user={user}
                    disableLoading={true}
                  />
                </ButtonGroup>
                <ButtonGroup vertical={true} className="float-right">
                  {isModerator && (
                    <LinkContainer
                      to={CLIENT_URLS.USER.PARTY_UPDATE.buildPath({
                        partySlug: item.slug
                      })}
                    >
                      <Button size="sm">
                        <i className="fa fa-pencil" />
                      </Button>
                    </LinkContainer>
                  )}
                  {isModerator && (
                    <Delete
                      description={_(
                        "Are you sure you want to delete the party?"
                      )}
                      onSuccess={(result: any) => this.props.refetch()}
                      destoryServerPath={SERVER_URLS.PARTY_DELETE.buildPath({
                        partySlug: item.slug
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
          likePath={SERVER_URLS.PARTY_LIKE.buildPath({ partySlug: item.slug })}
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

const withApplyParty = withRestMutate({
  propName: "applyParty",
  verb: "POST",
  path: (props: any) =>
    SERVER_URLS.PARTY_APPLY.buildPath({
      partySlug: props.item.slug
    })
});

export default compose(withAuth, withApplyParty)(PartyPreview);

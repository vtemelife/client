import React from "react";
import compose from "lodash/flowRight";
import { toast } from "react-toastify";
import { Button, Card, ButtonGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { withRouter } from "react-router";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import Delete from "desktop/containers/Generics/Delete";
import handleErrors from "desktop/components/ResponseErrors/utils";
import { ROLE_MODERATOR } from "generic/constants";
import { withAuthUser, withRestMutate } from "generic/containers/Decorators";

interface IProps {
  match: any;

  club: any;
  onDeleteSuccess: any;
  onLeaveSuccess: any;

  authUser: any;
  clubApply: any;
  clubLeave: any;
}

class ClubActions extends React.PureComponent<IProps> {
  public clubApply = () => {
    this.props.clubApply
      .mutate({
        content_type: "clubs:club",
        object_id: this.props.club.pk
      })
      .then(() => {
        toast.success(
          _(
            "You have sent a request to the moderators of the club. Waiting for moderation. You can see all requests in the menu Clubs -> Requests."
          ),
          { autoClose: 15000 }
        );
      })
      .catch((errors: any) => {
        if (errors.data && errors.data.club && errors.data.club.length > 0) {
          toast.error(errors.data.club[0]);
        } else {
          handleErrors(errors);
        }
      });
  };

  public clubLeave = () => {
    this.props.clubLeave
      .mutate()
      .then((result: any) => {
        this.props.onLeaveSuccess();
      })
      .catch((errors: any) => {
        handleErrors(errors);
      });
  };

  public render() {
    const club = this.props.club;
    const user = this.props.authUser.user;
    const isUser = club.users.map((u: any) => u.pk).indexOf(user.pk) !== -1;
    const isModerator =
      club.moderators.map((u: any) => u.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR;
    const isCreator = club.creator === user.pk;
    return (
      <Card>
        <Card.Body className="club-action">
          <Card.Title>{_("Actions")}</Card.Title>
          <ButtonGroup vertical={true}>
            {!isUser && (
              <Button
                size="sm"
                className="float-left"
                variant="primary"
                onClick={this.clubApply}
              >
                <i className="fa fa-user-plus" /> {_("Join")}
              </Button>
            )}
            {isModerator && (
              <LinkContainer
                to={CLIENT_URLS.USER.CLUB_UPDATE.buildPath({
                  clubSlug: club.slug
                })}
              >
                <Button size="sm" className="float-right">
                  <i className="fa fa-pencil" /> {_("Update")}
                </Button>
              </LinkContainer>
            )}
            {isCreator && (
              <Delete
                description={_("Are you sure you want to delete the club?")}
                onSuccess={this.props.onDeleteSuccess}
                destoryServerPath={SERVER_URLS.CLUB_DELETE.buildPath({
                  clubSlug: club.slug
                })}
                method="PATCH"
              >
                <Button size="sm" variant="danger" className="float-right">
                  <i className="fa fa-trash" /> {_("Delete")}
                </Button>
              </Delete>
            )}
            {isUser && !isCreator && (
              <Button
                size="sm"
                variant="danger"
                className="float-left"
                onClick={() =>
                  confirmAlert({
                    title: _("Are you sure?"),
                    message: _("Are you sure you want to leave the club?"),
                    buttons: [
                      {
                        label: _("Yes"),
                        onClick: this.clubLeave
                      },
                      {
                        label: _("No"),
                        onClick: () => {
                          return;
                        }
                      }
                    ]
                  })
                }
              >
                <i className="fa fa-sign-out" /> {_("Leave the club")}
              </Button>
            )}
          </ButtonGroup>
        </Card.Body>
      </Card>
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

const withClubApply = withRestMutate({
  propName: "clubApply",
  verb: "POST",
  path: () => SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.buildPath()
});

const withClubLeave = withRestMutate({
  propName: "clubLeave",
  verb: "PATCH",
  path: (props: any) =>
    SERVER_URLS.CLUB_LEAVE.buildPath({
      clubSlug: props.match.params.clubSlug
    })
});

export default compose(
  withRouter,
  withAuth,
  withClubApply,
  withClubLeave
)(ClubActions);

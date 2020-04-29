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

  group: any;
  onDeleteSuccess: any;
  onLeaveSuccess: any;

  authUser: any;
  groupApply: any;
  groupLeave: any;
}

class GroupActions extends React.PureComponent<IProps> {
  public groupApply = () => {
    this.props.groupApply
      .mutate({
        content_type: "groups:group",
        object_id: this.props.group.pk
      })
      .then(() => {
        toast.success(
          _(
            "You sent a request to the moderators of the group. Waiting for moderation. You can see all requests in the menu Groups -> Requests."
          ),
          { autoClose: 15000 }
        );
      })
      .catch((errors: any) => {
        if (errors.data && errors.data.group && errors.data.group.length > 0) {
          toast.error(errors.data.group[0]);
        } else {
          handleErrors(errors);
        }
      });
  };

  public groupLeave = () => {
    this.props.groupLeave
      .mutate()
      .then((result: any) => {
        this.props.onLeaveSuccess();
      })
      .catch((errors: any) => {
        handleErrors(errors);
      });
  };

  public render() {
    const group = this.props.group;
    const user = this.props.authUser.user;
    const isUser = group.users.map((u: any) => u.pk).indexOf(user.pk) !== -1;
    const isModerator =
      group.moderators.map((u: any) => u.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR;
    const isCreator = group.creator === user.pk;
    return (
      <Card>
        <Card.Body className="group-action">
          <Card.Title>{_("Actions")}</Card.Title>
          <ButtonGroup vertical={true}>
            {!isUser && (
              <Button
                size="sm"
                className="float-left"
                variant="primary"
                onClick={this.groupApply}
              >
                <i className="fa fa-user-plus" /> {_("Join")}
              </Button>
            )}
            {isModerator && (
              <LinkContainer
                to={CLIENT_URLS.USER.GROUP_UPDATE.buildPath({
                  groupSlug: group.slug
                })}
              >
                <Button size="sm" className="float-right">
                  <i className="fa fa-pencil" /> {_("Update")}
                </Button>
              </LinkContainer>
            )}
            {isCreator && (
              <Delete
                title={_("Are you sure?")}
                description={_("Are you sure you want to delete the group?")}
                onSuccess={this.props.onDeleteSuccess}
                destoryServerPath={SERVER_URLS.GROUP_DELETE.buildPath({
                  groupSlug: group.slug
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
                    message: _("Are you sure you want to leave the group?"),
                    buttons: [
                      {
                        label: _("Yes"),
                        onClick: this.groupLeave
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
                <i className="fa fa-sign-out" /> {_("Leave the group")}
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

const withGroupApply = withRestMutate({
  propName: "groupApply",
  verb: "POST",
  path: () => SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.buildPath()
});

const withGroupLeave = withRestMutate({
  propName: "groupLeave",
  verb: "PATCH",
  path: (props: any) =>
    SERVER_URLS.GROUP_LEAVE.buildPath({
      groupSlug: props.match.params.groupSlug
    })
});

export default compose(
  withRouter,
  withAuth,
  withGroupApply,
  withGroupLeave
)(GroupActions);

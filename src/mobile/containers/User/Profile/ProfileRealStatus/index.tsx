import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";

import { _ } from "trans";
import { Link } from "react-router-dom";
import { CLIENT_URLS } from "desktop/routes/client";
import { LinkContainer } from "react-router-bootstrap";
import { useMutate } from "restful-react";
import { SERVER_URLS } from "routes/server";
import Loading from "react-loading";
import { handleSuccess, handleErrors } from "utils";

const ProfileRealStatus: React.SFC<any> = ({ profile, user, refetch }) => {
  const { mutate: giveRealStatus, loading: giveRealStatusLoading } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.PROFILE_GIVE_REAL_STATUS.toPath({
      urlParams: {
        userSlug: profile.slug
      }
    })
  });
  return (
    <span className="actions">
      {giveRealStatusLoading && <Loading />}
      {profile.is_real ? (
        <span>
          <i className="fa fa-check green-color" /> {_("Yes")}
          {profile.approver && (
            <span>
              {" - "}
              {_("received by user")}{" "}
              <Link
                to={CLIENT_URLS.USER.PROFILE.toPath({
                  urlParams: {
                    userSlug: profile.approver.slug
                  }
                })}
              >
                {profile.approver.name}
              </Link>
            </span>
          )}
        </span>
      ) : (
        <span>
          <i className="fa fa-times-circle red-color" /> {_("No")}
          {profile.pk === user.pk ? (
            <OverlayTrigger
              trigger="click"
              rootClose={true}
              placement="left"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Title as="h3">{_("Tip")}</Popover.Title>
                  <Popover.Content>
                    {_(
                      "Write to support or ask a friend with real status to click on this button on your profile and approve."
                    )}
                    <hr />
                    <LinkContainer
                      to={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.buildPath()}
                    >
                      <Button size="sm" variant="danger">
                        <i className="fa fa-comment" /> {_("Write to support")}
                      </Button>
                    </LinkContainer>
                    <br />
                    <br />
                  </Popover.Content>
                </Popover>
              }
            >
              <Button size="sm" variant="primary" className="float-left">
                <i className="fa fa-question" /> {_("Get a real status")}
              </Button>
            </OverlayTrigger>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                giveRealStatus({})
                  .then((result: any) => {
                    handleSuccess(
                      _("Your request has been sent to moderation.")
                    );
                    refetch();
                  })
                  .catch((errors: any) => {
                    handleErrors(errors);
                  });
              }}
            >
              <i className="fa fa-check" /> {_("Give a real status")}
            </Button>
          )}
        </span>
      )}
    </span>
  );
};

export default ProfileRealStatus;

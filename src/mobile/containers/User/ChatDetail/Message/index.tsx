import React, { useContext, useState } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { useMutate } from "restful-react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

import FormMsgArea from "generic/components/Form/FormMsgArea";
import Image from "generic/components/Image";
import userSVG from "generic/layout/images/user.svg";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import DeleteItem from "mobile/components/DeleteItem";

import { _ } from "trans";
import { CLIENT_URLS } from "mobile/routes/client";
import { SERVER_URLS } from "routes/server";
import { getLocale, handleErrors, renderHtml } from "utils";

const Message: React.SFC<any> = ({ item, refetchList }) => {
  const [messageForUpdate, changeMessageForUpdate] = useState(item);
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};

  const { mutate: updateMessage } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.MESSAGE_UPDATE.toPath({
      urlParams: {
        messagePk: item.pk
      }
    })
  });

  return (
    <div className="message-item" key={item.pk}>
      <div className="message-avatar">
        <Link
          to={CLIENT_URLS.USER.PROFILE.buildPath({
            userSlug: item.creator.slug
          })}
        >
          <Image
            width={50}
            height={50}
            src={
              item.creator.avatar && item.creator.avatar.thumbnail_100x100
                ? item.creator.avatar.thumbnail_100x100
                : userSVG
            }
            roundedCircle={true}
          />
        </Link>
      </div>
      <div className="message-body">
        <div className="message-title">
          <div className="message-title-name">
            <Link
              to={CLIENT_URLS.USER.PROFILE.buildPath({
                userSlug: item.creator.slug
              })}
            >
              {item.creator.name}
            </Link>
          </div>
          <div className="message-title-time">
            <Moment locale={getLocale()} fromNow={true}>
              {item.created_date}
            </Moment>
          </div>
          {!messageForUpdate.is_deleted && item.creator.pk === user.pk && (
            <OverlayTrigger
              trigger="click"
              rootClose={true}
              placement="top"
              overlay={
                <Popover
                  id="popover-message-change"
                  className="popover-message"
                >
                  <Popover.Title as="h3">
                    <i className="fa fa-bars" /> {_("Change message")}
                  </Popover.Title>
                  <Popover.Content>
                    <DeleteItem
                      description={_(
                        "Are you sure you want to delete the message?"
                      )}
                      onSuccess={() => {
                        changeMessageForUpdate({
                          ...messageForUpdate,
                          message: _("Deleted message"),
                          is_deleted: true
                        });
                        document.body.click();
                      }}
                      path={SERVER_URLS.MESSAGE_DELETE.toPath({
                        urlParams: {
                          messagePk: item.pk
                        }
                      })}
                    >
                      <Button size="sm" variant="danger">
                        {_("Delete")}
                      </Button>
                    </DeleteItem>
                    <div style={{ marginTop: "10px" }} />
                    <FormMsgArea
                      name="message"
                      required={true}
                      value={messageForUpdate.message}
                      onChange={(target: any) => {
                        changeMessageForUpdate({
                          ...messageForUpdate,
                          message: target.value
                        });
                      }}
                      onSend={() => {
                        updateMessage(messageForUpdate)
                          .then((data: any) => {
                            document.body.click();
                          })
                          .catch((errors: any) => {
                            handleErrors(errors);
                          });
                      }}
                    />
                  </Popover.Content>
                </Popover>
              }
            >
              <span className="message-edit"> {_("edit message")}</span>
            </OverlayTrigger>
          )}
        </div>
        <div className="message-attachments">
          {item.attachments_data.map(
            (attachment: any, indexAttachments: number) => (
              <Image key={indexAttachments} src={attachment.image} />
            )
          )}
        </div>
        <div className="message-text">
          <span>{renderHtml(messageForUpdate.message)}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;

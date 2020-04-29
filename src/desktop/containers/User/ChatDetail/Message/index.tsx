import React, { useContext, useState } from "react";
import {
  Button,
  OverlayTrigger,
  Popover,
  Col,
  Media,
  Row,
  Card
} from "react-bootstrap";
import userSVG from "generic/layout/images/user.svg";
import { useMutate } from "restful-react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

import FormMsgArea from "generic/components/Form/FormMsgArea";
import Image from "generic/components/Image";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import DeleteItem from "mobile/components/DeleteItem";

import { _ } from "trans";
import { CLIENT_URLS } from "mobile/routes/client";
import { SERVER_URLS } from "routes/server";
import { getLocale, handleErrors, renderHtml } from "utils";

const Message: React.SFC<any> = ({ item }) => {
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
    <Col
      lg={12}
      md={12}
      sm={12}
      className="chat-message-container"
      key={item.pk}
    >
      <Media>
        {item.creator.avatar && item.creator.avatar.thumbnail_100x100 ? (
          <Image
            width={50}
            height={50}
            className="mr-3"
            src={item.creator.avatar.thumbnail_100x100}
            roundedCircle={true}
          />
        ) : (
          <Image
            width={50}
            height={50}
            className="mr-3"
            src={userSVG}
            roundedCircle={true}
          />
        )}
        <Media.Body>
          <div className="chat-message-username">
            <Link
              to={CLIENT_URLS.USER.PROFILE.buildPath({
                userSlug: item.creator.slug
              })}
            >
              {item.creator.name}
            </Link>
            <span className="chat-message-time">
              <Moment locale={getLocale()} fromNow={true}>
                {item.created_date}
              </Moment>
            </span>
            {!messageForUpdate.is_deleted && item.creator.pk === user.pk && (
              <OverlayTrigger
                trigger="click"
                rootClose={true}
                placement="left"
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
                <span className="chat-message-edit"> {_("edit message")}</span>
              </OverlayTrigger>
            )}
          </div>
          <Row className="hat-message-attachments">
            {item.attachments_data.map((attachment: any) => (
              <Col
                lg={6}
                md={6}
                sm={6}
                key={attachment.pk}
                className="hat-message-attachment"
              >
                <Card>
                  <Card.Img variant="top" src={attachment.image} />
                </Card>
              </Col>
            ))}
          </Row>
          <div className="chat-message-description">
            {renderHtml(messageForUpdate.message)}
          </div>
        </Media.Body>
      </Media>
    </Col>
  );
};

export default Message;

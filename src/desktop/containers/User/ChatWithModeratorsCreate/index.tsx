import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { Mutate } from "restful-react";
import { Helmet } from "react-helmet-async";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import FormMsgArea from "generic/components/Form/FormMsgArea";
import handleErrors from "desktop/components/ResponseErrors/utils";
import { _ } from "trans";

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IState {
  message: string;
  attachments: any;
  errors?: any;
}

class ChatWithModeratorsCreate extends React.PureComponent<
  IPropsWrapper,
  IState
> {
  public state = {
    message: "",
    attachments: [],
    errors: undefined
  };

  public onChangeAttachments = (attachments: any) => {
    this.setState({ attachments });
  };

  public renderFooter = () => {
    return (
      <Mutate
        verb="POST"
        path={SERVER_URLS.CHAT_WITH_MODERATORS_CREATE.buildPath()}
      >
        {(sendMessage, response) => (
          <div className="comments-form-message">
            {this.state.attachments.length > 0 ? (
              <Row className="comments-form-attachments">
                {this.state.attachments.map(
                  (attachment: any, index: number) => (
                    <Col
                      lg={6}
                      key={index}
                      className="comments-form-attachment"
                    >
                      <Card>
                        <Card.Img
                          variant="top"
                          src={attachment.thumbnail_500x500}
                        />
                        <Card.Footer>
                          <Button
                            variant="danger"
                            size="sm"
                            className="float-right"
                            onClick={() =>
                              this.onChangeAttachments(
                                this.state.attachments.filter(
                                  (a: any) => a.pk !== attachment.pk
                                )
                              )
                            }
                          >
                            <i className="fa fa-trash" />
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  )
                )}
              </Row>
            ) : null}
            <FormMsgArea
              name="message"
              required={true}
              value={this.state.message}
              onChange={(target: any) =>
                this.setState({ message: target.value })
              }
              errors={this.state.errors}
              onChangeAttachments={this.onChangeAttachments}
              onSend={() => {
                sendMessage({
                  recipient: this.props.match.params.recipientSlug,
                  message: this.state.message.replace(
                    /(?:\r\n|\r|\n)/g,
                    "<br />"
                  ),
                  attachments: this.state.attachments.map((a: any) => a.pk)
                })
                  .then((result: any) => {
                    this.props.history.push({
                      pathname: CLIENT_URLS.USER.CHAT_DETAIL.buildPath({
                        chatPk: result.pk
                      })
                    });
                  })
                  .catch((errors: any) => {
                    if (errors.status === 400) {
                      this.setState({ errors: errors.data.message });
                    } else {
                      handleErrors(errors);
                    }
                  });
              }}
            />
          </div>
        )}
      </Mutate>
    );
  };

  public renderFilters = () => {
    return null;
  };

  public render() {
    return (
      <>
        <Helmet>
          <title>{_("Write to support")}</title>
          <meta name="description" content={_("Write to support")} />
        </Helmet>
        <Col lg={10} className="object-list-container">
          <Row>
            <Col lg={9}>
              <Card>
                <Card.Header>
                  <Row>
                    <Col lg={7}>
                      <Card.Title className="object-title">
                        {_("Write to support")}
                      </Card.Title>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="object-list" />
                <Card.Footer>{this.renderFooter()}</Card.Footer>
              </Card>
            </Col>
            <Col lg={3}>{this.renderFilters()}</Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default ChatWithModeratorsCreate;

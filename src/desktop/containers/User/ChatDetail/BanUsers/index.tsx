import React from "react";
import { Card, Button } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";

import { SERVER_URLS } from "routes/server";
import { Mutate } from "restful-react";
import { confirmAlert } from "react-confirm-alert";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormInput from "generic/components/Form/FormInput";
import { toast } from "react-toastify";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
  chat: any;
}

interface IState {
  user?: any;
  minutes: number;
}

class BanUsers extends React.PureComponent<IProps, IState> {
  public state = {
    user: {
      pk: undefined,
      name: undefined
    },
    minutes: 5
  };

  public render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            <i className="fa fa-ban" /> {_("ban")}
          </Card.Title>
          <Mutate
            verb="PATCH"
            path={SERVER_URLS.CHAT_BAN.buildPath({
              chatPk: this.props.chat.pk
            })}
          >
            {banUser => (
              <div className="chat-ban-btn">
                <FormAsyncSelect
                  label={`${_("Participant")}*`}
                  placeholder={_("Start typing...")}
                  name="user"
                  required={true}
                  value={this.state.user.pk ? this.state.user : null}
                  onChange={(target: any) => {
                    this.setState({ user: target.value });
                  }}
                  fetchURL={SERVER_URLS.SELECTS.CHAT_USERS.buildPath()}
                  filterURL={`&user_chats=${this.props.chat.pk}`}
                />
                <FormInput
                  min={0}
                  label={_("Minutes")}
                  type="number"
                  name="minutes"
                  required={true}
                  onChange={(e: any) => {
                    this.setState({ minutes: e.target.value });
                  }}
                  value={this.state.minutes}
                />
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    confirmAlert({
                      title: _("Are you sure?"),
                      message:
                        "Вы действительно хотите забанить пользователя на 5 минут?",
                      buttons: [
                        {
                          label: _("Yes"),
                          onClick: () => {
                            if (this.state.user.pk === undefined) {
                              return;
                            }
                            banUser({
                              user: this.state.user.pk,
                              minutes: this.state.minutes
                            }).then((result: any) => {
                              toast.success(
                                `Пользователь ${this.state.user.name} забанен на ${this.state.minutes} минут`
                              );
                              this.setState({
                                user: {
                                  pk: undefined,
                                  name: undefined
                                },
                                minutes: 5
                              });
                            });
                          }
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
                  <i className="fa fa-ban" /> {_("ban")}
                </Button>
              </div>
            )}
          </Mutate>
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(BanUsers);

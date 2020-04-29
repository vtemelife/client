import React from "react";
import {
  Row,
  Col,
  Card,
  Button,
  // Alert,
  Alert
} from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Get from "restful-react";

import Image from "generic/components/Image";
import defaultSVG from "generic/layout/images/picture.svg";
import { REQUEST_APPROVED } from "generic/constants";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import Delete from "desktop/containers/Generics/Delete";
import Loading from "generic/components/Loading";
import ResponseErrors from "desktop/components/ResponseErrors";
import { renderHtml } from "utils";
import { HeaderUserConsumer } from "generic/containers/ContextProviders/HeaderUserService";
import { _ } from "trans";

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  response: any;
  loading: boolean;
  error: any;
  refetch: any;
  headerUser: any;
  refetchHeaderUser: any;
}

class Game extends React.PureComponent<IProps> {
  public onDeleteSuccess = () => {
    this.props.history.push(CLIENT_URLS.USER.GAME_LIST.buildPath());
  };

  public render() {
    if (this.props.error) {
      return <ResponseErrors error={this.props.error} />;
    }
    if (!this.props.response || this.props.loading) {
      return <Loading />;
    }

    const user = this.props.headerUser;
    const game = this.props.response;
    const isCreator = game.creator === user.pk;
    return (
      <Col lg={10} className="game-container">
        {game.status !== REQUEST_APPROVED ? (
          <Alert dismissible={true} variant="danger">
            <div>
              {_(
                "The game is on moderation. It is only visible to you and is not visible in the search results. Waiting for moderation."
              )}
            </div>
            <hr />
            <LinkContainer
              to={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.buildPath()}
            >
              <Button size="sm" variant="danger">
                <i className="fa fa-comment" /> {_("Chat with support")}
              </Button>
            </LinkContainer>
          </Alert>
        ) : null}
        <Row>
          <Col lg={12}>
            <Row>
              <Col lg={4}>
                <Card className="game-action">
                  {game.image && game.image.thumbnail_500x500 ? (
                    <Image
                      variant="top"
                      width="100%"
                      src={game.image.thumbnail_500x500}
                    />
                  ) : (
                    <Image variant="top" width="100%" src={defaultSVG} />
                  )}
                  <Card.Body>
                    <Row>
                      <Col lg={6}>
                        {isCreator ? (
                          <>
                            <Delete
                              title={_("Are you sure?")}
                              description={_(
                                "Are you sure you want to delete the game?"
                              )}
                              onSuccess={this.onDeleteSuccess}
                              destoryServerPath={SERVER_URLS.GAME_DELETE.buildPath(
                                { gameSlug: game.slug }
                              )}
                              method="PATCH"
                            >
                              <Button
                                size="sm"
                                variant="danger"
                                className="float-left"
                              >
                                <i className="fa fa-trash" />
                              </Button>
                            </Delete>
                            <LinkContainer
                              to={CLIENT_URLS.USER.GAME_UPDATE.buildPath({
                                gameSlug: game.slug
                              })}
                            >
                              <Button size="sm" className="float-left">
                                <i className="fa fa-pencil" />
                              </Button>
                            </LinkContainer>
                          </>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <LinkContainer
                          to={CLIENT_URLS.USER.GAME_PLAY.buildPath({
                            gameSlug: game.slug
                          })}
                        >
                          <Button size="sm" className="float-right">
                            <i className="fa fa-play" /> {_("Play")}
                          </Button>
                        </LinkContainer>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={8}>
                <Card>
                  <Card.Body>
                    <Card.Title>{game.name}</Card.Title>
                    {renderHtml(game.description)}
                    <hr />
                    <b>{_("Rules")}:</b>
                    <hr />
                    {renderHtml(game.rules)}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    );
  }
}

const GameWrapper: React.FC<IPropsWrapper> = props => (
  <HeaderUserConsumer>
    {contextHeaderUser =>
      contextHeaderUser && (
        <Get
          path={SERVER_URLS.GAME_DETAIL.buildPath({
            gameSlug: props.match.params.gameSlug
          })}
        >
          {(response, { loading, error }, { refetch }) => (
            <Game
              {...props}
              response={response}
              loading={loading}
              error={error}
              refetch={refetch}
              headerUser={contextHeaderUser.headerUser}
              refetchHeaderUser={contextHeaderUser.refetchHeaderUser}
            />
          )}
        </Get>
      )
    }
  </HeaderUserConsumer>
);

export default GameWrapper;

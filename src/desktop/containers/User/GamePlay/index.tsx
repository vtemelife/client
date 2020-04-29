import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Get, { Mutate } from "restful-react";

import { SERVER_URLS } from "routes/server";
import Loading from "generic/components/Loading";
import ResponseErrors from "desktop/components/ResponseErrors";
import handleErrors from "desktop/components/ResponseErrors/utils";

import { GameUserDataProvider } from "./ContextProviders/GameUserDataService";

import Fanty from "./Games/Fanty";
import { HeaderUserConsumer } from "generic/containers/ContextProviders/HeaderUserService";

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  response: any;
  loading: boolean;
  error: any;
  refetch: any;
  createGameUserData: any;
  headerUser: any;
  refetchHeaderUser: any;
}

class GamePlay extends React.PureComponent<IProps> {
  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (
      !this.props.response &&
      nextProps.response &&
      !nextProps.response.game_user_pk
    ) {
      this.props
        .createGameUserData({
          game: nextProps.response.pk
        })
        .then((result: any) => {
          this.props.refetch();
        })
        .catch((errors: any) => {
          handleErrors(errors);
        });
    }
  }

  public render() {
    if (this.props.error) {
      return <ResponseErrors error={this.props.error} />;
    }
    if (!this.props.response || this.props.loading) {
      return <Loading />;
    }

    const user = this.props.headerUser;
    const game = this.props.response;

    if (!game.game_user_pk) {
      return <Loading />;
    }

    const Game = Fanty;
    return (
      <GameUserDataProvider gameUserPk={game.game_user_pk}>
        <Game user={user} game={game} />
      </GameUserDataProvider>
    );
  }
}

const GamePlayWrapper: React.FC<IPropsWrapper> = props => (
  <HeaderUserConsumer>
    {contextHeaderUser =>
      contextHeaderUser && (
        <Get
          path={SERVER_URLS.GAME_DETAIL.buildPath({
            gameSlug: props.match.params.gameSlug
          })}
        >
          {(response, { loading, error }, { refetch }) => (
            <Mutate verb="POST" path={SERVER_URLS.GAME_USER_CREATE.buildPath()}>
              {createGameUserData => (
                <GamePlay
                  {...props}
                  response={response}
                  loading={loading}
                  error={error}
                  refetch={refetch}
                  createGameUserData={createGameUserData}
                  headerUser={contextHeaderUser.headerUser}
                  refetchHeaderUser={contextHeaderUser.refetchHeaderUser}
                />
              )}
            </Mutate>
          )}
        </Get>
      )
    }
  </HeaderUserConsumer>
);

export default GamePlayWrapper;

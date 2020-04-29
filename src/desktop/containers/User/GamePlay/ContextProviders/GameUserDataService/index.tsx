import React from "react";
import Get, { Mutate } from "restful-react";

import { SERVER_URLS } from "routes/server";

interface IContextInterface {
  gameUserData: any;
  refetchGameUserData: any;

  updateGameUserData: any;
  deleteGameUserData: any;
}

const Context = React.createContext<IContextInterface | null>(null);
export const GameUserDataConsumer = Context.Consumer;

interface IPropsWrapper {
  gameUserPk: any;
  children: any;
}

interface IProps extends IPropsWrapper {
  gameUserData: any;
  refetchGameUserData: any;

  updateGameUserData: any;
  deleteGameUserData: any;
}

class GameUserDataProviderComponent extends React.Component<IProps> {
  public render() {
    return (
      <Context.Provider
        value={{
          gameUserData: this.props.gameUserData,
          refetchGameUserData: this.props.refetchGameUserData,
          updateGameUserData: this.props.updateGameUserData,
          deleteGameUserData: this.props.deleteGameUserData
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const GameUserDataProvider: React.FC<IPropsWrapper> = props => (
  <Get
    path={SERVER_URLS.GAME_USER_DETAIL.buildPath({
      gameUserPk: props.gameUserPk
    })}
  >
    {(response, { loading, error }, { refetch }) => (
      <Mutate
        verb="PATCH"
        path={SERVER_URLS.GAME_USER_UPDATE.buildPath({
          gameUserPk: props.gameUserPk
        })}
      >
        {updateGameUserData => (
          <Mutate
            verb="PATCH"
            path={SERVER_URLS.GAME_USER_DELETE.buildPath({
              gameUserPk: props.gameUserPk
            })}
          >
            {deleteGameUserData => (
              <GameUserDataProviderComponent
                gameUserData={response}
                refetchGameUserData={refetch}
                updateGameUserData={updateGameUserData}
                deleteGameUserData={deleteGameUserData}
                {...props}
              >
                {props.children}
              </GameUserDataProviderComponent>
            )}
          </Mutate>
        )}
      </Mutate>
    )}
  </Get>
);

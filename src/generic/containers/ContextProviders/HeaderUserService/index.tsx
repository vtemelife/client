import React from "react";
import Get from "restful-react";
import { SERVER_URLS } from "routes/server";

interface IContextInterface {
  headerUser: any;
  refetchHeaderUser: any;
}

export const AuthUserContext = React.createContext<IContextInterface>({
  headerUser: null,
  refetchHeaderUser: () => {
    return;
  }
});
export const HeaderUserConsumer = AuthUserContext.Consumer;

interface IProps {
  children: any;
}

export const HeaderUserProvider: React.FC<IProps> = props => (
  <Get path={SERVER_URLS.SIGN_IN_VERIFY.buildPath()}>
    {(response, { loading, error }, { refetch }) => {
      return (
        <AuthUserContext.Provider
          value={{
            headerUser: error ? null : response,
            refetchHeaderUser: refetch
          }}
        >
          {props.children}
        </AuthUserContext.Provider>
      );
    }}
  </Get>
);

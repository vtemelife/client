import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import ym, { YMInitializer } from "react-yandex-metrika";
import { RestfulProvider } from "restful-react";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";

import { WebSocketProvider } from "generic/containers/ContextProviders/WebSocketService";
import { CountersProvider } from "generic/containers/ContextProviders/CountersService";
import { StatesProvider } from "generic/containers/ContextProviders/StatesService";
import { HeaderUserProvider } from "generic/containers/ContextProviders/HeaderUserService";

import App from "App";
import { requestOptions, isDev, handleErrors } from "utils";
import { history } from "setupHistory";
import * as serviceWorker from "serviceWorker";

import "moment/locale/ru";

const YANDEX_ID = 53540938;

ReactDOM.render(
  <Router history={history}>
    <RestfulProvider
      base="/"
      requestOptions={() => requestOptions()}
      onError={(errors: any) => handleErrors(errors)}
    >
      <ToastContainer autoClose={5000} />
      <HelmetProvider>
        <HeaderUserProvider>
          <WebSocketProvider>
            <CountersProvider>
              <StatesProvider>
                {!isDev() && <YMInitializer accounts={[YANDEX_ID]} />}
                <App />
              </StatesProvider>
            </CountersProvider>
          </WebSocketProvider>
        </HeaderUserProvider>
      </HelmetProvider>
    </RestfulProvider>
  </Router>,
  document.getElementById("root") as HTMLElement
);

if (!isDev()) {
  history.listen((location: any) => {
    ym("hit", location.pathname);
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

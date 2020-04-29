import React from "react";

import "abortcontroller-polyfill/dist/polyfill-patch-fetch";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "flag-icon-css/css/flag-icon.min.css";
import "react-datepicker/dist/react-datepicker.css";

import Desktop from "desktop/Desktop";
import Mobile from "mobile/Mobile";
import { isMobile } from "utils";

const App = () => {
  if (isMobile()) {
    return <Mobile />;
  }
  return <Desktop />;
};

export default App;

import React from "react";
import {
  RouteComponentProps,
  withRouter,
  Switch,
  Route
} from "react-router-dom";

import { GAME_URLS } from "./routes";
import "./index.scss";
import Format from "./Format";
import FantyCard from "./FantyCard";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

interface IProps extends RouteComponentProps {
  user: any;
  game: any;
}

class Fanty extends React.PureComponent<IProps> {
  public render() {
    return (
      <Col lg={10} className="games-fanty-container">
        <Helmet>
          <title>{this.props.game.name}</title>
          <meta name="description" content={this.props.game.name} />
        </Helmet>
        <br />
        <Switch>
          <Route
            exact={true}
            path={GAME_URLS.FORMAT.routePath()}
            component={Format}
          />
          <Route
            exact={true}
            path={GAME_URLS.CARD.routePath()}
            component={FantyCard}
          />
        </Switch>
      </Col>
    );
  }
}

export default withRouter(Fanty);

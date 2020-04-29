import React from "react";
import { Card, Button, Col, Alert, Tabs, Tab } from "react-bootstrap";
import moment from "moment";
import shuffle from "shuffle-array";

import Image from "generic/components/Image";
import defaultSVG from "generic/layout/images/picture.svg";
import { GameUserDataConsumer } from "../../../ContextProviders/GameUserDataService";
import { CODES } from "../codes";
import * as FANTY from "../fanty.json";
import { withRouter, RouteComponentProps } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { CLIENT_URLS } from "desktop/routes/client";
import "./index.scss";

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  gameUserData: any;
  refetchGameUserData: any;
}

interface IState {
  level: number;
  cards: object[];
  card: object;
  isEnd: boolean;
}

class FantyCard extends React.PureComponent<IProps, IState> {
  public state = {
    level: 1,
    cards: [],
    card: { image: undefined, text: undefined },
    isEnd: false
  };

  public UNSAFE_componentWillMount() {
    const level = 1;
    const fanty = FANTY as any;

    const cards = (
      fanty.default[this.props.match.params.format][level] || []
    ).slice(0);
    this.setState({
      level,
      cards,
      card: cards[0],
      isEnd: false
    });
  }

  public onChangeLevel = (level: number) => {
    if (level > 4) {
      this.setState({
        card: { text: "Конец игры." },
        isEnd: true
      });
      return;
    }
    const fanty = FANTY as any;
    const cards = (
      fanty.default[this.props.match.params.format][level] || []
    ).slice(0);
    this.setState({
      level,
      cards,
      card: cards[0],
      isEnd: false
    });
  };

  public nextCard = () => {
    const cards = shuffle(
      this.state.cards.filter((item: any) => item.text !== this.state.card.text)
    );

    if (cards.length === 0) {
      this.onChangeLevel(this.state.level + 1);
      return;
    }
    const card = cards[0];
    this.setState({
      cards,
      card
    });
  };

  public render() {
    let validCode = false;
    if (this.props.gameUserData && this.props.gameUserData.game_data.code) {
      const updatedDate = moment(this.props.gameUserData.updated_date);
      const validDays = CODES[this.props.gameUserData.game_data.code];
      const today = moment(new Date());
      if (today <= updatedDate.add(validDays, "days")) {
        validCode = true;
      }
    }
    return (
      <Col lg={{ span: 8, offset: 2 }} className="games-fanty-card-container">
        <Tabs
          id="levels"
          activeKey={this.state.level}
          onSelect={(key: string) => this.onChangeLevel(parseInt(key, 10))}
        >
          <Tab eventKey={1} title="Уровень 1" tabClassName="card-level-1" />
          <Tab eventKey={2} title="Уровень 2" tabClassName="card-level-2" />
          <Tab eventKey={3} title="Уровень 3" tabClassName="card-level-3" />
          <Tab eventKey={4} title="Уровень 4" tabClassName="card-level-4" />
        </Tabs>
        <br />
        <div className="card-level">Уровень {this.state.level}</div>
        {!validCode && this.state.level > 2 ? (
          <Alert variant="danger">
            <p>
              В бесплатной версии доступны только первые два очень скромных
              уровня. Для доступа к остальным, самым горячим, вам необходимо
              ввести код, приобрести который вы можете у
              <br />
              <br />
              <LinkContainer
                target="_blank"
                to={CLIENT_URLS.USER.PROFILE.buildPath({ userSlug: "boss" })}
              >
                <Button size="sm">СВоего человека</Button>
              </LinkContainer>
            </p>
          </Alert>
        ) : (
          <Card>
            <Card.Body>
              <div className="card-image">
                <Image
                  variant="top"
                  width="100%"
                  src={this.state.card.image || defaultSVG}
                />
              </div>
              <Card.Text className="card-text">
                {this.state.card.text}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              {!this.state.isEnd ? (
                <Button
                  variant="primary"
                  className="card-btn"
                  onClick={this.nextCard}
                >
                  <i className="fa fa-gamepad" /> Следущая карточка
                </Button>
              ) : null}
            </Card.Footer>
          </Card>
        )}
      </Col>
    );
  }
}

const FantyCardWrapper: React.FC<IPropsWrapper> = props => (
  <GameUserDataConsumer>
    {contextGameUserData =>
      contextGameUserData && (
        <FantyCard
          {...props}
          gameUserData={contextGameUserData.gameUserData}
          refetchGameUserData={contextGameUserData.refetchGameUserData}
        />
      )
    }
  </GameUserDataConsumer>
);

export default withRouter(FantyCardWrapper);

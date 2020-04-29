import React from "react";
import {
  RouteComponentProps as IPropsWrapper,
  withRouter
} from "react-router-dom";
import { Col, ListGroup, Modal, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import moment from "moment";

import { CLIENT_URLS } from "desktop/routes/client";
import FormInput from "generic/components/Form/FormInput";

import { GAME_URLS } from "../routes";
import { GameUserDataConsumer } from "../../../ContextProviders/GameUserDataService";
import { CODES } from "../codes";
import handleErrors from "desktop/components/ResponseErrors/utils";

interface IProps extends IPropsWrapper {
  gameUserData: any;
  refetchGameUserData: any;
  updateGameUserData: any;
}

interface IState {
  showDialog: boolean;
  format: string;
  code: string;
  codeErrors?: string[];
}

class Format extends React.PureComponent<IProps, IState> {
  public state = {
    showDialog: false,
    format: "",
    code: "",
    codeErrors: undefined
  };

  public handleClose = () => {
    this.setState({
      showDialog: false,
      code: "",
      format: "",
      codeErrors: undefined
    });
  };

  public handleShow = () => {
    this.setState({ showDialog: true });
  };

  public clickOnFormat = (format: string) => {
    if (this.props.gameUserData.game_data.code) {
      const updatedDate = moment(this.props.gameUserData.updated_date);
      const validDays = CODES[this.props.gameUserData.game_data.code];
      const today = moment.utc();
      if (today <= updatedDate.add(validDays, "days")) {
        this.props.history.push(GAME_URLS.CARD.buildPath({ format }));
        return;
      }
    }
    this.setState({ format }, () => this.handleShow());
  };

  public goToFormatCards = () => {
    if (this.state.code !== "") {
      const code = this.state.code;
      if (CODES[code] === undefined) {
        this.setState({ codeErrors: ["Код не правильный"] });
        return;
      }
      if (code === this.props.gameUserData.game_data.code) {
        this.setState({ codeErrors: ["Вы уже вводили этот код"] });
        return;
      }
      this.props
        .updateGameUserData({
          game_data: {
            code
          }
        })
        .then((result: any) => {
          this.props.history.push(
            GAME_URLS.CARD.buildPath({ format: this.state.format })
          );
        })
        .catch((errors: any) => {
          handleErrors(errors);
        });
    } else {
      this.props.history.push(
        GAME_URLS.CARD.buildPath({ format: this.state.format })
      );
    }
  };

  public onChangeCode = (e: React.ChangeEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    this.setState({ code: target.value });
  };

  public render() {
    return (
      <Col lg={{ span: 8, offset: 2 }}>
        <ListGroup>
          <ListGroup.Item onClick={() => this.clickOnFormat("mw")}>
            <h1>Фанты МЖ</h1>
            Созданы для того, чтобы не только развлечься в паре, но и
            заинтересовать вторую половинку темой свинга.
          </ListGroup.Item>
          <ListGroup.Item onClick={() => this.clickOnFormat("mwm")}>
            <h1>Фанты МЖМ</h1>
            Игра предназначена только для троих игроков - двух гетеро мужчин и
            одной девушки.
          </ListGroup.Item>
          <ListGroup.Item onClick={() => this.clickOnFormat("wmw")}>
            <h1>Фанты ЖМЖ</h1>
            Игра предназначена только для троих игроков - гетеро мужчины и двух
            девушек би.
          </ListGroup.Item>
          <ListGroup.Item onClick={() => this.clickOnFormat("mwmw")}>
            <h1>Фанты МЖМЖ</h1>
            Предназначены для формата пару на пару - не иначе!
          </ListGroup.Item>
          <ListGroup.Item onClick={() => this.clickOnFormat("party")}>
            <h1>Фанты Вечеринка</h1>
            Эта игра которая будет хорошей палочкой выручалочкой для компании от
            5 до 16 человек!
          </ListGroup.Item>
        </ListGroup>
        <Modal show={this.state.showDialog} onHide={this.handleClose}>
          <Modal.Header closeButton={true}>
            <Modal.Title>Внимание!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
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
            <hr />
            <FormInput
              label="Ввести код или продолжить без кода"
              type="number"
              name="name"
              onChange={this.onChangeCode}
              value={this.state.code}
              errors={this.state.codeErrors}
            />
            <p />
          </Modal.Body>

          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={this.handleClose}>
              Отмена
            </Button>
            <Button size="sm" variant="primary" onClick={this.goToFormatCards}>
              Продолжить
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    );
  }
}

const FormatWrapper: React.FC<IPropsWrapper> = props => (
  <GameUserDataConsumer>
    {contextGameUserData =>
      contextGameUserData && (
        <Format
          {...props}
          gameUserData={contextGameUserData.gameUserData}
          refetchGameUserData={contextGameUserData.refetchGameUserData}
          updateGameUserData={contextGameUserData.updateGameUserData}
        />
      )
    }
  </GameUserDataConsumer>
);

export default withRouter(FormatWrapper);

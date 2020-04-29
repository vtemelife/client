import React from "react";
import { Modal, Button, InputGroup } from "react-bootstrap";
import EmojiPicker from "emoji-picker-react";
import OutsideClickHandler from "react-outside-click-handler";
import Textarea from "react-textarea-autosize";

import FormFilesUpload from "../../FormFilesUpload";
import { _ } from "trans";

interface IProps {
  value: string;
  onChange: any;
  onChangeAttachments?: any;
  onSend?: any;
}

interface IState {
  showEmoji: boolean;
  showAttachments: boolean;
  attachments: any;
}

class MsgArea extends React.PureComponent<IProps, IState> {
  public state = {
    showEmoji: false,
    showAttachments: false,
    attachments: []
  };

  public hideDialogs = () => {
    this.setState({ showEmoji: false, showAttachments: false });
  };

  public onEmojiClick = (code: any, emoji: any) => {
    const emojiPic = String.fromCodePoint(`0x${emoji.unified}` as any);

    const value = this.props.value + emojiPic;
    this.props.onChange(value);
  };

  public onChangeAttachments = (attachments: any) => {
    this.setState({ attachments });
  };

  public render() {
    return (
      <div className="msg-area-container">
        <InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              {this.props.onChangeAttachments ? (
                <InputGroup.Text
                  onClick={() => {
                    this.setState({
                      showAttachments: !this.state.showAttachments
                    });
                  }}
                >
                  <i className="fa fa-paperclip" />
                </InputGroup.Text>
              ) : null}
              {/* <InputGroup.Checkbox aria-label="Radio button for following text input" /> */}
            </InputGroup.Prepend>
            <Textarea
              rows={1}
              className="form-control"
              placeholder="Ваше сообщение..."
              value={this.props.value}
              onChange={(e: any) => this.props.onChange(e.target.value)}
              onKeyDown={(e: any) => {
                if (e.key === "Enter" && !e.shiftKey && this.props.onSend) {
                  e.preventDefault();
                  this.props.onSend();
                }
              }}
            />
            <InputGroup.Append>
              <InputGroup.Text
                onClick={() => {
                  this.setState({ showEmoji: !this.state.showEmoji });
                }}
              >
                <i className="fa fa-smile-o" />
              </InputGroup.Text>
              {this.props.onSend ? (
                <Button onClick={() => this.props.onSend()}>
                  <i className="fa fa-paper-plane" />
                </Button>
              ) : null}
            </InputGroup.Append>
          </InputGroup>
        </InputGroup>
        {this.state.showEmoji ? (
          <OutsideClickHandler onOutsideClick={this.hideDialogs}>
            <EmojiPicker onEmojiClick={this.onEmojiClick} />
          </OutsideClickHandler>
        ) : null}
        {this.props.onChangeAttachments ? (
          <Modal
            size="lg"
            show={this.state.showAttachments}
            onHide={() => {
              this.setState({ showAttachments: false });
            }}
          >
            <Modal.Header closeButton={true}>
              <Modal.Title>{_("Attach images")}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <FormFilesUpload
                multiple={true}
                name="attachments"
                description={_("Click here to choose your images")}
                onChange={(target: any) =>
                  this.onChangeAttachments(target.value)
                }
              />
            </Modal.Body>

            <Modal.Footer>
              <Button
                onClick={() => {
                  this.props.onChangeAttachments([]);
                  this.setState({ showAttachments: false, attachments: [] });
                }}
                variant="secondary"
              >
                Закрыть
              </Button>
              <Button
                onClick={() => {
                  this.props.onChangeAttachments(this.state.attachments);
                  this.setState({ showAttachments: false, attachments: [] });
                }}
                variant="primary"
              >
                Прикрепить
              </Button>
            </Modal.Footer>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default MsgArea;

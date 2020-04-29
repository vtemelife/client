import React from "react";
import { Form } from "react-bootstrap";

import MsgArea from "./MsgArea";

class FormMsgArea extends React.PureComponent<any> {
  public onChange = (value: any) => {
    this.props.onChange({
      name: this.props.name,
      value
    });
  };

  public render() {
    const {
      errors,
      help,
      label,
      value,
      onChangeAttachments,
      onSend
    } = this.props;
    return (
      <Form.Group className="form-msg-area-container">
        {label ? <Form.Label>{label}</Form.Label> : null}
        <MsgArea
          value={value}
          onChange={this.onChange}
          onChangeAttachments={onChangeAttachments}
          onSend={onSend}
        />
        {errors
          ? errors.map((error: string, index: number) => (
              <Form.Text className="text-error" key={index}>
                {error}
              </Form.Text>
            ))
          : null}
        {help ? <Form.Text className="text-muted">{help}</Form.Text> : null}
      </Form.Group>
    );
  }
}

export default FormMsgArea;

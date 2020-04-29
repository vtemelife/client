import React from "react";
import { Form } from "react-bootstrap";

// interface IProps {
//   name: string;
//   error?: string;
//   help?: string;
// }

class FormInput extends React.PureComponent<any> {
  public render() {
    const { name, errors, help, label, ...props } = this.props;
    return (
      <Form.Group>
        {label ? <Form.Label>{label}</Form.Label> : null}
        <Form.Control
          name={name}
          className={errors ? "form-error" : ""}
          {...props}
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

export default FormInput;

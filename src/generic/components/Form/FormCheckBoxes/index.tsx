import React from "react";
import { Form } from "react-bootstrap";

class FormCheckBoxes extends React.PureComponent<any> {
  public render() {
    const {
      checkboxes,
      name,
      errors,
      help,
      label,
      value,
      type,
      ...props
    } = this.props;
    return (
      <Form.Group controlId={name}>
        {label ? <Form.Label>{label}</Form.Label> : null}
        <div className={errors ? "form-error" : ""} style={{ padding: "10px" }}>
          {checkboxes.length === 0 ? "-" : null}
          {checkboxes.map((checkbox: any, index: number) => {
            let checked = false;
            if (value && type === "radio") {
              checked = value === checkbox.value;
            }
            if (value && type === "checkbox") {
              checked = value.indexOf(checkbox.value) !== -1;
            }
            return (
              <Form.Check
                key={index}
                name={name}
                type={type}
                id={checkbox.value}
                label={checkbox.display}
                checked={checked}
                {...props}
              />
            );
          })}
        </div>
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

export default FormCheckBoxes;

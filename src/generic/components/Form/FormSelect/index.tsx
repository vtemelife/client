import React from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

class FormSelect extends React.PureComponent<any> {
  public render() {
    const { name, errors, help, label, onChange, ...props } = this.props;
    return (
      <Form.Group>
        {label ? <Form.Label>{label}</Form.Label> : null}
        <Select
          name={name}
          className={errors ? "form-error" : ""}
          classNamePrefix="select"
          onChange={(data: any) => onChange({ name, value: data })}
          getOptionLabel={(option: any) => option.display}
          getOptionValue={(option: any) => option.value}
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

export default FormSelect;

import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

// interface IProps {
//   name: string;
//   error?: string;
//   help?: string;
// }

registerLocale("ru", ru);

class FormDatePicker extends React.PureComponent<any> {
  public onChange = (value: any) => {
    this.props.onChange(value);
  };

  public render() {
    const { errors, help, label, value, placeholder, ...props } = this.props;
    const locale = localStorage.getItem("locale") || "ru";
    return (
      <Form.Group>
        {label ? <Form.Label>{label}</Form.Label> : null}
        <DatePicker
          {...props}
          placeholderText={placeholder}
          selected={value}
          onChange={this.onChange}
          className="form-control"
          locale={locale}
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

export default FormDatePicker;

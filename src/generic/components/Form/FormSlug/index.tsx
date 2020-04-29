import React from "react";
import { Form } from "react-bootstrap";
import slugify from "slugify";

// interface IProps {
//   name: string;
//   error?: string;
//   help?: string;
// }

function slugify_text(text: string) {
  return slugify(text)
    .toString()
    .toLowerCase();
}

class FormSlug extends React.PureComponent<any> {
  public render() {
    const { name, errors, help, label, onChange, ...props } = this.props;
    return (
      <Form.Group>
        {label ? <Form.Label>{label}</Form.Label> : null}
        <Form.Control
          name={name}
          className={errors ? "form-error" : ""}
          onChange={(e: any) =>
            onChange({ name, value: slugify_text(e.target.value) })
          }
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

export default FormSlug;

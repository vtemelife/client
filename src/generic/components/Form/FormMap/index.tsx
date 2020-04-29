import React from "react";
import { Form } from "react-bootstrap";
import BlockMap from "desktop/components/BlockMap";

// interface IProps {
//   name: string;
//   error?: string;
//   help?: string;
// }

class FormMap extends React.PureComponent<any> {
  public onChange = (geo: any) => {
    this.props.onChange({
      name: this.props.name,
      value: geo
    });
  };
  public render() {
    const { errors, help, label, value, center } = this.props;
    return (
      <Form.Group>
        {label ? <Form.Label>{label}</Form.Label> : null}
        <BlockMap center={center} geo={value} onClickMap={this.onChange} />
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

export default FormMap;

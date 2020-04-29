import React from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import { _ } from "trans";

// interface IProps {
//   name: string;
//   error?: string;
//   help?: string;
// }

interface IState {
  values: any;
}

class FormInputArray extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      values: props.value
    };
  }

  public addItem = () => {
    const values = this.state.values;
    const newValue = "";
    values.push(newValue);
    this.setState({ values });
    this.props.onChange(values);
  };

  public removeItem = (index: number) => {
    const values = this.state.values;
    values.splice(index, 1);
    this.setState({ values });
    this.props.onChange(values);
  };

  public onChangeItem = (index: number, value: string) => {
    const values = this.state.values;
    values[index] = value;
    this.setState({ values });
    this.props.onChange(values);
  };

  public render() {
    const { name, errors, help, label } = this.props;
    return (
      <Form.Group>
        {label ? <Form.Label>{label}</Form.Label> : null}
        {this.state.values.map((value: string, index: number) => (
          <div className="mb-3" key={index}>
            <InputGroup>
              <FormControl
                placeholder={_("Input a link")}
                id={`${name}_${index}`}
                name={name}
                value={value}
                className={errors && errors[index] ? "form-error" : ""}
                onChange={(e: any) => {
                  this.onChangeItem(index, e.target.value);
                }}
              />
              <InputGroup.Append>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => this.removeItem(index)}
                >
                  <i className="fa fa-trash" />
                </Button>
              </InputGroup.Append>
            </InputGroup>
            {errors && errors[index]
              ? errors[index].map((error: string, subindex: number) => (
                  <Form.Text className="text-error" key={subindex}>
                    {error}
                  </Form.Text>
                ))
              : null}
          </div>
        ))}
        <br />
        <Button size="sm" onClick={this.addItem}>
          <i className="fa fa-plus" /> {_("Add a link")}
        </Button>
        {help ? <Form.Text className="text-muted">{help}</Form.Text> : null}
      </Form.Group>
    );
  }
}

export default FormInputArray;

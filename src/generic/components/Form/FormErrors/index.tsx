import React from "react";
import { Alert } from "react-bootstrap";

interface IProps {
  errors?: string[];
}

class FormErrors extends React.PureComponent<IProps> {
  public render() {
    if (!this.props.errors) {
      return null;
    }
    return this.props.errors.map((error, index) => (
      <Alert variant="danger" key={index}>
        {error}
      </Alert>
    ));
  }
}

export default FormErrors;

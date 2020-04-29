import React from "react";
import { Mutate } from "restful-react";
import { Helmet } from "react-helmet-async";
import { Col, Row, Card, Button, Form } from "react-bootstrap";

import FormErrors from "generic/components/Form/FormErrors";
import handleErrors from "desktop/components/ResponseErrors/utils";
import { _ } from "trans";

interface IPropsWrapper {
  initialValues?: any;
  title: string;

  createServerPath: string;
  renderCreateForm: any;

  onSuccess?: any;
  convertFormValuesToServer?: any;
  convertFormErrorsFromServer?: any;

  submitBtnTitle?: string;

  method?: "POST" | "PATCH";
  size?: number;
}

interface IProps extends IPropsWrapper {
  createResponse: any;
  createObject: any;
}

interface IState {
  initialValues: any;
  formValues: any;
  formErrors: any;
}

class Create extends React.Component<IProps, IState> {
  public static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.initialValues && state.initialValues !== props.initialValues) {
      return {
        initialValues: props.initialValues,
        formValues: {
          ...state.formValues,
          ...props.initialValues
        }
      };
    }
    return null;
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      initialValues: {},
      formValues: {},
      formErrors: {}
    };
  }

  public onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    this.props
      .createObject(
        this.convertFormValuesToServer({ ...this.state.formValues })
      )
      .then((result: any) => {
        this.props.onSuccess(result);
      })
      .catch((errors: any) => {
        if (errors.status === 400) {
          this.setState({
            formErrors: this.convertFormErrorsFromServer({ ...errors.data })
          });
        } else {
          handleErrors(errors);
        }
      });
  };

  public onChange = (
    target: any,
    type?: string | undefined,
    values?: any | undefined
  ) => {
    const formValues = this.state.formValues;
    switch (type) {
      case "editor":
      case "image":
      case "select":
      case "slug":
      case "map":
      case "array":
      case "datetime":
        formValues[target.name] = target.value;
        break;
      default:
        const el = target.target as HTMLInputElement;
        switch (el.type) {
          case "radio":
            formValues[el.name] = el.id;
            break;
          case "checkbox":
            const checkboxValues = formValues[el.name] || [];
            if (el.checked) {
              formValues[el.name] = [...checkboxValues, el.id];
            } else {
              formValues[el.name] = checkboxValues.filter(
                (item: string) => item !== el.id
              );
            }
            break;
          default:
            formValues[el.name] = el.value;
        }
        break;
    }
    this.setState({ formValues });
    if (values) {
      this.setState({ formValues: { ...this.state.formValues, ...values } });
    }
  };

  public render() {
    return (
      <Col
        lg={this.props.size ? this.props.size : 10}
        className="object-create-container"
      >
        <Helmet>
          <title>{this.props.title}</title>
          <meta name="description" content={this.props.title} />
        </Helmet>
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Header>
                <Card.Title className="float-left">
                  <div className="object-title">{this.props.title}</div>
                </Card.Title>
              </Card.Header>
              <Card.Body className="object-create">
                <Form onSubmit={this.onSubmit}>
                  <FormErrors errors={this.state.formErrors.non_field_errors} />
                  {this.props.renderCreateForm(
                    this.state.formValues,
                    this.state.formErrors,
                    this.onChange
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    className="float-right"
                  >
                    {this.props.submitBtnTitle || _("Create")}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }

  private convertFormValuesToServer = (formValuesToServer: any) => {
    if (this.props.convertFormValuesToServer) {
      return this.props.convertFormValuesToServer(formValuesToServer);
    }
    return formValuesToServer;
  };

  private convertFormErrorsFromServer = (formErrorsFromServer: any) => {
    if (this.props.convertFormErrorsFromServer) {
      return this.props.convertFormErrorsFromServer(formErrorsFromServer);
    }
    return formErrorsFromServer;
  };
}

const CreateWrapper: React.FC<IPropsWrapper> = props => (
  <Mutate verb={props.method || "POST"} path={props.createServerPath}>
    {(createObject, createResponse) => (
      <Create
        {...props}
        createObject={createObject}
        createResponse={createResponse}
      />
    )}
  </Mutate>
);

export default CreateWrapper;

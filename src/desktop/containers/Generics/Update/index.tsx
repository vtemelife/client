import React from "react";
import Get, { Mutate } from "restful-react";
import { Helmet } from "react-helmet-async";
import { Col, Row, Card, Button, Form } from "react-bootstrap";

import ResponseErrors from "desktop/components/ResponseErrors";
import Loading from "generic/components/Loading";
import FormErrors from "generic/components/Form/FormErrors";
import handleErrors from "desktop/components/ResponseErrors/utils";
import { _ } from "trans";

interface IPropsWrapper {
  title: string;

  updateServerPath: string;
  retrieveServerPath: string;
  renderUpdateForm: any;

  onSuccess?: any;
  convertFormValuesFromServer?: any;
  convertFormValuesToServer?: any;
  convertFormErrorsFromServer?: any;

  size?: number;
}

interface IProps extends IPropsWrapper {
  updateResponse: any;
  updateObject: any;

  retrieveResponse: any;
  retrieveLoading: boolean;
  retrieveError: any;
}

interface IState {
  formValues: any;
  formErrors: any;
}

class Update extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      formValues: {},
      formErrors: {}
    };
  }

  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (!this.props.retrieveResponse && nextProps.retrieveResponse) {
      this.setState({
        formValues: this.convertFormValuesFromServer({
          ...nextProps.retrieveResponse
        })
      });
    }
  }

  public onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    this.props
      .updateObject(
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
            if (el.checked) {
              formValues[el.name] = [...formValues[el.name], el.id];
            } else {
              formValues[el.name] = formValues[el.name].filter(
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
    const obj = this.props.retrieveResponse;
    if (this.props.retrieveError) {
      return <ResponseErrors error={this.props.retrieveError} />;
    }
    if (!obj || this.props.retrieveLoading) {
      return <Loading />;
    }

    return (
      <Col
        lg={this.props.size ? this.props.size : 10}
        className="object-update-container"
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
              <Card.Body className="object-update">
                <Form onSubmit={this.onSubmit}>
                  <FormErrors errors={this.state.formErrors.non_field_errors} />
                  {this.props.renderUpdateForm(
                    this.state.formValues,
                    this.state.formErrors,
                    this.onChange
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    className="float-right"
                  >
                    {_("Update")}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    );
  }

  protected convertFormValuesFromServer = (formValuesFromServer: any) => {
    if (this.props.convertFormValuesFromServer) {
      return this.props.convertFormValuesFromServer(formValuesFromServer);
    }
    return formValuesFromServer;
  };

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

const UpdateWrapper: React.FC<IPropsWrapper> = props => (
  <Mutate verb="PATCH" path={props.updateServerPath}>
    {(updateObject, updateResponse) => (
      <Get path={props.retrieveServerPath}>
        {(retrieveResponse, { loading, error }) => (
          <Update
            {...props}
            updateObject={updateObject}
            updateResponse={updateResponse}
            retrieveResponse={retrieveResponse}
            retrieveLoading={loading}
            retrieveError={error}
          />
        )}
      </Get>
    )}
  </Mutate>
);

export default UpdateWrapper;

import React from "react";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { Row, Col, Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

import Create from "desktop/containers/Generics/Create";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import FormInput from "generic/components/Form/FormInput";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class SignUp extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.history.push({
      pathname: CLIENT_URLS.AUTH.SIGN_UP_FINISH.buildPath({ userPk: result.pk })
    });
  };

  public renderCreateForm = (
    formValues: any,
    formErrors: any,
    onChange: any
  ) => {
    return (
      <FormInput
        type="text-break"
        placeholder={_("Code")}
        name="signup_key"
        required={true}
        value={formValues.signup_key || ""}
        onChange={onChange}
        errors={formErrors.signup_key}
      />
    );
  };

  public render() {
    toast.success(
      _("A registration code has been sent to your email. Enter it here."),
      { autoClose: 15000 }
    );
    return (
      <Container className="signup-container">
        <Helmet>
          <title>{_("Sign Up")}</title>
          <meta name="description" content={_("Sign Up")} />
        </Helmet>
        <Row>
          <Col lg={{ span: 5, offset: 3 }}>
            <Create
              title={_("Confirm registration")}
              createServerPath={SERVER_URLS.SIGN_UP_STEP_2.buildPath({
                userPk: this.props.match.params.userPk
              })}
              renderCreateForm={this.renderCreateForm}
              onSuccess={this.onSuccess}
              submitBtnTitle={_("Confirm")}
              method="PATCH"
              size={12}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignUp;

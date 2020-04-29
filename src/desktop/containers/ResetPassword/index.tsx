import React from "react";
import { RouteComponentProps } from "react-router";

import Create from "desktop/containers/Generics/Create";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import FormInput from "generic/components/Form/FormInput";
import { Row, Col, Container } from "react-bootstrap";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class ResetPassword extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.history.push({
      pathname: CLIENT_URLS.AUTH.RESET_PASSWORD_FINISH.buildPath({
        userPk: result.pk
      })
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
        placeholder="Email"
        name="email"
        help={_("A password reset code will be sent to this email.")}
        required={true}
        value={formValues.email || ""}
        onChange={onChange}
        errors={formErrors.email}
      />
    );
  };

  public render() {
    return (
      <Container className="reset-password-container">
        <Row>
          <Col lg={{ span: 5, offset: 3 }}>
            <Create
              title={_("Reset your password")}
              createServerPath={SERVER_URLS.RESET_PASSWORD_STEP_1.buildPath()}
              renderCreateForm={this.renderCreateForm}
              onSuccess={this.onSuccess}
              submitBtnTitle={_("Send a code")}
              method="PATCH"
              size={12}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ResetPassword;

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

class ResetPasswordFinish extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.history.push({
      pathname: CLIENT_URLS.AUTH.SIGN_IN.buildPath()
    });
  };

  public renderCreateForm = (
    formValues: any,
    formErrors: any,
    onChange: any
  ) => {
    return (
      <>
        <FormInput
          type="text-break"
          placeholder="Код"
          name="reset_password_key"
          help={_(
            "A password reset code has been sent to your email. Enter it here."
          )}
          required={true}
          value={formValues.reset_password_key}
          onChange={onChange}
          errors={formErrors.reset_password_key}
        />
        <FormInput
          type="password"
          placeholder={_("New password")}
          name="new_password"
          required={true}
          value={formValues.new_password}
          onChange={onChange}
          errors={formErrors.new_password}
        />
        <FormInput
          type="password"
          placeholder={_("Repeat new password")}
          name="repeat_new_password"
          required={true}
          value={formValues.repeat_new_password}
          onChange={onChange}
          errors={formErrors.repeat_new_password}
        />
      </>
    );
  };

  public render() {
    return (
      <Container className="reset-password-finish-container">
        <Row>
          <Col lg={{ span: 5, offset: 3 }}>
            <Create
              title={_("Reset your password")}
              createServerPath={SERVER_URLS.RESET_PASSWORD_STEP_2.buildPath({
                userPk: this.props.match.params.userPk
              })}
              renderCreateForm={this.renderCreateForm}
              onSuccess={this.onSuccess}
              submitBtnTitle={_("Reset your password")}
              method="PATCH"
              size={12}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ResetPasswordFinish;

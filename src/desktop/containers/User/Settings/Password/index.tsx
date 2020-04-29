import React from "react";
import compose from "lodash/flowRight";
import { Tab, Row, Col } from "react-bootstrap";
import { RouteComponentProps as IPropsWrapper } from "react-router";

import Update from "desktop/containers/Generics/Update";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import FormInput from "generic/components/Form/FormInput";

import { _ } from "trans";
import { withAuthUser } from "generic/containers/Decorators";

interface IProps extends IPropsWrapper {
  match: any;
  authUser: any;
}

class Settings extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.authUser.refetch();
    this.props.history.push({
      pathname: CLIENT_URLS.USER.PROFILE.buildPath({
        userSlug: result.slug
      })
    });
  };

  public convertFormValuesFromServer = (formValuesFromServer: any) => {
    formValuesFromServer.country = formValuesFromServer.city
      ? formValuesFromServer.city.country
      : undefined;
    formValuesFromServer.region = formValuesFromServer.city
      ? formValuesFromServer.city.region
      : undefined;
    formValuesFromServer.avatar =
      formValuesFromServer.avatar && formValuesFromServer.avatar.pk
        ? [formValuesFromServer.avatar]
        : [];
    formValuesFromServer.gender = formValuesFromServer.gender
      ? formValuesFromServer.gender.value
      : [];
    formValuesFromServer.relationship_formats = formValuesFromServer.relationship_formats.map(
      (item: any) => item.value
    );
    formValuesFromServer.relationship_status = formValuesFromServer.relationship_status
      ? formValuesFromServer.relationship_status.value
      : [];
    formValuesFromServer.relationship_themes = formValuesFromServer.relationship_themes.map(
      (item: any) => item.value
    );
    return formValuesFromServer;
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    formValuesToServer.avatar =
      formValuesToServer.avatar && formValuesToServer.avatar.length > 0
        ? formValuesToServer.avatar[0].pk
        : undefined;
    formValuesToServer.city = formValuesToServer.city
      ? formValuesToServer.city.pk
      : undefined;
    return formValuesToServer;
  };

  public renderUpdateForm = (
    formValues: any,
    formErrors: any,
    onChange: any
  ) => {
    return (
      <Row>
        <Col lg={6}>
          <FormInput
            label={`${_("New password")}*:`}
            type="password"
            name="new_password"
            value={formValues.new_password}
            onChange={onChange}
            errors={formErrors.new_password}
          />
          <FormInput
            label={`${_("Repeat new password")}*:`}
            type="password"
            name="repeat_new_password"
            value={formValues.repeat_new_password}
            onChange={onChange}
            errors={formErrors.repeat_new_password}
          />
        </Col>
      </Row>
    );
  };

  public render() {
    return (
      <Tab.Content>
        <Update
          size={12}
          title={_("Change your password")}
          retrieveServerPath={SERVER_URLS.PROFILE.buildPath({
            userSlug: this.props.authUser.user.slug
          })}
          updateServerPath={SERVER_URLS.PROFILE_PASSWORD.buildPath({
            userSlug: this.props.authUser.user.slug
          })}
          renderUpdateForm={this.renderUpdateForm}
          onSuccess={this.onSuccess}
          convertFormValuesFromServer={this.convertFormValuesFromServer}
          convertFormValuesToServer={this.convertFormValuesToServer}
        />
      </Tab.Content>
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

export default compose(withAuth)(Settings);

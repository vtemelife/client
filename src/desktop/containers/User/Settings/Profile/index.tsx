import React from "react";
import compose from "lodash/flowRight";
import { Tab, Row, Col } from "react-bootstrap";
import { RouteComponentProps as IPropsWrapper } from "react-router";

import Update from "desktop/containers/Generics/Update";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import FormInput from "generic/components/Form/FormInput";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormCheckBoxes from "generic/components/Form/FormCheckBoxes";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormSlug from "generic/components/Form/FormSlug";

import {
  USER_THEMES,
  USER_GENDER,
  USER_GENDER_FAMILY,
  USER_GENDER_MW,
  USER_GENDER_M,
  USER_GENDER_MM,
  USER_GENDER_WW,
  USER_GENDER_TRANS,
  USER_GENDER_W
} from "generic/constants";
import { getUserFormats } from "desktop/containers/User/Profile/utils";
import { _ } from "trans";
import FormInputArray from "generic/components/Form/FormInputArray";
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
    const userFormats = getUserFormats(
      formValues.gender,
      formValues.relationship_themes
    );
    return (
      <>
        <Row>
          <Col lg={12}>
            <FormInput
              label={`${_("Email")}*:`}
              type="email"
              help={_("Users will not see your email.")}
              name="email"
              required={true}
              onChange={onChange}
              value={formValues.email || ""}
              errors={formErrors.email}
            />
            <FormSlug
              label={`${_("Slug")}*:`}
              type="text-break"
              name="slug"
              required={true}
              onChange={(target: any) => onChange(target, "slug")}
              value={formValues.slug || ""}
              errors={formErrors.slug}
            />
            <FormInput
              label={`${_("Nick")}*:`}
              type="text-break"
              name="name"
              required={true}
              onChange={onChange}
              value={formValues.name || ""}
              errors={formErrors.name}
            />
            <hr />
            <FormFilesUpload
              label={`${_("Avatar")}:`}
              multiple={false}
              name="avatar"
              description={_(_("Click here to choose your image"))}
              errors={formErrors.avatar}
              onChange={(target: any) => onChange(target, "image")}
              value={formValues.avatar}
            />
            <hr />
            <FormInput
              label={`${_("Phone")}:`}
              help={_("Only friends will see your phone.")}
              type="text"
              name="phone"
              required={false}
              onChange={onChange}
              value={formValues.phone || ""}
              errors={formErrors.phone}
            />
            <FormInput
              label={`${_("Skype")}:`}
              help={_("Only friends will see your skype.")}
              type="text"
              name="skype"
              required={false}
              onChange={onChange}
              value={formValues.skype || ""}
              errors={formErrors.skype}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col lg={6}>
            <FormCheckBoxes
              type="radio"
              name="gender"
              label={`${_("Gender")}*:`}
              checkboxes={USER_GENDER}
              value={formValues.gender}
              onChange={onChange}
              errors={formErrors.gender}
            />
          </Col>
        </Row>
        {formValues.gender === USER_GENDER_FAMILY ||
        formValues.gender === USER_GENDER_MW ||
        formValues.gender === USER_GENDER_M ||
        formValues.gender === USER_GENDER_MM ||
        formValues.gender === USER_GENDER_WW ||
        formValues.gender === USER_GENDER_TRANS ? (
          <Row>
            <Col lg={6}>
              <FormInput
                type="number"
                min="1940"
                label={
                  formValues.gender === USER_GENDER_FAMILY ||
                  formValues.gender === USER_GENDER_MW ||
                  formValues.gender === USER_GENDER_M ||
                  formValues.gender === USER_GENDER_MM
                    ? _("Birthday M *")
                    : formValues.gender === USER_GENDER_WW
                    ? _("Birthday W *")
                    : _("Birthday *")
                }
                placeholder={_("Birthday 1980")}
                required={true}
                name="birthday"
                value={formValues.birthday || ""}
                onChange={onChange}
                errors={formErrors.birthday}
              />
            </Col>
          </Row>
        ) : null}
        {formValues.gender === USER_GENDER_FAMILY ||
        formValues.gender === USER_GENDER_MW ||
        formValues.gender === USER_GENDER_W ||
        formValues.gender === USER_GENDER_MM ||
        formValues.gender === USER_GENDER_WW ? (
          <Row>
            <Col lg={6}>
              <FormInput
                type="number"
                min="1940"
                label={
                  formValues.gender === USER_GENDER_FAMILY ||
                  formValues.gender === USER_GENDER_MW ||
                  formValues.gender === USER_GENDER_W ||
                  formValues.gender === USER_GENDER_WW
                    ? _("Birthday W *")
                    : formValues.gender === USER_GENDER_MM
                    ? _("Birthday M *")
                    : _("Birthday *")
                }
                placeholder={_("Birthday 1980")}
                required={true}
                name="birthday_second"
                value={formValues.birthday_second || ""}
                onChange={onChange}
                errors={formErrors.birthday_second}
              />
            </Col>
          </Row>
        ) : null}
        <hr />
        <Row>
          <Col lg={6}>
            <FormAsyncSelect
              label={`${_("Country")}*:`}
              placeholder={_("Start typing...")}
              name="country"
              required={true}
              value={formValues.country}
              onChange={(target: any) =>
                onChange(target, "select", {
                  region: null,
                  city: null
                })
              }
              errors={formErrors.country}
              fetchURL={SERVER_URLS.SELECTS.COUNTRY.buildPath()}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormAsyncSelect
              label={`${_("Region/State")}*:`}
              placeholder={_("Start typing...")}
              isDisabled={!formValues.country || !formValues.country.pk}
              name="region"
              required={true}
              value={formValues.region}
              onChange={(target: any) =>
                onChange(target, "select", { city: null })
              }
              errors={formErrors.region}
              fetchURL={SERVER_URLS.SELECTS.REGION.buildPath()}
              filterURL={
                formValues.country
                  ? `country=${formValues.country.pk}`
                  : undefined
              }
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormAsyncSelect
              label={`${_("City")}*:`}
              placeholder={_("Start typing...")}
              isDisabled={!formValues.region || !formValues.region.pk}
              name="city"
              required={true}
              value={formValues.city}
              onChange={(target: any) => onChange(target, "select")}
              errors={formErrors.city}
              fetchURL={SERVER_URLS.SELECTS.CITY.buildPath()}
              filterURL={
                formValues.region ? `region=${formValues.region.pk}` : undefined
              }
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col lg={6}>
            <FormCheckBoxes
              type="checkbox"
              name="relationship_themes"
              label={`${_("Theme")}*:`}
              checkboxes={USER_THEMES}
              value={formValues.relationship_themes}
              onChange={onChange}
              errors={formErrors.relationship_themes}
            />
          </Col>
          <Col lg={6}>
            <FormCheckBoxes
              type="checkbox"
              name="relationship_formats"
              label={`${_("Format")}*:`}
              checkboxes={userFormats}
              value={formValues.relationship_formats}
              onChange={onChange}
              errors={formErrors.relationship_formats}
            />
          </Col>
        </Row>
        <hr />
        <FormInputArray
          label={`${_("Users can find me here (social links)")}:`}
          name="social_links"
          value={formValues.social_links || []}
          onChange={(value: any) =>
            onChange({ name: "social_links", value }, "array")
          }
          errors={formErrors.social_links}
        />
        <hr />
        <FormRichEditor
          label={`${_("About me")}:`}
          name="about"
          required={true}
          value={formValues.about || ""}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.about}
        />
      </>
    );
  };

  public render() {
    return (
      <Tab.Content>
        <Update
          size={12}
          title={_("Change your profile")}
          retrieveServerPath={SERVER_URLS.PROFILE.buildPath({
            userSlug: this.props.authUser.user.slug
          })}
          updateServerPath={SERVER_URLS.PROFILE_UPDATE.buildPath({
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

import React from "react";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { Row, Col, Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

import Create from "desktop/containers/Generics/Create";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import FormInput from "generic/components/Form/FormInput";

import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormCheckBoxes from "generic/components/Form/FormCheckBoxes";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import {
  USER_GENDER,
  USER_GENDER_FAMILY,
  USER_GENDER_M,
  USER_GENDER_MM,
  USER_GENDER_TRANS,
  USER_GENDER_WW,
  USER_GENDER_W,
  USER_GENDER_MW,
  USER_THEMES
} from "generic/constants";
import { getUserFormats } from "../User/Profile/utils";
import { _ } from "trans";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormInputArray from "generic/components/Form/FormInputArray";

interface IProps extends RouteComponentProps {
  match: any;
}

class SignUpFinish extends React.PureComponent<IProps> {
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

  public onSuccess = () => {
    this.props.history.push({
      pathname: CLIENT_URLS.AUTH.SIGN_IN.buildPath()
    });
    toast.success(
      _(
        "Registration is complete. The password has been sent to email with the code for registration. Now you can sign in using your email and password."
      ),
      { autoClose: 15000 }
    );
  };

  public renderCreateForm = (
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
        <Helmet>
          <title>{_("Sign Up")}</title>
          <meta name="description" content={_("Sign Up")} />
        </Helmet>
        <FormFilesUpload
          label={`${_("Avatar")}:`}
          multiple={false}
          name="avatar"
          description={_("Click here to choose your image")}
          errors={formErrors.avatar}
          onChange={(target: any) => onChange(target, "image")}
          value={formValues.avatar}
        />
        <Row>
          <Col lg={6}>
            <FormCheckBoxes
              type="radio"
              name="gender"
              label={`${_("Gender")}*`}
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
              label={`${_("Country")}*`}
              placeholder={_("Start typing...")}
              name="country"
              required={true}
              value={formValues.country}
              onChange={(target: any) =>
                onChange(target, "select", { region: null, city: null })
              }
              errors={formErrors.country}
              fetchURL={SERVER_URLS.SELECTS.COUNTRY.buildPath()}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormAsyncSelect
              label={`${_("Region/State")}*`}
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
              label={`${_("City")}*`}
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
              label={`${_("Theme")}*`}
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
              label={`${_("Format")}*`}
              checkboxes={userFormats}
              value={formValues.relationship_formats}
              onChange={onChange}
              errors={formErrors.relationship_formats}
            />
          </Col>
        </Row>
        <hr />
        <FormInputArray
          label={`${_("Users can find me here (social links)")}`}
          name="social_links"
          value={formValues.social_links || []}
          onChange={(value: any) =>
            onChange({ name: "social_links", value }, "array")
          }
          errors={formErrors.social_links}
        />
        <hr />
        <Row>
          <Col lg={6}>
            <FormInput
              label={_("Phone")}
              help={_("Only friends will see your phone.")}
              type="text"
              name="phone"
              required={false}
              onChange={onChange}
              value={formValues.phone || ""}
              errors={formErrors.phone}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FormInput
              label={_("Skype")}
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
        <FormRichEditor
          label={_("About me")}
          name="about"
          required={true}
          value={formValues.about || ""}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.about}
        />
        <hr />
        <FormInput
          label={`${_("Password")}*`}
          type="password"
          placeholder={_("Password")}
          name="new_password"
          required={true}
          value={formValues.new_password}
          onChange={onChange}
          errors={formErrors.new_password}
        />
        <FormInput
          label={`${_("Repeat password")}*`}
          type="password"
          placeholder={_("Repeat password")}
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
      <Container className="signup-finish-container">
        <Row>
          <Col lg={{ span: 8, offset: 2 }}>
            <Create
              title={_("Finish registration")}
              createServerPath={SERVER_URLS.SIGN_UP_STEP_2.buildPath({
                userPk: this.props.match.params.userPk
              })}
              renderCreateForm={this.renderCreateForm}
              onSuccess={this.onSuccess}
              submitBtnTitle={_("Sign Up")}
              method="PATCH"
              convertFormValuesToServer={this.convertFormValuesToServer}
              size={12}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignUpFinish;

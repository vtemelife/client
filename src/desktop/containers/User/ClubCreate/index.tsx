import React from "react";
import compose from "lodash/flowRight";
import { RouteComponentProps } from "react-router";
import slugify from "slugify";

import { SERVER_URLS } from "routes/server";
import Create from "desktop/containers/Generics/Create";
import FormSlug from "generic/components/Form/FormSlug";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormSelect from "generic/components/Form/FormSelect";
import FormMap from "generic/components/Form/FormMap";
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from "generic/constants";
import { _ } from "trans";
import { withAuthUser } from "generic/containers/Decorators";

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
}

class ClubCreate extends React.PureComponent<IProps> {
  public onSuccess = () => {
    this.props.history.goBack();
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    formValuesToServer.image =
      formValuesToServer.image && formValuesToServer.image.length > 0
        ? formValuesToServer.image[0].pk
        : undefined;
    formValuesToServer.country = formValuesToServer.country
      ? formValuesToServer.country.pk
      : undefined;
    formValuesToServer.region = formValuesToServer.region
      ? formValuesToServer.region.pk
      : undefined;
    formValuesToServer.city = formValuesToServer.city
      ? formValuesToServer.city.pk
      : undefined;
    formValuesToServer.relationship_theme = formValuesToServer.relationship_theme
      ? formValuesToServer.relationship_theme.value
      : undefined;
    formValuesToServer.club_type = formValuesToServer.club_type
      ? formValuesToServer.club_type.value
      : undefined;
    return formValuesToServer;
  };

  public renderCreateForm = (
    formValues: any,
    formErrors: any,
    onChange: any
  ) => {
    const user = this.props.authUser.user;
    const city = user ? user.city : undefined;
    return (
      <>
        <FormInput
          label={`${_("Name")}*`}
          type="text-break"
          name="name"
          required={true}
          onChange={(target: any) => {
            onChange(target);
            onChange(
              { name: "slug", value: slugify(target.target.value) },
              "slug"
            );
          }}
          value={formValues.name || ""}
          errors={formErrors.name}
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
        <FormRichEditor
          label={_("Description")}
          name="description"
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.description || ""}
          errors={formErrors.description}
        />
        <FormFilesUpload
          label={_("Image")}
          multiple={false}
          name="image"
          description={_("Click here to choose your image")}
          errors={formErrors.image}
          value={formValues.image}
          onChange={(target: any) => onChange(target, "image")}
        />
        <hr />
        <FormSelect
          label={`${_("Theme")}*`}
          required={true}
          name="relationship_theme"
          options={COMMUNITY_THEMES}
          value={formValues.relationship_theme}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.relationship_theme}
        />
        <FormSelect
          label={`${_("Type")}*`}
          required={true}
          name="club_type"
          options={COMMUNITY_TYPES}
          value={formValues.club_type}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.club_type}
        />
        <hr />
        <FormAsyncSelect
          label={`${_("Country")}*`}
          placeholder={_("Start typing...")}
          name="country"
          required={true}
          defaultOptions={true}
          value={formValues.country}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.country}
          fetchURL={SERVER_URLS.SELECTS.COUNTRY.buildPath()}
        />
        <FormAsyncSelect
          label={`${_("Region/State")}*`}
          placeholder={_("Start typing...")}
          isDisabled={!formValues.country || !formValues.country.pk}
          name="region"
          required={true}
          defaultOptions={formValues.country && formValues.country.pk}
          value={formValues.region}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.region}
          fetchURL={SERVER_URLS.SELECTS.REGION.buildPath()}
          filterURL={
            formValues.country ? `country=${formValues.country.pk}` : undefined
          }
        />
        <FormAsyncSelect
          label={`${_("City")}*`}
          placeholder={_("Start typing...")}
          isDisabled={!formValues.region || !formValues.region.pk}
          name="city"
          required={true}
          defaultOptions={formValues.region && formValues.region.pk}
          value={formValues.city}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.city}
          fetchURL={SERVER_URLS.SELECTS.CITY.buildPath()}
          filterURL={
            formValues.region ? `region=${formValues.region.pk}` : undefined
          }
        />
        <FormRichEditor
          label={_("Address *")}
          name="address"
          required={true}
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.address || ""}
          errors={formErrors.address}
        />
        <FormMap
          label={_("Drag and drop the marker on the map")}
          name="geo"
          center={
            city && city.latitude && city.longitude
              ? [city.latitude, city.longitude]
              : undefined
          }
          errors={formErrors.geo}
          value={formValues.geo}
          onChange={(target: any) => onChange(target, "map")}
        />
      </>
    );
  };

  public render() {
    const user = this.props.authUser.user;
    return (
      <Create
        initialValues={{
          country: user.city.country,
          region: user.city.region,
          city: user.city
        }}
        title={_("Create a club")}
        createServerPath={SERVER_URLS.CLUB_CREATE.buildPath()}
        renderCreateForm={this.renderCreateForm}
        onSuccess={this.onSuccess}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

export default compose(withAuth)(ClubCreate);

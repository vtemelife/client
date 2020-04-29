import React from "react";
import { RouteComponentProps } from "react-router";
import slugify from "slugify";

import Update from "desktop/containers/Generics/Update";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import FormSlug from "generic/components/Form/FormSlug";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormSelect from "generic/components/Form/FormSelect";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormMap from "generic/components/Form/FormMap";
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from "generic/constants";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class ClubUpdate extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.history.push({
      pathname: CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
        clubSlug: result.slug
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
    formValuesFromServer.image =
      formValuesFromServer.image && formValuesFromServer.image.pk
        ? [formValuesFromServer.image]
        : [];
    return formValuesFromServer;
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

  public renderUpdateForm = (
    formValues: any,
    formErrors: any,
    onChange: any
  ) => {
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
          errors={formErrors.geo}
          value={formValues.geo}
          onChange={(target: any) => onChange(target, "map")}
        />
      </>
    );
  };

  public render() {
    return (
      <Update
        title={_("Update the club")}
        retrieveServerPath={SERVER_URLS.CLUB_DETAIL.buildPath({
          clubSlug: this.props.match.params.clubSlug
        })}
        updateServerPath={SERVER_URLS.CLUB_UPDATE.buildPath({
          clubSlug: this.props.match.params.clubSlug
        })}
        renderUpdateForm={this.renderUpdateForm}
        onSuccess={this.onSuccess}
        convertFormValuesFromServer={this.convertFormValuesFromServer}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default ClubUpdate;

import React from "react";
import compose from "lodash/flowRight";
import { RouteComponentProps } from "react-router";
import queryString from "query-string";
import slugify from "slugify";

import { SERVER_URLS } from "routes/server";
import Create from "desktop/containers/Generics/Create";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormSlug from "generic/components/Form/FormSlug";
import { _ } from "trans";
import { withAuthUser } from "generic/containers/Decorators";
import FormMap from "generic/components/Form/FormMap";
import FormDatePicker from "generic/components/Form/FormDatePicker";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormSelect from "generic/components/Form/FormSelect";
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from "generic/constants";

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
}

class PartyCreate extends React.PureComponent<IProps> {
  public onSuccess = () => {
    this.props.history.goBack();
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    const getParams = { ...queryString.parse(this.props.location.search) };
    formValuesToServer.club = getParams.club;
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
    formValuesToServer.theme = formValuesToServer.theme
      ? formValuesToServer.theme.value
      : undefined;
    formValuesToServer.party_type = formValuesToServer.party_type
      ? formValuesToServer.party_type.value
      : undefined;
    formValuesToServer.hash_tags = formValuesToServer.hash_tags
      ? formValuesToServer.hash_tags
          .split("#")
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
      : [];
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
          label={`${_("Name")}*:`}
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
        <hr />
        <FormSelect
          label={`${_("Theme")}*:`}
          required={true}
          name="theme"
          options={COMMUNITY_THEMES}
          value={formValues.theme}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.theme}
        />
        <FormSelect
          label={`${_("Type")}*:`}
          required={true}
          name="party_type"
          options={COMMUNITY_TYPES}
          value={formValues.party_type}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.party_type}
        />
        <FormFilesUpload
          label={`${_("Image on list view")}:`}
          multiple={false}
          name="image"
          description={_("Click here to choose your image")}
          errors={formErrors.image}
          value={formValues.image}
          onChange={(target: any) => onChange(target, "image")}
        />
        <FormRichEditor
          label={`${_("Short description on list view")}*:`}
          name="short_description"
          required={true}
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.short_description || ""}
          errors={formErrors.short_description}
        />
        <FormRichEditor
          label={`${_("Description")}*:`}
          name="description"
          richToolbar={true}
          required={true}
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.description || ""}
          errors={formErrors.description}
        />
        <hr />
        <FormInput
          label={_("Price M")}
          type="number"
          name="man_cost"
          onChange={onChange}
          value={formValues.man_cost || ""}
          errors={formErrors.man_cost}
        />
        <FormInput
          label={_("Price W")}
          type="number"
          name="woman_cost"
          onChange={onChange}
          value={formValues.woman_cost || ""}
          errors={formErrors.woman_cost}
        />
        <FormInput
          label={_("Price Couple")}
          type="number"
          name="pair_cost"
          onChange={onChange}
          value={formValues.pair_cost || ""}
          errors={formErrors.pair_cost}
        />
        <hr />
        <FormDatePicker
          showTimeSelect={true}
          dateFormat="Pp"
          label={_("Start date *")}
          name="start_date"
          onChange={(value: any) =>
            onChange({ name: "start_date", value }, "datetime")
          }
          value={formValues.start_date || ""}
          errors={formErrors.start_date}
        />
        <FormDatePicker
          showTimeSelect={true}
          dateFormat="Pp"
          label={_("End date *")}
          name="end_date"
          onChange={(value: any) =>
            onChange({ name: "end_date", value }, "datetime")
          }
          value={formValues.end_date || ""}
          errors={formErrors.end_date}
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
        <hr />
        <FormMap
          label={_("Drag and drop the marker on the map")}
          name="geo"
          errors={formErrors.geo}
          center={
            city && city.latitude && city.longitude
              ? [city.latitude, city.longitude]
              : undefined
          }
          value={formValues.geo}
          onChange={(target: any) => onChange(target, "map")}
        />
        <hr />
        <FormInput
          label={`${_("Hash tags")}:`}
          type="text-break"
          name="hash_tags"
          onChange={onChange}
          value={formValues.hash_tags}
          errors={formErrors.hash_tags}
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
        title={_("Create a party")}
        createServerPath={SERVER_URLS.PARTY_CREATE.buildPath()}
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

export default compose(withAuth)(PartyCreate);

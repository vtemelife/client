import React from "react";
import { RouteComponentProps } from "react-router";
import slugify from "slugify";

import { SERVER_URLS } from "routes/server";
import Create from "desktop/containers/Generics/Create";
import FormSlug from "generic/components/Form/FormSlug";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormSelect from "generic/components/Form/FormSelect";
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from "generic/constants";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class GroupCreate extends React.PureComponent<IProps> {
  public onSuccess = () => {
    this.props.history.goBack();
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    formValuesToServer.image =
      formValuesToServer.image && formValuesToServer.image.length > 0
        ? formValuesToServer.image[0].pk
        : undefined;
    formValuesToServer.relationship_theme = formValuesToServer.relationship_theme
      ? formValuesToServer.relationship_theme.value
      : undefined;
    formValuesToServer.group_type = formValuesToServer.group_type
      ? formValuesToServer.group_type.value
      : undefined;
    return formValuesToServer;
  };

  public renderCreateForm = (
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
          name="group_type"
          options={COMMUNITY_TYPES}
          value={formValues.group_type}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.group_type}
        />
      </>
    );
  };

  public render() {
    return (
      <Create
        title={_("Create a group")}
        createServerPath={SERVER_URLS.GROUP_CREATE.buildPath()}
        renderCreateForm={this.renderCreateForm}
        onSuccess={this.onSuccess}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default GroupCreate;

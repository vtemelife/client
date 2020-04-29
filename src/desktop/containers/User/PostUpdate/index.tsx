import React from "react";
import { RouteComponentProps } from "react-router";

import Update from "desktop/containers/Generics/Update";
import { SERVER_URLS } from "routes/server";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormSlug from "generic/components/Form/FormSlug";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class PostUpdate extends React.PureComponent<IProps> {
  public onSuccess = () => {
    this.props.history.goBack();
  };

  public convertFormValuesFromServer = (formValuesFromServer: any) => {
    formValuesFromServer.image =
      formValuesFromServer.image && formValuesFromServer.image.pk
        ? [formValuesFromServer.image]
        : [];
    formValuesFromServer.hash_tags = formValuesFromServer.hash_tags
      .map((item: string) => `#${item}`)
      .join(" ");
    return formValuesFromServer;
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    formValuesToServer.image =
      formValuesToServer.image && formValuesToServer.image.length > 0
        ? formValuesToServer.image[0].pk
        : undefined;
    formValuesToServer.hash_tags = formValuesToServer.hash_tags
      ? formValuesToServer.hash_tags
          .split("#")
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
      : [];
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
          label={`${_("Title")}*:`}
          type="text-break"
          name="title"
          required={true}
          onChange={onChange}
          value={formValues.title}
          errors={formErrors.title}
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
          name="description"
          required={true}
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.description}
          errors={formErrors.description}
        />
        <FormRichEditor
          label={`${_("Post")}*:`}
          name="post"
          richToolbar={true}
          required={true}
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.post}
          errors={formErrors.post}
        />
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
    return (
      <Update
        title={_("Update the post")}
        retrieveServerPath={SERVER_URLS.POSTS_DETAIL.buildPath({
          postSlug: this.props.match.params.postSlug
        })}
        updateServerPath={SERVER_URLS.POSTS_UPDATE.buildPath({
          postSlug: this.props.match.params.postSlug
        })}
        renderUpdateForm={this.renderUpdateForm}
        onSuccess={this.onSuccess}
        convertFormValuesFromServer={this.convertFormValuesFromServer}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default PostUpdate;

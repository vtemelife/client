import React from "react";
import compose from "lodash/flowRight";
import { RouteComponentProps } from "react-router";
import queryString from "query-string";
import slugify from "slugify";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import Create from "desktop/containers/Generics/Create";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormSlug from "generic/components/Form/FormSlug";
import { _ } from "trans";
import { withAuthUser } from "generic/containers/Decorators";

interface IProps extends RouteComponentProps {
  match: any;
  objectId?: string;
  contentType?: string;
  authUser: any;
}

class PostCreate extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.history.push({
      pathname: CLIENT_URLS.POSTS_DETAIL.buildPath({ postSlug: result.slug })
    });
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    const user = this.props.authUser.user;
    const getParams = { ...queryString.parse(this.props.location.search) };
    formValuesToServer.object_id = getParams.object_id || user.pk;
    formValuesToServer.content_type = getParams.content_type || "users:user";
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

  public renderCreateForm = (
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
          onChange={(target: any) => {
            onChange(target);
            onChange(
              { name: "slug", value: slugify(target.target.value) },
              "slug"
            );
          }}
          value={formValues.title || ""}
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
          value={formValues.description || ""}
          errors={formErrors.description}
        />
        <FormRichEditor
          label={`${_("Post")}*:`}
          name="post"
          richToolbar={true}
          required={true}
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.post || ""}
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
      <Create
        title={_("Create a post")}
        createServerPath={SERVER_URLS.POSTS_CREATE.buildPath()}
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

export default compose(withAuth)(PostCreate);

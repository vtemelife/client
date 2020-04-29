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

class GameUpdate extends React.PureComponent<IProps> {
  public onSuccess = () => {
    this.props.history.goBack();
  };

  public convertFormValuesFromServer = (formValuesFromServer: any) => {
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
          label={_("Name")}
          type="text-break"
          name="name"
          required={true}
          onChange={onChange}
          value={formValues.name || ""}
          errors={formErrors.name}
        />
        <FormSlug
          label={`${_("Slug")}*`}
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
        <FormRichEditor
          label={_("Rules")}
          name="rules"
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.rules || ""}
          errors={formErrors.rules}
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
        title={_("Update the game")}
        retrieveServerPath={SERVER_URLS.GAME_DETAIL.buildPath({
          gameSlug: this.props.match.params.gameSlug
        })}
        updateServerPath={SERVER_URLS.GAME_UPDATE.buildPath({
          gameSlug: this.props.match.params.gameSlug
        })}
        renderUpdateForm={this.renderUpdateForm}
        onSuccess={this.onSuccess}
        convertFormValuesFromServer={this.convertFormValuesFromServer}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default GameUpdate;

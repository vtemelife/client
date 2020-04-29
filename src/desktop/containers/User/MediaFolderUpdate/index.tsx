import React from "react";
import { RouteComponentProps } from "react-router";

import Update from "desktop/containers/Generics/Update";
import { SERVER_URLS } from "routes/server";
import FormInput from "generic/components/Form/FormInput";
import { PERMISSIONS } from "generic/constants";
import FormSelect from "generic/components/Form/FormSelect";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class MediaFolderUpdate extends React.PureComponent<IProps> {
  public onSuccess = () => {
    this.props.history.goBack();
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    formValuesToServer.show_media = formValuesToServer.show_media
      ? formValuesToServer.show_media.value
      : undefined;
    return formValuesToServer;
  };

  public convertFormValuesFromServer = (formValuesFromServer: any) => {
    return formValuesFromServer;
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
          value={formValues.name}
          onChange={onChange}
          errors={formErrors.name}
        />
        <FormSelect
          label={_("Access")}
          required={true}
          name="show_media"
          options={PERMISSIONS}
          value={formValues.show_media}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.show_media}
        />
      </>
    );
  };

  public render() {
    return (
      <Update
        title={_("Update the media folder")}
        retrieveServerPath={SERVER_URLS.MEDIA_FOLDER_DETAIL.buildPath({
          mediaFolderPk: this.props.match.params.mediaFolderPk
        })}
        updateServerPath={SERVER_URLS.MEDIA_FOLDER_UPDATE.buildPath({
          mediaFolderPk: this.props.match.params.mediaFolderPk
        })}
        renderUpdateForm={this.renderUpdateForm}
        onSuccess={this.onSuccess}
        convertFormValuesToServer={this.convertFormValuesToServer}
        convertFormValuesFromServer={this.convertFormValuesFromServer}
      />
    );
  }
}

export default MediaFolderUpdate;

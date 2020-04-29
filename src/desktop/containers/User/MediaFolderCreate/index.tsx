import React from "react";
import { RouteComponentProps } from "react-router";

import { SERVER_URLS } from "routes/server";
import Create from "desktop/containers/Generics/Create";
import FormInput from "generic/components/Form/FormInput";
import FormSelect from "generic/components/Form/FormSelect";
import { PERMISSIONS } from "generic/constants";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class MediaFolderCreate extends React.PureComponent<IProps> {
  public onSuccess = () => {
    this.props.history.goBack();
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    formValuesToServer.show_media = formValuesToServer.show_media
      ? formValuesToServer.show_media.value
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
      <Create
        title={_("Create a media folder")}
        createServerPath={SERVER_URLS.MEDIA_FOLDER_CREATE.buildPath()}
        renderCreateForm={this.renderCreateForm}
        onSuccess={this.onSuccess}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default MediaFolderCreate;

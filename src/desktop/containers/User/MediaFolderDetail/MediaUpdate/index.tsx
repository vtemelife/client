import React from "react";
import { RouteComponentProps } from "react-router";

import Update from "desktop/containers/Generics/Update";
import { SERVER_URLS } from "routes/server";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import { _ } from "trans";
import { MEDIA_TYPE_VIDEO } from "generic/constants";

interface IProps extends RouteComponentProps {
  match: any;
}

class MediaUpdate extends React.PureComponent<IProps> {
  public onSuccess = () => {
    this.props.history.goBack();
  };

  public convertFormValuesFromServer = (formValuesFromServer: any) => {
    const data = {
      media_type: formValuesFromServer.media_type,
      video_code: formValuesFromServer.video_code,
      title: formValuesFromServer.title,
      description: formValuesFromServer.description,
      hash_tags: formValuesFromServer.hash_tags
        .map((item: string) => `#${item}`)
        .join(" ")
    };
    return data;
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
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
        {formValues.media_type &&
          formValues.media_type === MEDIA_TYPE_VIDEO && (
            <FormInput
              label={`${_("Video url or embed code")}*:`}
              type="text-break"
              name="video_code"
              placeholder={_("Copy and paste video url or embed code here")}
              onChange={onChange}
              value={formValues.video_code}
              errors={formErrors.video_code}
            />
          )}
        <FormInput
          label={_("Title")}
          type="text-break"
          name="title"
          value={formValues.title}
          onChange={onChange}
          errors={formErrors.title}
        />
        <FormRichEditor
          label={_("Description")}
          name="description"
          value={formValues.description}
          onChange={(target: any) => onChange(target, "editor")}
          errors={formErrors.description}
        />
        <FormInput
          label={`${_("Hash tags")}:`}
          type="text-break"
          name="hash_tags"
          value={formValues.hash_tags}
          onChange={onChange}
          errors={formErrors.hash_tags}
        />
      </>
    );
  };

  public render() {
    return (
      <Update
        title={_("Update the media")}
        retrieveServerPath={SERVER_URLS.MEDIA_DETAIL.buildPath({
          mediaPk: this.props.match.params.mediaPk
        })}
        updateServerPath={SERVER_URLS.MEDIA_UPDATE.buildPath({
          mediaPk: this.props.match.params.mediaPk
        })}
        renderUpdateForm={this.renderUpdateForm}
        onSuccess={this.onSuccess}
        convertFormValuesFromServer={this.convertFormValuesFromServer}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default MediaUpdate;

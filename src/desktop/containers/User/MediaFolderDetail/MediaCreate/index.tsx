import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import queryString from "query-string";

import { SERVER_URLS } from "routes/server";
import Create from "desktop/containers/Generics/Create";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class MediaCreate extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.history.goBack();
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    const getParams = { ...queryString.parse(this.props.location.search) };
    formValuesToServer.object_id = getParams.object_id;
    formValuesToServer.content_type = getParams.content_type;
    formValuesToServer.media_type = formValuesToServer.video_code
      ? "video"
      : "photo";
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
        <Tabs defaultActiveKey="photo" id="media-data">
          <Tab eventKey="photo" title="Фото">
            <br />
            <FormFilesUpload
              multiple={false}
              name="image"
              description={_("Click here to choose your image")}
              errors={formErrors.image}
              value={formValues.image}
              onChange={(target: any) => onChange(target, "image")}
            />
          </Tab>
          <Tab eventKey="video" title="Видео">
            <br />
            <FormInput
              type="text-break"
              name="video_code"
              placeholder={_("Copy and paste video url or embed code here")}
              onChange={onChange}
              value={formValues.video_code}
              errors={formErrors.video_code}
            />
          </Tab>
        </Tabs>
        <FormInput
          label={_("Title")}
          type="text-break"
          name="title"
          onChange={onChange}
          value={formValues.title || ""}
          errors={formErrors.title}
        />
        <FormRichEditor
          label={_("Description")}
          name="description"
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.description || ""}
          errors={formErrors.description}
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
        title={_("Create a media")}
        createServerPath={SERVER_URLS.MEDIA_CREATE.buildPath()}
        renderCreateForm={this.renderCreateForm}
        onSuccess={this.onSuccess}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default MediaCreate;

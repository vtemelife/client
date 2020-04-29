import React from "react";
import { RouteComponentProps } from "react-router";

import Update from "desktop/containers/Generics/Update";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import { _ } from "trans";
import FormDatePicker from "generic/components/Form/FormDatePicker";

interface IProps extends RouteComponentProps {
  match: any;
}

class NewsUpdate extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.history.push({
      pathname: CLIENT_URLS.MODERATOR.NEWS_LIST.buildPath()
    });
  };

  public convertFormValuesFromServer = (formValuesFromServer: any) => {
    formValuesFromServer.image =
      formValuesFromServer.image && formValuesFromServer.image.pk
        ? [formValuesFromServer.image]
        : [];
    formValuesFromServer.publish_date = formValuesFromServer.publish_date
      ? new Date(formValuesFromServer.publish_date)
      : undefined;
    formValuesFromServer.end_publish_date = formValuesFromServer.end_publish_date
      ? new Date(formValuesFromServer.end_publish_date)
      : undefined;
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
          label={_("Title")}
          type="text-break"
          name="title"
          required={true}
          onChange={onChange}
          value={formValues.title}
          errors={formErrors.title}
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
        <FormDatePicker
          showTimeSelect={true}
          dateFormat="Pp"
          label={_("Date of publication")}
          name="publish_date"
          onChange={(value: any) =>
            onChange({ name: "publish_date", value }, "datetime")
          }
          value={formValues.publish_date || ""}
          errors={formErrors.publish_date}
        />
        <FormDatePicker
          showTimeSelect={true}
          dateFormat="Pp"
          label={_("Publication end date")}
          name="end_publish_date"
          onChange={(value: any) =>
            onChange({ name: "end_publish_date", value }, "datetime")
          }
          value={formValues.end_publish_date || ""}
          errors={formErrors.end_publish_date}
        />
        <FormRichEditor
          label={_("Short description")}
          name="description"
          required={true}
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.description || ""}
          errors={formErrors.description}
        />
        <FormRichEditor
          label={_("News")}
          name="news"
          richToolbar={true}
          required={true}
          onChange={(target: any) => onChange(target, "editor")}
          value={formValues.news || ""}
          errors={formErrors.news}
        />
      </>
    );
  };

  public render() {
    return (
      <Update
        title={_("Update the news")}
        retrieveServerPath={SERVER_URLS.MODERATION_NEWS_DETAIL.buildPath({
          newsPk: this.props.match.params.newsPk
        })}
        updateServerPath={SERVER_URLS.MODERATION_NEWS_UPDATE.buildPath({
          newsPk: this.props.match.params.newsPk
        })}
        renderUpdateForm={this.renderUpdateForm}
        onSuccess={this.onSuccess}
        convertFormValuesFromServer={this.convertFormValuesFromServer}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default NewsUpdate;

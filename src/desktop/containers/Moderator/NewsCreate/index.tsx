import React from "react";
import { RouteComponentProps as IPropsWrapper } from "react-router";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import Create from "desktop/containers/Generics/Create";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormDatePicker from "generic/components/Form/FormDatePicker";
import { HeaderUserConsumer } from "generic/containers/ContextProviders/HeaderUserService";
import { _ } from "trans";

interface IProps extends IPropsWrapper {
  match: any;
  objectId?: string;
  contentType?: string;
  headerUser: any;
  refetchHeaderUser: any;
}

class NewsCreate extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.history.push({
      pathname: CLIENT_URLS.MODERATOR.NEWS_LIST.buildPath()
    });
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    formValuesToServer.image =
      formValuesToServer.image && formValuesToServer.image.length > 0
        ? formValuesToServer.image[0].pk
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
          label={_("Title")}
          type="text-break"
          name="title"
          required={true}
          onChange={onChange}
          value={formValues.title || ""}
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
      <Create
        title={_("Create news")}
        createServerPath={SERVER_URLS.MODERATION_NEWS_CREATE.buildPath()}
        renderCreateForm={this.renderCreateForm}
        onSuccess={this.onSuccess}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

const NewsCreateWrapper: React.FC<IPropsWrapper> = props => (
  <HeaderUserConsumer>
    {contextHeaderUser =>
      contextHeaderUser && (
        <NewsCreate
          {...props}
          headerUser={contextHeaderUser.headerUser}
          refetchHeaderUser={contextHeaderUser.refetchHeaderUser}
        />
      )
    }
  </HeaderUserConsumer>
);

export default NewsCreateWrapper;

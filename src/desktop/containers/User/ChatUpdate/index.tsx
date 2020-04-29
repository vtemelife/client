import React from "react";
import { RouteComponentProps } from "react-router";

import Update from "desktop/containers/Generics/Update";
import { SERVER_URLS } from "routes/server";
import FormInput from "generic/components/Form/FormInput";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class ChatUpdate extends React.PureComponent<IProps> {
  public onSuccess = () => {
    this.props.history.goBack();
  };

  public convertFormValuesFromServer = (formValuesFromServer: any) => {
    formValuesFromServer.avatar =
      formValuesFromServer.avatar && formValuesFromServer.avatar.pk
        ? [formValuesFromServer.avatar]
        : [];
    formValuesFromServer.moderators = formValuesFromServer.moderators
      ? formValuesFromServer.moderators.map((i: any) => ({
          pk: i.pk,
          name: i.name
        }))
      : undefined;
    formValuesFromServer.users = formValuesFromServer.users
      ? formValuesFromServer.users.map((i: any) => ({
          pk: i.pk,
          name: i.name
        }))
      : undefined;
    return formValuesFromServer;
  };

  public convertFormValuesToServer = (formValuesToServer: any) => {
    formValuesToServer.avatar =
      formValuesToServer.avatar && formValuesToServer.avatar.length > 0
        ? formValuesToServer.avatar[0].pk
        : undefined;
    formValuesToServer.moderators = formValuesToServer.moderators
      ? formValuesToServer.moderators.map((i: any) => i.pk)
      : undefined;
    formValuesToServer.users = formValuesToServer.users
      ? formValuesToServer.users.map((i: any) => i.pk)
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
          label={`${_("Name")}*`}
          type="text-break"
          name="name"
          required={true}
          onChange={onChange}
          value={formValues.name}
          errors={formErrors.name}
        />
        <FormFilesUpload
          label={`${_("Image on list view")}:`}
          multiple={false}
          name="avatar"
          description={_("Click here to choose your image")}
          errors={formErrors.avatar}
          value={formValues.avatar}
          onChange={(target: any) => onChange(target, "image")}
        />
        <FormAsyncSelect
          label={`${_("Moderators")}*`}
          placeholder={_("Start typing...")}
          name="moderators"
          required={true}
          isMulti={true}
          value={formValues.moderators}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.moderators}
          fetchURL={SERVER_URLS.SELECTS.CHAT_MODERATORS.buildPath()}
        />
        <FormAsyncSelect
          label={`${_("Participants")}*`}
          placeholder={_("Start typing...")}
          name="users"
          required={true}
          isMulti={true}
          value={formValues.users}
          onChange={(target: any) => onChange(target, "select")}
          errors={formErrors.users}
          fetchURL={SERVER_URLS.SELECTS.CHAT_USERS.buildPath()}
        />
      </>
    );
  };

  public render() {
    return (
      <Update
        title={_("Update the chat")}
        retrieveServerPath={SERVER_URLS.CHAT_DETAIL.buildPath({
          chatPk: this.props.match.params.chatPk
        })}
        updateServerPath={SERVER_URLS.CHAT_UPDATE.buildPath({
          chatPk: this.props.match.params.chatPk
        })}
        renderUpdateForm={this.renderUpdateForm}
        onSuccess={this.onSuccess}
        convertFormValuesFromServer={this.convertFormValuesFromServer}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default ChatUpdate;

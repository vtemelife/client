import React from 'react';
import { RouteComponentProps } from 'react-router';
import queryString from 'query-string';

import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import Create from 'desktop/containers/Generics/Create';
import FormAsyncSelect from 'generic/components/Form/FormAsyncSelect';
import FormMsgArea from 'generic/components/Form/FormMsgArea';
import { _ } from 'trans';

interface IProps extends RouteComponentProps {
  match: any;
}

class ChatCreate extends React.PureComponent<IProps> {
  public onSuccess = (result: any) => {
    this.props.history.push({
      pathname: CLIENT_URLS.USER.CHAT_DETAIL.buildPath({
        chatPk: result.pk,
      }),
    });
  };

  public convertFormValuesToServer = (formValues: any) => {
    formValues.users = formValues.users
      ? formValues.users.map((i: any) => i.pk)
      : undefined;
    formValues.message = formValues.message.replace(
      /(?:\r\n|\r|\n)/g,
      '<br />',
    );
    return formValues;
  };

  public renderCreateForm = (
    formValues: any,
    formErrors: any,
    onChange: any,
  ) => {
    return (
      <>
        <FormAsyncSelect
          label={`${_('Participants')}*`}
          placeholder={_('Start typing...')}
          name="users"
          required={true}
          isMulti={true}
          value={formValues.users}
          onChange={(target: any) => onChange(target, 'select')}
          errors={formErrors.users}
          fetchURL={SERVER_URLS.SELECTS.CHAT_USERS.buildPath()}
        />
        <FormMsgArea
          label={_('Message')}
          name="message"
          value={formValues.message || ''}
          onChange={(target: any) => onChange(target, 'editor')}
          errors={formErrors.message}
        />
      </>
    );
  };

  public getTitle = (queryParams: any) => {
    return _('Create a chat');
  };

  public render() {
    const queryParams = { ...queryString.parse(this.props.location.search) };
    return (
      <Create
        title={this.getTitle(queryParams)}
        createServerPath={SERVER_URLS.CHAT_CREATE.buildPath()}
        renderCreateForm={this.renderCreateForm}
        onSuccess={this.onSuccess}
        convertFormValuesToServer={this.convertFormValuesToServer}
      />
    );
  }
}

export default ChatCreate;

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutate, useGet } from 'restful-react';
import { useHistory, useParams } from 'react-router';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import FormAsyncSelect from 'generic/components/Form/FormAsyncSelect';
import Header from 'mobile/containers/Header';
import FormInput from 'generic/components/Form/FormInput';
import { Button } from 'react-bootstrap';
import Loading from 'generic/components/Loading';
import { handleSuccess, handleErrors } from 'utils';
import FormFilesUpload from 'generic/components/Form/FormFilesUpload';

const ChatUpdate: React.SFC<any> = () => {
  const history = useHistory();
  const { chatPk } = useParams();

  const [formData, changeFormData] = useState({} as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  const { mutate: submitForm, loading } = useMutate({
    verb: 'PATCH',
    path: SERVER_URLS.CHAT_UPDATE.buildPath({
      chatPk,
    }),
  });

  const { data: chatData, loading: chatLoading } = useGet({
    path: SERVER_URLS.CHAT_DETAIL.buildPath({
      chatPk,
    }),
  });

  useEffect(() => {
    if (!chatData) {
      return;
    }
    const defaultFormData = {
      name: chatData.name || '',
      avatar: chatData.avatar && chatData.avatar.pk ? [chatData.avatar] : [],
      users: chatData.users.map((u: any) => ({ pk: u.pk, name: u.name })) || [],
      moderators:
        chatData.moderators.map((u: any) => ({ pk: u.pk, name: u.name })) || [],
    } as any;
    changeFormData(defaultFormData);
  }, [chatData, changeFormData]);

  if (Object.keys(formData).length === 0) {
    return <Loading />;
  }

  return (
    <div className="container-chats-update">
      <Helmet>
        <title>{_('Update the chat')}</title>
        <meta name="description" content={_('Update the chat')} />
      </Helmet>
      <Header name={_('Update the chat')} fixed={true} />
      <div className="chats-update">
        {(chatLoading || loading) && <Loading />}
        <FormInput
          label={`${_('Name')}:`}
          type="text-break"
          name="name"
          required={true}
          value={formData.name}
          errors={formErrors.name}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              name: target.target.value,
            });
          }}
        />
        <FormFilesUpload
          label={`${_('Avatar')}:`}
          multiple={false}
          name="avatar"
          description={_('Click here to choose your image')}
          errors={formErrors.avatar}
          value={formData.avatar}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              avatar: target.value,
            })
          }
        />
        {chatData.chat_type && (
          <FormAsyncSelect
            label={`${_('Participants')}:`}
            placeholder={_('Start typing...')}
            name="users"
            required={true}
            isMulti={true}
            errors={formErrors.users}
            value={formData.users}
            onChange={(target: any) => {
              changeFormData({
                ...formData,
                users: target.value,
              });
            }}
            fetchURL={SERVER_URLS.SELECTS.CHAT_USERS.buildPath()}
          />
        )}
        {chatData.chat_type && (
          <FormAsyncSelect
            label={`${_('Moderators')}:`}
            placeholder={_('Start typing...')}
            name="moderators"
            required={true}
            isMulti={true}
            errors={formErrors.moderators}
            value={formData.moderators}
            onChange={(target: any) => {
              changeFormData({
                ...formData,
                moderators: target.value,
              });
            }}
            fetchURL={SERVER_URLS.SELECTS.CHAT_USERS.buildPath()}
          />
        )}
        <Button
          className="form-button"
          onClick={() => {
            submitForm({
              name: formData.name,
              avatar:
                formData.avatar && formData.avatar.length > 0
                  ? formData.avatar[0].pk
                  : undefined,
              users: formData.users.map((u: any) => u.pk),
              moderators: formData.moderators.map((u: any) => u.pk),
            })
              .then((data: any) => {
                handleSuccess(_('Updated successfully.'));
                history.goBack();
              })
              .catch((errors: any) => {
                handleErrors(errors, changeFormErrors);
              });
          }}
        >
          <i className="fa fa-save fa-lg" />
        </Button>
      </div>
    </div>
  );
};

export default ChatUpdate;

import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Button } from 'react-bootstrap';
import { useMutate, useGet } from 'restful-react';

import Loading from 'generic/components/Loading';
import Image from 'generic/components/Image';
import FormMsgArea from 'generic/components/Form/FormMsgArea';
import Header from 'mobile/containers/Header';

import { _ } from 'trans';
import { CLIENT_URLS } from 'mobile/routes/client';
import { SERVER_URLS } from 'routes/server';
import { handleErrors } from 'utils';

const ChatConversationCreate: React.SFC<any> = () => {
  const history = useHistory();
  const { recipientSlug } = useParams();

  const [formData, changeFormData] = useState({
    message: '',
    attachments: [],
  } as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  const {
    mutate: createConversation,
    loading: createConversationLoading,
  } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.CHAT_CONVERSATION_CREATE.buildPath(),
  });

  const { data: recipientData, loading: recipientLoading } = useGet({
    path: SERVER_URLS.PROFILE.buildPath({
      userSlug: recipientSlug,
    }),
  });
  const recipient = recipientData || {
    name: '',
  };
  if (recipientLoading) {
    return <Loading />;
  }

  return (
    <div className="container-create-conversation">
      <Helmet>
        <title>{_('Create a dialog')}</title>
        <meta name="description" content={_('Create a dialog')} />
        <body className="body-mobile body-chat" />
      </Helmet>
      <Header name={recipient.name || ' '} fixed={true} />
      {(createConversationLoading || recipientLoading) && <Loading />}
      <div className="chat-send-message">
        <div className="chat-attachments">
          {formData.attachments.map((attachment: any, index: number) => (
            <div className="chat-attachments-item" key={index}>
              <Image
                key={index}
                width={100}
                height={100}
                src={attachment.thumbnail_100x100}
              />
              <Button
                variant="danger"
                size="sm"
                className="float-right"
                onClick={() =>
                  changeFormData({
                    ...formData,
                    attachments: formData.attachments.filter(
                      (a: any) => a.pk !== attachment.pk,
                    ),
                  })
                }
              >
                <i className="fa fa-trash" />
              </Button>
            </div>
          ))}
        </div>

        <FormMsgArea
          name="message"
          required={true}
          value={formData.message}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              message: target.value,
            });
          }}
          errors={formErrors.message}
          onChangeAttachments={(attachments: any) => {
            changeFormData({
              ...formData,
              attachments,
            });
          }}
          onSend={() => {
            createConversation({
              recipient: recipientSlug,
              message: formData.message.replace(/(?:\r\n|\r|\n)/g, '<br />'),
              attachments: formData.attachments.map((a: any) => a.pk),
            })
              .then((data: any) => {
                history.push(
                  CLIENT_URLS.USER.CHAT_DETAIL.buildPath({
                    chatPk: data.pk,
                  }),
                );
              })
              .catch((errors: any) => {
                handleErrors(errors, changeFormErrors);
              });
          }}
        />
      </div>
    </div>
  );
};

export default ChatConversationCreate;

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutate } from "restful-react";
import { useHistory } from "react-router";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import Header from "mobile/containers/Header";
import FormInput from "generic/components/Form/FormInput";
import { Button } from "react-bootstrap";
import Loading from "generic/components/Loading";
import { handleSuccess, handleErrors } from "utils";
import FormMsgArea from "generic/components/Form/FormMsgArea";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";

const ChatCreate: React.SFC<any> = () => {
  const history = useHistory();

  const defaultFormData = {
    users: [],
    message: "",
    name: "",
    avatar: [],
    moderators: []
  } as any;
  const [formData, changeFormData] = useState(defaultFormData);
  const [formErrors, changeFormErrors] = useState({} as any);

  const { mutate: submitForm, loading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.CHAT_CREATE.toPath()
  });

  return (
    <div className="container-chats-create">
      <Helmet>
        <title>{_("Create a chat")}</title>
        <meta name="description" content={_("Create a chat")} />
      </Helmet>
      <Header name={_("Create a chat")} fixed={true} />
      <div className="chats-create">
        {loading && <Loading />}
        <FormAsyncSelect
          label={`${_("Participants")}*:`}
          placeholder={_("Start typing...")}
          name="users"
          required={true}
          isMulti={true}
          errors={formErrors.users}
          value={formData.users}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              users: target.value
            });
          }}
          fetchURL={SERVER_URLS.SELECTS.CHAT_USERS.toPath()}
        />
        <FormMsgArea
          label={`${_("Message")}*:`}
          name="message"
          errors={formErrors.message}
          value={formData.message}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              message: target.value
            });
          }}
        />
        <hr />
        <FormInput
          label={`${_("Name")}:`}
          type="text-break"
          name="name"
          required={true}
          value={formData.name}
          errors={formErrors.name}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              name: target.target.value
            });
          }}
        />
        <FormFilesUpload
          label={`${_("Avatar")}:`}
          multiple={false}
          name="avatar"
          description={_("Click here to choose your image")}
          errors={formErrors.avatar}
          value={formData.avatar}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              avatar: target.value
            })
          }
        />
        <FormAsyncSelect
          label={`${_("Moderators")}:`}
          placeholder={_("Start typing...")}
          name="moderators"
          required={true}
          isMulti={true}
          errors={formErrors.moderators}
          value={formData.moderators}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              moderators: target.value
            });
          }}
          fetchURL={SERVER_URLS.SELECTS.CHAT_USERS.toPath()}
        />
        <Button
          className="form-button"
          onClick={() => {
            submitForm({
              users: formData.users.map((u: any) => u.pk),
              message: formData.message,
              name: formData.name,
              avatar:
                formData.avatar && formData.avatar.length > 0
                  ? formData.avatar[0].pk
                  : undefined,
              moderators: formData.moderators.map((u: any) => u.pk)
            })
              .then((data: any) => {
                handleSuccess(_("Created successfully."));
                history.goBack();
              })
              .catch((errors: any) => {
                handleErrors(errors, changeFormErrors);
              });
          }}
        >
          <i className="fa fa-plus fa-lg" />
        </Button>
      </div>
    </div>
  );
};

export default ChatCreate;

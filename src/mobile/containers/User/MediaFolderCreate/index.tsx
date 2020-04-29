import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutate } from "restful-react";
import { useHistory } from "react-router";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import Header from "mobile/containers/Header";
import FormInput from "generic/components/Form/FormInput";
import { Button } from "react-bootstrap";
import Loading from "generic/components/Loading";
import { handleSuccess, handleErrors } from "utils";
import FormSelect from "generic/components/Form/FormSelect";
import { PERMISSIONS } from "generic/constants";

const MediaFolderCreate: React.SFC<any> = () => {
  const history = useHistory();

  const defaultFormData = {
    name: "",
    show_media: null
  } as any;
  const [formData, changeFormData] = useState(defaultFormData);
  const [formErrors, changeFormErrors] = useState({} as any);

  const { mutate: submitForm, loading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.MEDIA_FOLDER_CREATE.toPath()
  });

  return (
    <div className="container-media-folders-create">
      <Helmet>
        <title>{_("Create a media folder")}</title>
        <meta name="description" content={_("Create a media folder")} />
      </Helmet>
      <Header name={_("Create a media folder")} fixed={true} />
      <div className="media-folders-create">
        {loading && <Loading />}
        <FormInput
          label={`${_("Name")}*:`}
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
        <FormSelect
          label={`${_("Access")}*:`}
          required={true}
          name="show_media"
          options={PERMISSIONS}
          value={formData.show_media}
          errors={formErrors.show_media}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              show_media: target.value
            });
          }}
        />
        <Button
          className="form-button"
          onClick={() => {
            submitForm({
              name: formData.name,
              show_media: formData.show_media
                ? formData.show_media.value
                : undefined
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

export default MediaFolderCreate;

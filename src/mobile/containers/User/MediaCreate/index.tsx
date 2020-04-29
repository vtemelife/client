import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutate } from "restful-react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import Header from "mobile/containers/Header";
import FormInput from "generic/components/Form/FormInput";
import { Button } from "react-bootstrap";
import Loading from "generic/components/Loading";
import { handleSuccess, handleErrors } from "utils";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormSelect from "generic/components/Form/FormSelect";
import {
  MEDIA_TYPES,
  MEDIA_TYPE_PHOTO,
  MEDIA_TYPE_VIDEO
} from "generic/constants";

const MediaCreate: React.SFC<any> = () => {
  const history = useHistory();
  const location = useLocation();
  const { objectId, contentType } = queryString.parse(location.search);

  const defaultFormData = {
    media_type: MEDIA_TYPES[0],
    image: [],
    video_code: "",
    title: "",
    description: "",
    hash_tags: ""
  } as any;
  const [formData, changeFormData] = useState(defaultFormData);
  const [formErrors, changeFormErrors] = useState({} as any);

  const { mutate: submitForm, loading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.MEDIA_CREATE.toPath()
  });

  return (
    <div className="container-media-create">
      <Helmet>
        <title>{_("Create a media")}</title>
        <meta name="description" content={_("Create a media")} />
      </Helmet>
      <Header name={_("Create a media")} fixed={true} />
      <div className="media-create">
        {loading && <Loading />}
        <FormSelect
          label={`${_("Media type")}*:`}
          required={true}
          name="media_type"
          options={MEDIA_TYPES}
          value={formData.media_type}
          errors={formErrors.media_type}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              media_type: target.value,
              image: target.value === MEDIA_TYPE_PHOTO ? formData.image : [],
              video_code:
                target.value === MEDIA_TYPE_VIDEO ? formData.video_code : ""
            });
          }}
        />
        {formData.media_type.value === MEDIA_TYPE_PHOTO && (
          <FormFilesUpload
            label={`${_("Image")}*:`}
            multiple={false}
            name="image"
            description={_("Click here to choose your image")}
            errors={formErrors.image}
            value={formData.image}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                image: target.value
              })
            }
          />
        )}
        {formData.media_type.value === MEDIA_TYPE_VIDEO && (
          <FormInput
            label={`${_("Video embed code")}*:`}
            type="text-break"
            name="video_code"
            placeholder={_("Copy and paste video embed code here")}
            errors={formErrors.video_code}
            value={formData.video_code}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                video_code: target.target.value
              })
            }
          />
        )}
        <FormInput
          label={`${_("Title")}:`}
          type="text-break"
          name="title"
          required={true}
          value={formData.title}
          errors={formErrors.title}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              title: target.target.value
            });
          }}
        />
        <FormRichEditor
          label={`${_("Description")}:`}
          name="description"
          required={true}
          value={formData.description}
          errors={formErrors.description}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              description: target.value
            })
          }
        />
        <FormInput
          label={`${_("Hash tags")}:`}
          type="text-break"
          name="hash_tags"
          value={formData.hash_tags}
          errors={formErrors.hash_tags}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              hash_tags: target.target.value
            })
          }
        />
        <Button
          className="form-button"
          onClick={() => {
            submitForm({
              content_type: contentType,
              object_id: objectId,
              media_type: formData.media_type.value,
              image:
                formData.image && formData.image.length > 0
                  ? formData.image[0].pk
                  : undefined,
              video_code: formData.video_code,
              title: formData.title,
              description: formData.description,
              hash_tags: formData.hash_tags
                .split("#")
                .map((el: string) => el.trim())
                .filter((el: string) => el.length > 0)
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

export default MediaCreate;

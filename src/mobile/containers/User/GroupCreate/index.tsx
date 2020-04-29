import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutate } from "restful-react";
import { useHistory } from "react-router";
import slugify from "slugify";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import FormSlug from "generic/components/Form/FormSlug";
import FormSelect from "generic/components/Form/FormSelect";
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from "generic/constants";
import Header from "mobile/containers/Header";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import { Button } from "react-bootstrap";
import Loading from "generic/components/Loading";
import { handleSuccess, handleErrors } from "utils";

const GroupCreate: React.SFC<any> = () => {
  const history = useHistory();

  const defaultFormData = {
    name: "",
    slug: "",
    description: "",
    image: [],
    relationship_theme: null,
    group_type: null
  } as any;
  const [formData, changeFormData] = useState(defaultFormData);
  const [formErrors, changeFormErrors] = useState({} as any);

  const { mutate: submitForm, loading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.GROUP_CREATE.toPath()
  });

  return (
    <div className="container-groups-create">
      <Helmet>
        <title>{_("Create a group")}</title>
        <meta name="description" content={_("Create a group")} />
      </Helmet>
      <Header name={_("Create a group")} fixed={true} />
      <div className="groups-create">
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
              name: target.target.value,
              slug: slugify(target.target.value)
            });
          }}
        />
        <FormSlug
          label={`${_("Slug")}*:`}
          type="text-break"
          name="slug"
          required={true}
          value={formData.slug}
          errors={formErrors.slug}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              slug: target.value
            });
          }}
        />
        <FormRichEditor
          label={`${_("Description")}*:`}
          name="description"
          value={formData.description}
          errors={formErrors.description}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              description: target.value
            })
          }
        />
        <FormFilesUpload
          label={`${_("Image")}:`}
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
        <hr />
        <FormSelect
          label={`${_("Theme")}*:`}
          name="relationship_theme"
          isClearable={true}
          options={COMMUNITY_THEMES}
          errors={formErrors.relationship_theme}
          value={formData.relationship_theme}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              relationship_theme: target.value
            })
          }
        />
        <FormSelect
          label={`${_("Type")}*:`}
          name="group_type"
          isClearable={true}
          options={COMMUNITY_TYPES}
          errors={formErrors.group_type}
          value={formData.group_type}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              group_type: target.value
            })
          }
        />
        <Button
          className="form-button"
          onClick={() => {
            submitForm({
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
              image:
                formData.image && formData.image.length > 0
                  ? formData.image[0].pk
                  : undefined,
              relationship_theme: formData.relationship_theme
                ? formData.relationship_theme.value
                : undefined,
              group_type: formData.group_type
                ? formData.group_type.value
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

export default GroupCreate;

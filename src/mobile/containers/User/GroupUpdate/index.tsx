import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useGet, useMutate } from "restful-react";
import { useHistory, useParams } from "react-router";
import slugify from "slugify";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "mobile/routes/client";
import FormSelect from "generic/components/Form/FormSelect";
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from "generic/constants";
import Header from "mobile/containers/Header";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import { Button } from "react-bootstrap";
import Loading from "generic/components/Loading";
import FormSlug from "generic/components/Form/FormSlug";
import { handleSuccess, handleErrors } from "utils";

const GroupUpdate: React.SFC<any> = () => {
  const { groupSlug } = useParams();
  const history = useHistory();

  const { data: groupData, loading: groupLoading } = useGet({
    path: SERVER_URLS.GROUP_DETAIL.toPath({
      urlParams: {
        groupSlug
      }
    })
  });

  const [formData, changeFormData] = useState({} as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  useEffect(() => {
    if (!groupData) {
      return;
    }
    const defaultFormData = {
      name: groupData.name || "",
      slug: groupData.slug || "",
      description: groupData.description || "",
      image: groupData.image && groupData.image.pk ? [groupData.image] : [],
      relationship_theme: groupData.relationship_theme || null,
      group_type: groupData.group_type || null
    } as any;
    changeFormData(defaultFormData);
  }, [groupData, changeFormData]);

  const { mutate: submitForm, loading } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.GROUP_UPDATE.toPath({
      urlParams: {
        groupSlug
      }
    })
  });

  if (Object.keys(formData).length === 0) {
    return <Loading />;
  }

  return (
    <div className="container-groups-update">
      <Helmet>
        <title>{_("Update the group")}</title>
        <meta name="description" content={_("Update the group")} />
      </Helmet>
      <Header name={_("Update the group")} fixed={true} />
      <div className="groups-update">
        {(groupLoading || loading) && <Loading />}
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
                handleSuccess(_("Updated successfully."));
                history.push({
                  pathname: CLIENT_URLS.USER.GROUP_DETAIL.buildPath({
                    groupSlug: data.slug
                  })
                });
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

export default GroupUpdate;

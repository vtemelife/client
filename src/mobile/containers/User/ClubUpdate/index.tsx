import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useGet, useMutate } from "restful-react";
import { useHistory, useParams } from "react-router";
import slugify from "slugify";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "mobile/routes/client";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormSelect from "generic/components/Form/FormSelect";
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from "generic/constants";
import Header from "mobile/containers/Header";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import FormMap from "generic/components/Form/FormMap";
import { Button } from "react-bootstrap";
import Loading from "generic/components/Loading";
import FormSlug from "generic/components/Form/FormSlug";
import { handleSuccess, handleErrors } from "utils";

const ClubUpdate: React.SFC<any> = () => {
  const { clubSlug } = useParams();
  const history = useHistory();
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {}
    }
  };

  const { data: clubData, loading: clubLoading } = useGet({
    path: SERVER_URLS.CLUB_DETAIL.toPath({
      urlParams: {
        clubSlug
      }
    })
  });

  const [formData, changeFormData] = useState({} as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  useEffect(() => {
    if (!clubData) {
      return;
    }
    const defaultFormData = {
      name: clubData.name || "",
      slug: clubData.slug || "",
      description: clubData.description || "",
      image: clubData.image && clubData.image.pk ? [clubData.image] : [],
      country:
        clubData.city && clubData.city.country
          ? {
              pk: clubData.city.country.pk,
              name: clubData.city.country.name
            }
          : null,
      region:
        clubData.city && clubData.city.region
          ? {
              pk: clubData.city.region.pk,
              name: clubData.city.region.name
            }
          : null,
      city: clubData.city
        ? {
            pk: clubData.city.pk,
            name: clubData.city.name
          }
        : null,
      relationship_theme: clubData.relationship_theme || null,
      club_type: clubData.club_type || null,
      address: clubData.address || "",
      geo: clubData.geo || null
    } as any;
    changeFormData(defaultFormData);
  }, [clubData, changeFormData]);

  const { mutate: submitForm, loading } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.CLUB_UPDATE.toPath({
      urlParams: {
        clubSlug
      }
    })
  });

  if (Object.keys(formData).length === 0) {
    return <Loading />;
  }

  return (
    <div className="container-clubs-update">
      <Helmet>
        <title>{_("Update the club")}</title>
        <meta name="description" content={_("Update the club")} />
      </Helmet>
      <Header name={_("Update the club")} fixed={true} />
      <div className="clubs-update">
        {(clubLoading || loading) && <Loading />}
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
          name="club_type"
          isClearable={true}
          options={COMMUNITY_TYPES}
          errors={formErrors.club_type}
          value={formData.club_type}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              club_type: target.value
            })
          }
        />
        <hr />
        <FormAsyncSelect
          label={`${_("Country")}*:`}
          placeholder={_("Start typing...")}
          name="city__country"
          errors={formErrors.city}
          value={formData.country}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              country: target.value
            });
          }}
          fetchURL={SERVER_URLS.SELECTS.COUNTRY.toPath()}
        />
        <FormAsyncSelect
          label={`${_("Region/State")}*:`}
          placeholder={_("Start typing...")}
          name="city__region"
          errors={formErrors.city}
          value={formData.region}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              region: target.value
            });
          }}
          fetchURL={SERVER_URLS.SELECTS.REGION.toPath()}
          filterURL={`country=${
            formData.country && formData.country.pk
              ? formData.country.pk
              : user.city.country.pk
          }`}
        />
        <FormAsyncSelect
          label={`${_("City")}*:`}
          placeholder={_("Start typing...")}
          name="city"
          errors={formErrors.city}
          value={formData.city}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              city: target.value
            });
          }}
          fetchURL={SERVER_URLS.SELECTS.CITY.toPath()}
          filterURL={`region=${
            formData.region && formData.region.pk
              ? formData.region.pk
              : user.city.region.pk
          }`}
        />
        <hr />
        <FormRichEditor
          label={`${_("Address")}:`}
          name="address"
          value={formData.address}
          errors={formErrors.address}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              address: target.value
            })
          }
        />
        <FormMap
          label={`${_("Drag and drop the marker on the map")}:`}
          name="geo"
          center={
            user.city && user.city.latitude && user.city.longitude
              ? [user.city.latitude, user.city.longitude]
              : undefined
          }
          errors={formErrors.geo}
          value={formData.geo}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              geo: target.value
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
              city: formData.city ? formData.city.pk : undefined,
              relationship_theme: formData.relationship_theme
                ? formData.relationship_theme.value
                : undefined,
              club_type: formData.club_type
                ? formData.club_type.value
                : undefined,
              address: formData.address,
              geo: formData.geo
            })
              .then((data: any) => {
                handleSuccess(_("Updated successfully."));
                history.push({
                  pathname: CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                    clubSlug: data.slug
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

export default ClubUpdate;

import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useMutate } from "restful-react";
import { useHistory } from "react-router";
import slugify from "slugify";
import { useLocation } from "react-router";
import queryString from "query-string";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
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
import { handleSuccess, handleErrors } from "utils";
import FormSlug from "generic/components/Form/FormSlug";
import FormDatePicker from "generic/components/Form/FormDatePicker";

const PartyCreate: React.SFC<any> = () => {
  const location = useLocation();
  const { club } = queryString.parse(location.search);

  const history = useHistory();
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {}
    }
  };

  const defaultFormData = {
    name: "",
    slug: "",
    description: "",
    short_description: "",
    image: [],
    man_cost: 0,
    woman_cost: 0,
    pair_cost: 0,
    start_date: new Date(),
    end_date: new Date(),
    club: null,
    country:
      user.city && user.city.country
        ? {
            pk: user.city.country.pk,
            name: user.city.country.name
          }
        : null,
    region:
      user.city && user.city.region
        ? {
            pk: user.city.region.pk,
            name: user.city.region.name
          }
        : null,
    city: user.city
      ? {
          pk: user.city.pk,
          name: user.city.name
        }
      : null,
    relationship_theme: null,
    party_type: null,
    address: "",
    geo: null
  } as any;
  const [formData, changeFormData] = useState(defaultFormData);
  const [formErrors, changeFormErrors] = useState({} as any);

  const { mutate: submitForm, loading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.PARTY_CREATE.toPath()
  });

  return (
    <div className="container-parties-create">
      <Helmet>
        <title>{_("Create a party")}</title>
        <meta name="description" content={_("Create a party")} />
      </Helmet>
      <Header name={_("Create a party")} fixed={true} />
      <div className="parties-create">
        {loading && <Loading />}
        {!club && (
          <FormAsyncSelect
            label={`${_("Club")}*:`}
            placeholder={_("Start typing...")}
            name="object_id"
            errors={formErrors.club}
            value={formData.club}
            onChange={(target: any) => {
              changeFormData({
                ...formData,
                club: target.value
              });
            }}
            fetchURL={SERVER_URLS.SELECTS.CLUBS.toPath()}
          />
        )}
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
          label={`${_("Short description (in list)")}*:`}
          name="short_description"
          required={true}
          value={formData.short_description}
          errors={formErrors.short_description}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              short_description: target.value
            })
          }
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
          name="party_type"
          isClearable={true}
          options={COMMUNITY_TYPES}
          errors={formErrors.party_type}
          value={formData.party_type}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              party_type: target.value
            })
          }
        />
        <hr />
        <FormInput
          label={`${_("Price M")}:`}
          type="number"
          name="man_cost"
          errors={formErrors.man_cost}
          value={formData.man_cost}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              man_cost: target.target.value
            })
          }
        />
        <FormInput
          label={`${_("Price W")}:`}
          type="number"
          name="woman_cost"
          errors={formErrors.woman_cost}
          value={formData.woman_cost}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              woman_cost: target.target.value
            })
          }
        />
        <FormInput
          label={`${_("Price Couple")}:`}
          type="number"
          name="pair_cost"
          errors={formErrors.pair_cost}
          value={formData.pair_cost}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              pair_cost: target.target.value
            })
          }
        />
        <hr />
        <FormDatePicker
          showTimeSelect={true}
          dateFormat="Pp"
          label={`${_("Start Date")}*:`}
          name="start_date"
          errors={formErrors.start_date}
          value={formData.start_date}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              start_date: target
            })
          }
        />
        <FormDatePicker
          showTimeSelect={true}
          dateFormat="Pp"
          label={`${_("End Date")}*:`}
          name="end_date"
          errors={formErrors.end_date}
          value={formData.end_date}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              end_date: target
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
          label={`${_("Address")}*:`}
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
              club: club || (formData.club ? formData.club.pk : undefined),
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
              short_description: formData.short_description,
              image:
                formData.image && formData.image.length > 0
                  ? formData.image[0].pk
                  : undefined,
              start_date: formData.start_date,
              end_date: formData.end_date,
              man_cost: formData.man_cost,
              woman_cost: formData.woman_cost,
              pair_cost: formData.pair_cost,
              city: formData.city ? formData.city.pk : undefined,
              theme: formData.relationship_theme
                ? formData.relationship_theme.value
                : undefined,
              party_type: formData.party_type
                ? formData.party_type.value
                : undefined,
              address: formData.address,
              geo: formData.geo
            })
              .then((data: any) => {
                handleSuccess(
                  _(
                    "Your request has been sent to moderators. Waiting moderators for approving."
                  )
                );
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

export default PartyCreate;

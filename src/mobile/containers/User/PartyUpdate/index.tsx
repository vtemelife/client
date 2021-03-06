import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGet, useMutate } from 'restful-react';
import { useHistory, useParams } from 'react-router';
import slugify from 'slugify';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'mobile/routes/client';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import FormAsyncSelect from 'generic/components/Form/FormAsyncSelect';
import FormSelect from 'generic/components/Form/FormSelect';
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from 'generic/constants';
import Header from 'mobile/containers/Header';
import FormInput from 'generic/components/Form/FormInput';
import FormRichEditor from 'generic/components/Form/FormRichEditor';
import FormFilesUpload from 'generic/components/Form/FormFilesUpload';
import FormMap from 'generic/components/Form/FormMap';
import { Button } from 'react-bootstrap';
import Loading from 'generic/components/Loading';
import { handleSuccess, handleErrors } from 'utils';
import FormSlug from 'generic/components/Form/FormSlug';
import FormDatePicker from 'generic/components/Form/FormDatePicker';

const PartyUpdate: React.SFC<any> = () => {
  const { partySlug } = useParams();
  const history = useHistory();
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {},
    },
  };

  const { data: partyData, loading: partyLoading } = useGet({
    path: SERVER_URLS.PARTY_DETAIL.buildPath({
      partySlug,
    }),
  });

  const [formData, changeFormData] = useState({} as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  useEffect(() => {
    if (!partyData) {
      return;
    }
    const defaultFormData = {
      name: partyData.name || '',
      slug: partyData.slug || '',
      description: partyData.description || '',
      short_description: partyData.short_description || '',
      image: partyData.image && partyData.image.pk ? [partyData.image] : [],
      man_cost: partyData.man_cost || 0,
      woman_cost: partyData.woman_cost || 0,
      pair_cost: partyData.pair_cost || 0,
      start_date: partyData.start_date ? new Date(partyData.start_date) : '',
      end_date: partyData.end_date ? new Date(partyData.end_date) : '',
      country:
        partyData.city && partyData.city.country
          ? {
              pk: partyData.city.country.pk,
              name: partyData.city.country.name,
            }
          : null,
      region:
        partyData.city && partyData.city.region
          ? {
              pk: partyData.city.region.pk,
              name: partyData.city.region.name,
            }
          : null,
      city: partyData.city
        ? {
            pk: partyData.city.pk,
            name: partyData.city.name,
          }
        : null,
      relationship_theme: partyData.theme || null,
      party_type: partyData.party_type || null,
      address: partyData.address || '',
      geo: partyData.geo || null,
    } as any;
    changeFormData(defaultFormData);
  }, [partyData, changeFormData]);

  const { mutate: submitForm, loading } = useMutate({
    verb: 'PATCH',
    path: SERVER_URLS.PARTY_UPDATE.buildPath({
      partySlug,
    }),
  });

  if (Object.keys(formData).length === 0) {
    return <Loading />;
  }

  return (
    <div className="container-parties-update">
      <Helmet>
        <title>{_('Update the party')}</title>
        <meta name="description" content={_('Update the party')} />
      </Helmet>
      <Header name={_('Update the party')} fixed={true} />
      <div className="parties-update">
        {(partyLoading || loading) && <Loading />}
        <FormInput
          label={`${_('Name')}*:`}
          type="text-break"
          name="name"
          required={true}
          value={formData.name}
          errors={formErrors.name}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              name: target.target.value,
              slug: slugify(target.target.value),
            });
          }}
        />
        <FormSlug
          label={`${_('Slug')}*:`}
          type="text-break"
          name="slug"
          required={true}
          value={formData.slug}
          errors={formErrors.slug}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              slug: target.value,
            });
          }}
        />
        <FormRichEditor
          label={`${_('Short description (in list)')}*:`}
          name="short_description"
          required={true}
          value={formData.short_description}
          errors={formErrors.short_description}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              short_description: target.value,
            })
          }
        />
        <FormRichEditor
          label={`${_('Description')}*:`}
          name="description"
          value={formData.description}
          errors={formErrors.description}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              description: target.value,
            })
          }
        />
        <FormFilesUpload
          label={`${_('Image')}:`}
          multiple={false}
          name="image"
          description={_('Click here to choose your image')}
          errors={formErrors.image}
          value={formData.image}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              image: target.value,
            })
          }
        />
        <hr />
        <FormSelect
          label={`${_('Theme')}*:`}
          name="relationship_theme"
          isClearable={true}
          options={COMMUNITY_THEMES}
          errors={formErrors.relationship_theme}
          value={formData.relationship_theme}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              relationship_theme: target.value,
            })
          }
        />
        <FormSelect
          label={`${_('Type')}*:`}
          name="party_type"
          isClearable={true}
          options={COMMUNITY_TYPES}
          errors={formErrors.party_type}
          value={formData.party_type}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              party_type: target.value,
            })
          }
        />
        <hr />
        <FormInput
          label={`${_('Price M')}:`}
          type="number"
          name="man_cost"
          errors={formErrors.man_cost}
          value={formData.man_cost}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              man_cost: target.target.value,
            })
          }
        />
        <FormInput
          label={`${_('Price W')}:`}
          type="number"
          name="woman_cost"
          errors={formErrors.woman_cost}
          value={formData.woman_cost}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              woman_cost: target.target.value,
            })
          }
        />
        <FormInput
          label={`${_('Price Couple')}:`}
          type="number"
          name="pair_cost"
          errors={formErrors.pair_cost}
          value={formData.pair_cost}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              pair_cost: target.target.value,
            })
          }
        />
        <hr />
        <FormDatePicker
          showTimeSelect={true}
          dateFormat="Pp"
          label={`${_('Start Date')}*:`}
          name="start_date"
          errors={formErrors.start_date}
          value={formData.start_date}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              start_date: target,
            })
          }
        />
        <FormDatePicker
          showTimeSelect={true}
          dateFormat="Pp"
          label={`${_('End Date')}*:`}
          name="end_date"
          errors={formErrors.end_date}
          value={formData.end_date}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              end_date: target,
            })
          }
        />
        <hr />
        <FormAsyncSelect
          label={`${_('Country')}*:`}
          placeholder={_('Start typing...')}
          name="city__country"
          errors={formErrors.city}
          value={formData.country}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              country: target.value,
            });
          }}
          fetchURL={SERVER_URLS.SELECTS.COUNTRY.buildPath()}
        />
        <FormAsyncSelect
          label={`${_('Region/State')}*:`}
          placeholder={_('Start typing...')}
          name="city__region"
          errors={formErrors.city}
          value={formData.region}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              region: target.value,
            });
          }}
          fetchURL={SERVER_URLS.SELECTS.REGION.buildPath()}
          filterURL={`country=${
            formData.country && formData.country.pk
              ? formData.country.pk
              : user.city.country.pk
          }`}
        />
        <FormAsyncSelect
          label={`${_('City')}*:`}
          placeholder={_('Start typing...')}
          name="city"
          errors={formErrors.city}
          value={formData.city}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              city: target.value,
            });
          }}
          fetchURL={SERVER_URLS.SELECTS.CITY.buildPath()}
          filterURL={`region=${
            formData.region && formData.region.pk
              ? formData.region.pk
              : user.city.region.pk
          }`}
        />
        <hr />
        <FormRichEditor
          label={`${_('Address')}*:`}
          name="address"
          value={formData.address}
          errors={formErrors.address}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              address: target.value,
            })
          }
        />
        <FormMap
          label={`${_('Drag and drop the marker on the map')}:`}
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
              geo: target.value,
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
              geo: formData.geo,
            })
              .then((data: any) => {
                handleSuccess(_('Updated successfully.'));
                history.push({
                  pathname: CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
                    partySlug: data.slug,
                  }),
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

export default PartyUpdate;

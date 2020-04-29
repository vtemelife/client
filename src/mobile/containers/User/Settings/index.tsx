import React, { useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router';
import { Button, Modal, ListGroup } from 'react-bootstrap';
import { useGet, useMutate } from 'restful-react';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';

import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import Loading from 'generic/components/Loading';
import FormFilesUpload from 'generic/components/Form/FormFilesUpload';
import FormInput from 'generic/components/Form/FormInput';
import FormSlug from 'generic/components/Form/FormSlug';
import FormAsyncSelect from 'generic/components/Form/FormAsyncSelect';
import FormRichEditor from 'generic/components/Form/FormRichEditor';
import FormInputArray from 'generic/components/Form/FormInputArray';
import FormCheckBoxes from 'generic/components/Form/FormCheckBoxes';
import {
  USER_THEMES,
  USER_GENDER,
  USER_GENDER_FAMILY,
  USER_GENDER_MW,
  USER_GENDER_M,
  USER_GENDER_MM,
  USER_GENDER_WW,
  USER_GENDER_TRANS,
  USER_GENDER_W,
} from 'generic/constants';
import { getUserFormats } from 'desktop/containers/User/Profile/utils';
import Header from 'mobile/containers/Header';
import { handleSuccess, handleErrors } from 'utils';
import DeleteItem from 'mobile/components/DeleteItem';
import { CLIENT_URLS } from 'desktop/routes/client';

const MENU_PAGE_PROFILE = 'profile';
const MENU_PAGE_PASSWORD = 'password';

const Settings: React.SFC<any> = () => {
  const history = useHistory();
  const [showMenu, toggleShowMenu] = useState(false);
  const [menuPage, changeMenuPage] = useState(MENU_PAGE_PROFILE);
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {},
    },
  };

  const [formData, changeFormData] = useState({} as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  const { data: userData, loading: userLoading } = useGet({
    path: SERVER_URLS.PROFILE.buildPath({
      userSlug: user.slug,
    }),
  });

  useEffect(() => {
    if (!userData) {
      return;
    }
    const defaultFormData = {
      email: userData.email || '',
      slug: userData.slug || '',
      name: userData.name || '',
      gender: userData.gender ? userData.gender.value : null,
      birthday: userData.birthday || null,
      birthday_second: userData.birthday_second || null,
      phone: userData.phone || '',
      skype: userData.skype || '',
      about: userData.about || '',
      relationship_themes: userData.relationship_themes
        ? userData.relationship_themes.map((u: any) => u.value)
        : [],
      relationship_formats: userData.relationship_formats
        ? userData.relationship_formats.map((u: any) => u.value)
        : [],
      social_links: userData.social_links || [],
      avatar: userData.avatar && userData.avatar.pk ? [userData.avatar] : [],
      country:
        userData.city && userData.city.country
          ? {
              pk: userData.city.country.pk,
              name: userData.city.country.name,
            }
          : null,
      region:
        userData.city && userData.city.region
          ? {
              pk: userData.city.region.pk,
              name: userData.city.region.name,
            }
          : null,
      city: userData.city
        ? {
            pk: userData.city.pk,
            name: userData.city.name,
          }
        : null,
    } as any;
    changeFormData(defaultFormData);
  }, [userData, changeFormData]);

  const { mutate: submitProfileForm, loading: loadingProfile } = useMutate({
    verb: 'PATCH',
    path: SERVER_URLS.PROFILE_UPDATE.buildPath({
      userSlug: user.slug,
    }),
  });

  const { mutate: submitPasswordForm, loading: loadingPassword } = useMutate({
    verb: 'PATCH',
    path: SERVER_URLS.PROFILE_PASSWORD.buildPath({
      userSlug: user.slug,
    }),
  });

  const { mutate: serverSignOut } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.SIGN_OUT.buildPath(),
  });

  const signOut = () => {
    serverSignOut({}).then((result: any) => {
      history.push({
        pathname: CLIENT_URLS.AUTH.SIGN_IN.buildPath(),
      });
      userAuth.refetchHeaderUser();
    });
  };

  const userFormats = getUserFormats(
    formData.gender,
    formData.relationship_themes,
  );

  if (Object.keys(formData).length === 0) {
    return <Loading />;
  }
  return (
    <div className="container-settings">
      <Helmet>
        <title>{_('Settings')}</title>
        <meta name="description" content={_('Settings')} />
      </Helmet>
      <Header name={_('Settings')} fixed={true}>
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
      </Header>
      {menuPage === MENU_PAGE_PROFILE && (
        <div className="settings">
          {(userLoading || loadingProfile || loadingPassword) && <Loading />}
          <FormInput
            label={`${_('Email')}*:`}
            type="email"
            help={_('Users will not see your email.')}
            name="email"
            required={true}
            value={formData.email || ''}
            errors={formErrors.email}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                email: target.target.value,
              })
            }
          />
          <FormSlug
            label={`${_('Slug')}*:`}
            type="text-break"
            name="slug"
            required={true}
            value={formData.slug}
            errors={formErrors.slug}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                slug: target.value,
              })
            }
          />
          <FormInput
            label={`${_('Nick')}*:`}
            type="text-break"
            name="name"
            required={true}
            value={formData.name}
            errors={formErrors.name}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                name: target.target.value,
              })
            }
          />
          <hr />
          <FormFilesUpload
            label={`${_('Avatar')}:`}
            multiple={false}
            name="avatar"
            description={_('Click here and choose an avatar')}
            value={formData.avatar}
            errors={formErrors.avatar}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                avatar: target.value,
              })
            }
          />
          <FormInput
            label={`${_('Phone')}:`}
            type="text"
            name="phone"
            required={false}
            value={formData.phone}
            errors={formErrors.phone}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                phone: target.target.value,
              })
            }
          />
          <FormInput
            label={`${_('Skype')}:`}
            type="text"
            name="skype"
            required={false}
            value={formData.skype}
            errors={formErrors.skype}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                skype: target.target.value,
              })
            }
          />
          <hr />
          <FormCheckBoxes
            type="radio"
            name="gender"
            label={`${_('Gender')}*:`}
            checkboxes={USER_GENDER}
            value={formData.gender}
            errors={formErrors.gender}
            onChange={(target: any) => {
              const el = target.target;
              changeFormData({
                ...formData,
                gender: el.id,
              });
            }}
          />
          {(formData.gender === USER_GENDER_FAMILY ||
            formData.gender === USER_GENDER_MW ||
            formData.gender === USER_GENDER_M ||
            formData.gender === USER_GENDER_MM ||
            formData.gender === USER_GENDER_WW ||
            formData.gender === USER_GENDER_TRANS) && (
            <FormInput
              type="number"
              min="1940"
              label={
                formData.gender === USER_GENDER_FAMILY ||
                formData.gender === USER_GENDER_MW ||
                formData.gender === USER_GENDER_M ||
                formData.gender === USER_GENDER_MM
                  ? `${_('Birthday M')}*:`
                  : formData.gender === USER_GENDER_WW
                  ? `${_('Birthday W')}*:`
                  : `${_('Birthday')}*:`
              }
              placeholder={_('Birthday 1980')}
              required={true}
              name="birthday"
              value={formData.birthday}
              errors={formErrors.birthday}
              onChange={(target: any) =>
                changeFormData({
                  ...formData,
                  birthday: target.target.value,
                })
              }
            />
          )}
          {(formData.gender === USER_GENDER_FAMILY ||
            formData.gender === USER_GENDER_MW ||
            formData.gender === USER_GENDER_W ||
            formData.gender === USER_GENDER_MM ||
            formData.gender === USER_GENDER_WW) && (
            <FormInput
              type="number"
              min="1940"
              label={
                formData.gender === USER_GENDER_FAMILY ||
                formData.gender === USER_GENDER_MW ||
                formData.gender === USER_GENDER_W ||
                formData.gender === USER_GENDER_WW
                  ? `${_('Birthday W')}*:`
                  : formData.gender === USER_GENDER_MM
                  ? `${_('Birthday M')}*:`
                  : `${_('Birthday')}*:`
              }
              placeholder={_('Birthday 1980')}
              required={true}
              name="birthday_second"
              value={formData.birthday_second}
              errors={formErrors.birthday_second}
              onChange={(target: any) =>
                changeFormData({
                  ...formData,
                  birthday_second: target.target.value,
                })
              }
            />
          )}
          <FormCheckBoxes
            type="checkbox"
            name="relationship_themes"
            label={`${_('Theme')}*:`}
            checkboxes={USER_THEMES}
            value={formData.relationship_themes}
            errors={formErrors.relationship_themes}
            onChange={(target: any) => {
              const el = target.target;
              const newValues = el.checked
                ? [...formData.relationship_themes, el.id]
                : formData.relationship_themes.filter(
                    (i: string) => i !== el.id,
                  );
              changeFormData({
                ...formData,
                relationship_themes: newValues as any,
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="relationship_formats"
            label={`${_('Format')}*:`}
            checkboxes={userFormats}
            value={formData.relationship_formats}
            errors={formErrors.relationship_formats}
            onChange={(target: any) => {
              const el = target.target;
              const newValues = el.checked
                ? [...formData.relationship_formats, el.id]
                : formData.relationship_formats.filter(
                    (i: string) => i !== el.id,
                  );
              changeFormData({
                ...formData,
                relationship_formats: newValues as any,
              });
            }}
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
          <FormInputArray
            label={`${_('Users can find me here (social links)')}:`}
            name="social_links"
            value={formData.social_links}
            errors={formErrors.social_links}
            onChange={(target: any) => {
              changeFormData({
                ...formData,
                social_links: target,
              });
            }}
          />
          <hr />
          <FormRichEditor
            label={`${_('About me')}:`}
            name="about"
            required={true}
            value={formData.about}
            errors={formErrors.about}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                about: target.value,
              })
            }
          />
          <Button
            className="form-button"
            onClick={() => {
              submitProfileForm({
                email: formData.email,
                slug: formData.slug,
                name: formData.name,
                avatar:
                  formData.avatar && formData.avatar.length > 0
                    ? formData.avatar[0].pk
                    : undefined,
                skype: formData.skype,
                phone: formData.phone,
                about: formData.about,
                gender: formData.gender,
                birthday: formData.birthday,
                birthday_second: formData.birthday_second,
                relationship_themes: formData.relationship_themes,
                relationship_formats: formData.relationship_formats,
                city: formData.city ? formData.city.pk : undefined,
                social_links: formData.social_links,
              })
                .then((data: any) => {
                  handleSuccess(_('Updated successfully.'));
                  changeFormErrors({});
                  userAuth.refetchHeaderUser();
                  history.push(
                    CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: data.slug,
                    }),
                  );
                })
                .catch((errors: any) => {
                  handleErrors(errors, changeFormErrors);
                });
            }}
          >
            <i className="fa fa-save fa-lg" />
          </Button>
        </div>
      )}
      {menuPage === MENU_PAGE_PASSWORD && (
        <div className="settings">
          <FormInput
            label={`${_('New password')}*:`}
            type="password"
            name="new_password"
            value={formData.new_password}
            errors={formErrors.new_password}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                new_password: target.target.value,
              })
            }
          />
          <FormInput
            label={`${_('Repeat new password')}*:`}
            type="password"
            name="repeat_new_password"
            value={formData.repeat_new_password}
            errors={formErrors.repeat_new_password}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                repeat_new_password: target.target.value,
              })
            }
          />
          <Button
            className="form-button"
            onClick={() => {
              submitPasswordForm({
                new_password: formData.new_password || '',
                repeat_new_password: formData.repeat_new_password || '',
              })
                .then((data: any) => {
                  handleSuccess(_('Updated successfully.'));
                  changeFormErrors({});
                  userAuth.refetchHeaderUser();
                })
                .catch((errors: any) => {
                  handleErrors(errors, changeFormErrors);
                });
            }}
          >
            <i className="fa fa-save fa-lg" />
          </Button>
        </div>
      )}
      <Modal size="lg" show={showMenu} onHide={() => toggleShowMenu(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-bars" /> {_('Menu')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item
              onClick={() => {
                changeMenuPage(MENU_PAGE_PROFILE);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-user" /> {_('Profile')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeMenuPage(MENU_PAGE_PASSWORD);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-eye-slash" /> {_('Change password')}
            </ListGroup.Item>
            <ListGroup.Item>
              <DeleteItem
                description={_('Are you sure you want to delete your profile?')}
                onSuccess={() => {
                  signOut();
                }}
                path={SERVER_URLS.PROFILE_DELETE.buildPath({
                  userSlug: user.slug,
                })}
              >
                <i className="fa fa-trash fa-lg" />{' '}
                <span className="menu-item">{_('Delete your profile')}</span>
              </DeleteItem>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Settings;

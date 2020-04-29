import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutate, useGet } from 'restful-react';
import { useHistory, useParams } from 'react-router';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import Header from 'mobile/containers/Header';
import FormInput from 'generic/components/Form/FormInput';
import { Button } from 'react-bootstrap';
import Loading from 'generic/components/Loading';
import { handleSuccess, handleErrors } from 'utils';
import FormSelect from 'generic/components/Form/FormSelect';
import { PERMISSIONS } from 'generic/constants';

const MediaFolderUpdate: React.SFC<any> = () => {
  const history = useHistory();
  const { mediaFolderPk } = useParams();

  const [formData, changeFormData] = useState({} as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  const { mutate: submitForm, loading } = useMutate({
    verb: 'PATCH',
    path: SERVER_URLS.MEDIA_FOLDER_UPDATE.buildPath({
      mediaFolderPk,
    }),
  });

  const { data: mediaFolderData, loading: mediaFolderLoading } = useGet({
    path: SERVER_URLS.MEDIA_FOLDER_DETAIL.buildPath({
      mediaFolderPk,
    }),
  });

  useEffect(() => {
    if (!mediaFolderData) {
      return;
    }
    const defaultFormData = {
      name: mediaFolderData.name || '',
      show_media: mediaFolderData.show_media || null,
    } as any;
    changeFormData(defaultFormData);
  }, [mediaFolderData, changeFormData]);

  if (Object.keys(formData).length === 0) {
    return <Loading />;
  }

  return (
    <div className="container-media-folders-update">
      <Helmet>
        <title>{_('Update the media folder')}</title>
        <meta name="description" content={_('Update the media folder')} />
      </Helmet>
      <Header name={_('Update the media folder')} fixed={true} />
      <div className="media-folders-update">
        {(mediaFolderLoading || loading) && <Loading />}
        <FormInput
          label={`${_('Name')}:`}
          type="text-break"
          name="name"
          required={true}
          value={formData.name}
          errors={formErrors.name}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              name: target.target.value,
            });
          }}
        />
        <FormSelect
          label={`${_('Access')}*:`}
          required={true}
          name="show_media"
          options={PERMISSIONS}
          value={formData.show_media}
          errors={formErrors.show_media}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              show_media: target.value,
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
                : undefined,
            })
              .then((data: any) => {
                handleSuccess(_('Updated successfully.'));
                history.goBack();
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

export default MediaFolderUpdate;

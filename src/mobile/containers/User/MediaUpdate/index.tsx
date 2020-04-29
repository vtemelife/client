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
import FormRichEditor from 'generic/components/Form/FormRichEditor';
import { MEDIA_TYPE_VIDEO } from 'generic/constants';

const MediaUpdate: React.SFC<any> = () => {
  const history = useHistory();
  const { mediaPk } = useParams();

  const [formData, changeFormData] = useState({} as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  const { mutate: submitForm, loading } = useMutate({
    verb: 'PATCH',
    path: SERVER_URLS.MEDIA_UPDATE.buildPath({
      mediaPk,
    }),
  });

  const { data: mediaData, loading: mediaLoading } = useGet({
    path: SERVER_URLS.MEDIA_DETAIL.buildPath({
      mediaPk,
    }),
  });

  useEffect(() => {
    if (!mediaData) {
      return;
    }
    const defaultFormData = {
      media_type: mediaData.media_type || null,
      video_code: mediaData.video_code || '',
      title: mediaData.title || '',
      description: mediaData.description || '',
      hash_tags: mediaData.hash_tags
        .map((item: string) => `#${item}`)
        .join(' '),
    } as any;
    changeFormData(defaultFormData);
  }, [mediaData, changeFormData]);

  if (Object.keys(formData).length === 0) {
    return <Loading />;
  }

  return (
    <div className="container-media-update">
      <Helmet>
        <title>{_('Update the media')}</title>
        <meta name="description" content={_('Update the media')} />
      </Helmet>
      <Header name={_('Update the media')} fixed={true} />
      <div className="media-update">
        {(mediaLoading || loading) && <Loading />}
        {formData.media_type && formData.media_type === MEDIA_TYPE_VIDEO && (
          <FormInput
            label={`${_('Video embed code')}*:`}
            type="text-break"
            name="video_code"
            placeholder={_('Copy and paste video embed code here')}
            errors={formErrors.video_code}
            value={formData.video_code}
            onChange={(target: any) =>
              changeFormData({
                ...formData,
                video_code: target.target.value,
              })
            }
          />
        )}
        <FormInput
          label={`${_('Title')}:`}
          type="text-break"
          name="title"
          required={true}
          value={formData.title}
          errors={formErrors.title}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              title: target.target.value,
            });
          }}
        />
        <FormRichEditor
          label={`${_('Description')}:`}
          name="description"
          required={true}
          value={formData.description}
          errors={formErrors.description}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              description: target.value,
            })
          }
        />
        <FormInput
          label={`${_('Hash tags')}:`}
          type="text-break"
          name="hash_tags"
          value={formData.hash_tags}
          errors={formErrors.hash_tags}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              hash_tags: target.target.value,
            })
          }
        />
        <Button
          className="form-button"
          onClick={() => {
            submitForm({
              video_code: formData.video_code,
              title: formData.title,
              description: formData.description,
              hash_tags: formData.hash_tags
                .split('#')
                .map((el: string) => el.trim())
                .filter((el: string) => el.length > 0),
            })
              .then((data: any) => {
                handleSuccess(_('Created successfully.'));
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

export default MediaUpdate;

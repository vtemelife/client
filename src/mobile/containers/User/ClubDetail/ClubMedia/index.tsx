import React from 'react';
import { useGet } from 'restful-react';
import { Button } from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';
import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import Loading from 'generic/components/Loading';
import { Link } from 'react-router-dom';
import { CLIENT_URLS } from 'desktop/routes/client';
import { ROLE_MODERATOR } from 'generic/constants';
import ImageGallery from 'generic/components/ImageGallery';

const ProfileMedia: React.SFC<any> = ({ club, user }) => {
  const { data: mediaData, loading: mediaLoading, refetch } = useGet({
    path: SERVER_URLS.MEDIA.buildPath({
      queryParams: {
        limit: 10,
        offset: 0,
        object_id: club.pk,
        content_type: 'clubs:club',
        media_type: 'photo',
      },
    }),
  });
  const mediaItems = (mediaData || {}).results || [];

  const isModerator = (item: any) => {
    return (
      item.moderators.map((m: any) => m.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR
    );
  };
  return (
    <div className="club-media block">
      <h2>
        {_('Media')} (
        <Link
          to={CLIENT_URLS.MEDIA.buildPath({
            queryParams: {
              objectId: club.pk,
              contentType: 'clubs:club',
            },
          })}
        >
          {_('All')}
        </Link>
        )
      </h2>
      {mediaLoading && <Loading />}
      {isModerator(club) && (
        <LinkContainer
          to={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_CREATE.buildPath({
            queryParams: {
              objectId: club.pk,
              contentType: 'clubs:club',
            },
          })}
        >
          <Button size="sm">
            <i className="fa fa-plus" /> {_('Create a media')}
          </Button>
        </LinkContainer>
      )}
      {!isModerator(club) && mediaItems.length === 0 && (
        <span className="empty-value">--</span>
      )}
      <div className="media-folder-items">
        <ImageGallery
          mediaItems={mediaItems.slice(0, 5)}
          refetch={refetch}
          size={100}
        />
        <div style={{ clear: 'both' }} />
      </div>
    </div>
  );
};

export default ProfileMedia;

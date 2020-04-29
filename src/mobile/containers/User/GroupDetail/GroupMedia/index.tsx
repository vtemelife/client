import React from "react";
import { useGet } from "restful-react";
import { Button } from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import Loading from "generic/components/Loading";
import { Link } from "react-router-dom";
import { CLIENT_URLS } from "desktop/routes/client";
import { ROLE_MODERATOR } from "generic/constants";
import ImageGallery from "generic/components/ImageGallery";

const ProfileMedia: React.SFC<any> = ({ group, user }) => {
  const { data: mediaData, loading: mediaLoading, refetch } = useGet({
    path: SERVER_URLS.MEDIA.toPath({
      getParams: {
        limit: 10,
        offset: 0,
        object_id: group.pk,
        content_type: "groups:group",
        media_type: "photo"
      }
    })
  });
  const mediaItems = (mediaData || {}).results || [];

  const isModerator = (item: any) => {
    return (
      item.moderators.map((m: any) => m.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR
    );
  };
  return (
    <div className="group-media block">
      <h2>
        {_("Media")} (
        <Link
          to={CLIENT_URLS.MEDIA.toPath({
            getParams: {
              objectId: group.pk,
              contentType: "groups:group"
            }
          })}
        >
          {_("All")}
        </Link>
        )
      </h2>
      {mediaLoading && <Loading />}
      {isModerator(group) && (
        <LinkContainer
          to={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_CREATE.toPath({
            getParams: {
              objectId: group.pk,
              contentType: "groups:group"
            }
          })}
        >
          <Button size="sm">
            <i className="fa fa-plus" /> {_("Create a media")}
          </Button>
        </LinkContainer>
      )}
      {!isModerator(group) && mediaItems.length === 0 && (
        <span className="empty-value">--</span>
      )}
      <div className="media-folder-items">
        <ImageGallery
          mediaItems={mediaItems.slice(0, 5)}
          refetch={refetch}
          size={100}
        />
        <div style={{ clear: "both" }} />
      </div>
    </div>
  );
};

export default ProfileMedia;

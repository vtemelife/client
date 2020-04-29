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

const PartyMedia: React.SFC<any> = ({ party, user }) => {
  const { data: mediaData, loading: mediaLoading, refetch } = useGet({
    path: SERVER_URLS.MEDIA.toPath({
      getParams: {
        limit: 10,
        offset: 0,
        object_id: party.pk,
        content_type: "events:party",
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
    <div className="party-media block">
      <h2>
        {_("Media")} (
        <Link
          to={CLIENT_URLS.MEDIA.toPath({
            getParams: {
              objectId: party.pk,
              contentType: "events:party"
            }
          })}
        >
          {_("All")}
        </Link>
        )
      </h2>
      {mediaLoading && <Loading />}
      {isModerator(party.club) && (
        <LinkContainer
          to={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_CREATE.toPath({
            getParams: {
              objectId: party.pk,
              contentType: "events:party"
            }
          })}
        >
          <Button size="sm">
            <i className="fa fa-plus" /> {_("Create a media")}
          </Button>
        </LinkContainer>
      )}
      {!isModerator(party.club) && mediaItems.length === 0 && (
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

export default PartyMedia;

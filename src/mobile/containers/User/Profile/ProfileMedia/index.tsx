import React from "react";
import { useGet } from "restful-react";
import { Button } from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import Image from "generic/components/Image";
import pictureSVG from "generic/layout/images/picture.svg";
import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import Loading from "generic/components/Loading";
import { Link } from "react-router-dom";
import { CLIENT_URLS } from "desktop/routes/client";

const ProfileMedia: React.SFC<any> = ({ profile, user }) => {
  const { data: mediaFolderData, loading: mediaFolderLoading } = useGet({
    path: SERVER_URLS.MEDIA_FOLDER.toPath({
      getParams: {
        limit: 10,
        offset: 0,
        creator: profile.pk
      }
    })
  });
  const mediaFolderItems = (mediaFolderData || {}).results || [];
  return (
    <div className="profile-media block">
      <h2>
        {_("Media folders")} (
        <Link
          to={CLIENT_URLS.USER.MEDIA_FOLDER_LIST.toPath({
            getParams: {
              parentPk: profile.pk
            }
          })}
        >
          {_("All")}
        </Link>
        )
      </h2>
      {mediaFolderLoading && <Loading />}
      {profile.pk === user.pk && mediaFolderItems.length === 0 && (
        <LinkContainer to={CLIENT_URLS.USER.MEDIA_FOLDER_CREATE.toPath()}>
          <Button size="sm">
            <i className="fa fa-plus" /> {_("Create a media folder")}
          </Button>
        </LinkContainer>
      )}
      {profile.pk !== user.pk && mediaFolderItems.length === 0 && (
        <span className="empty-value">--</span>
      )}
      <div className="media-folder-items">
        {mediaFolderItems.map((item: any, index: number) => (
          <div className="media-folder-item" key={index}>
            <Link
              to={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL.buildPath({
                mediaFolderPk: item.pk
              })}
              key={index}
            >
              {item.media.length === 0 && <Image src={pictureSVG} />}
              {item.media.slice(0, 1).map((image: any) => (
                <Image
                  key={image.pk}
                  src={
                    (image.image && image.image.thumbnail_blur_500x500) ||
                    pictureSVG
                  }
                />
              ))}
            </Link>
            <div className="media-folder-item-footer">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileMedia;

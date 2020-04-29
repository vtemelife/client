import React from "react";
import { useParams } from "react-router";
import { useGet } from "restful-react";

import { SERVER_URLS } from "routes/server";

import MediaFolderDetail from "mobile/containers/User/MediaFolderDetail";
import Loading from "generic/components/Loading";

const MediaFolderMediaDetail: React.SFC<any> = () => {
  const { mediaPk } = useParams();

  const { data: mediaData, loading: mediaLoading } = useGet({
    path: SERVER_URLS.MEDIA_DETAIL.toPath({
      urlParams: {
        mediaPk
      }
    })
  });

  const media = mediaData;

  if (
    mediaLoading ||
    !media ||
    media.content_type !== "media:mediafolder" ||
    !media.object_id
  ) {
    return <Loading />;
  }

  return <MediaFolderDetail folderPk={media.object_id} mediaPk={mediaPk} />;
};

export default MediaFolderMediaDetail;

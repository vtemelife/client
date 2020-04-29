import React from "react";

import VideoItem from "./VideoItem";

const VideoGallery: React.SFC<any> = ({ mediaItems, refetch, openMediaPk }) => {
  if (!mediaItems || mediaItems.length === 0) {
    return null;
  }
  const videos = mediaItems;
  return (
    <div className="container-video-gallery">
      {videos.map((video: any, index: number) => (
        <VideoItem video={video} refetch={refetch} key={video.pk} />
      ))}
    </div>
  );
};

export default VideoGallery;

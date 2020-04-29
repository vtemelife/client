import React from "react";

import Image from "generic/components/Image";
import Video from "generic/components/Video";
import pictureSVG from "generic/layout/images/picture.svg";

interface IProps {
  media: any;
  thumbnail: boolean;
  onClick?: any;
}

class MediaItem extends React.PureComponent<IProps> {
  public render() {
    const media = this.props.media;
    switch (media.media_type) {
      case "photo": {
        if (this.props.thumbnail) {
          return (
            <Image
              className="media-item"
              onClick={this.props.onClick}
              width="100%"
              src={
                media.image && media.image.thumbnail_500x500
                  ? media.image.thumbnail_500x500
                  : pictureSVG
              }
            />
          );
        } else {
          return (
            <Image
              className="media-item"
              onClick={this.props.onClick}
              width="100%"
              src={
                media.image && media.image.image
                  ? media.image.image
                  : pictureSVG
              }
            />
          );
        }
      }
      case "video":
        return (
          <Video
            thumbnail={this.props.thumbnail}
            video_code={media.video_code}
            onClick={this.props.onClick}
          />
        );
      default:
        break;
    }
    return null;
  }
}

export default MediaItem;

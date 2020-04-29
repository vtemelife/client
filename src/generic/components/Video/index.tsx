import React from "react";
import { Image as BaseImage } from "react-bootstrap";

import hideSVG from "generic/layout/images/hide.svg";
import { renderHtml } from "utils";
import { StatesConsumer } from "generic/containers/ContextProviders/StatesService";

class Video extends React.PureComponent<any> {
  public render() {
    if (!this.props.isDisplayImages) {
      const height = this.props.thumbnail ? 300 : 500;
      return (
        <BaseImage
          width="100%"
          height={this.props.height || height}
          src={hideSVG}
        />
      );
    }
    let videoCode = this.props.video_code;
    if (
      videoCode.indexOf("<iframe") === -1 &&
      videoCode.indexOf("<oembed") === -1
    ) {
      videoCode = `<figure class="media"><oembed url="${videoCode}"></oembed></figure>`;
    }

    if (this.props.thumbnail) {
      return (
        <div className="video-item">
          {renderHtml(
            videoCode
              .replace(/width="[0-9]+"/g, `width="100%"`)
              .replace(/height="[0-9]+"/g, `height="300"`)
          )}
          <div className="under-iframe" onClick={this.props.onClick} />
        </div>
      );
    } else {
      return (
        <div className="video-item">
          {renderHtml(
            videoCode
              .replace(/width="[0-9]+"/g, `width="100%"`)
              .replace(
                /height="[0-9]+"/g,
                `height="${this.props.height || 500}"`
              )
          )}
        </div>
      );
    }
  }
}

const VideoWrapper: React.FC<any> = props => (
  <StatesConsumer>
    {contextStates =>
      contextStates && (
        <Video {...props} isDisplayImages={contextStates.isDisplayImages} />
      )
    }
  </StatesConsumer>
);

export default VideoWrapper;

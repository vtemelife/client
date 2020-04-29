import React from "react";
import { Row, Col } from "react-bootstrap";

import Image from "generic/components/Image";
import pictureSVG from "generic/layout/images/picture.svg";

interface IProps {
  mediaFolder: any;
}

class MediaFolderItem extends React.PureComponent<IProps> {
  public render() {
    const mediaFolder = this.props.mediaFolder;
    const len = 4 - mediaFolder.media.length;
    const stubs = [];
    for (let i = 1; i <= len; i++) {
      stubs.push(i);
    }
    return (
      <Row className="media-folder-preview-container">
        {mediaFolder.media.map((media: any, index: number) => (
          <Col
            lg={6}
            md={6}
            sm={6}
            xs={6}
            key={index}
            className="media-folder-preview-container-item"
          >
            {media.image && media.image.thumbnail_blur_500x500 ? (
              <Image width="100%" src={media.image.thumbnail_blur_500x500} />
            ) : (
              <Image width="100%" src={pictureSVG} />
            )}
          </Col>
        ))}
        {stubs.map((media: any, index: number) => (
          <Col
            lg={6}
            md={6}
            sm={6}
            xs={6}
            key={index + 4}
            className="media-folder-preview-container-item"
          >
            <Image width="100%" src={pictureSVG} />
          </Col>
        ))}
      </Row>
    );
  }
}

export default MediaFolderItem;

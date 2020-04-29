import React from "react";
import { Card, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import Likes from "../../Likes";
import MediaItem from "./MediaItem";

interface IProps extends RouteComponentProps {
  media: any;
}

class PreviewMedia extends React.PureComponent<IProps> {
  public render() {
    const media = this.props.media;
    const size = media.media_type === "photo" ? 4 : 12;
    return (
      <Col
        lg={size}
        md={size}
        sm={size}
        xs={12}
        className="media-item-container"
      >
        <Card>
          <Card.Body>
            <MediaItem
              media={media}
              onClick={() =>
                this.props.history.push(
                  CLIENT_URLS.MEDIA_DETAIL.buildPath({ mediaPk: media.pk })
                )
              }
              thumbnail={true}
            />
            <Likes
              likePath={SERVER_URLS.MEDIA_LIKE.buildPath({
                mediaPk: media.pk
              })}
              item={media}
            />
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

export default withRouter(PreviewMedia);

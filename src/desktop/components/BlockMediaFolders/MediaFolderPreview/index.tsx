import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { withRouter, Link } from "react-router-dom";

import { CLIENT_URLS } from "desktop/routes/client";
import MediaFolderItem from "./MediaFolderItem";
import {
  PERMISSION_NO_USERS,
  PERMISSION_ONLY_FRIENDS,
  PERMISSION_ALL_USERS
} from "generic/constants";

interface IProps extends RouteComponentProps {
  mediaFolder: any;
}

class MediaFolderPreview extends React.PureComponent<IProps> {
  public render() {
    const mediaFolder = this.props.mediaFolder;
    let mediaType = null;
    switch (mediaFolder.show_media.value) {
      case PERMISSION_NO_USERS:
        mediaType = <i className="fa fa-eye-slash" />;
        break;
      case PERMISSION_ONLY_FRIENDS:
        mediaType = <i className="fa fa-users" />;
        break;
      case PERMISSION_ALL_USERS:
        mediaType = <i className="fa fa-eye" />;
        break;
      default:
        break;
    }
    return (
      <Col lg={4} md={6} sm={6} xs={6} className="media-folder-item-container">
        <Card>
          <Card.Body>
            <Link
              to={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL.buildPath({
                mediaFolderPk: mediaFolder.pk
              })}
            >
              <MediaFolderItem mediaFolder={mediaFolder} />
            </Link>
          </Card.Body>
          <Card.Footer>
            <Row className="media-folder-item-footer">
              <Col
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="media-folder-item-info"
              >
                <div className="text-ellipsis">
                  {mediaType} {mediaFolder.name}
                </div>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    );
  }
}

export default withRouter(MediaFolderPreview);

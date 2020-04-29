import React from "react";
import { Media, Button, Row, Col, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";

import Image from "generic/components/Image";
import userSVG from "generic/layout/images/user.svg";
import objSVG from "generic/layout/images/picture.svg";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import {
  REQUEST_APPROVED,
  REQUEST_DECLINED,
  REQUEST_WAITING
} from "generic/constants";
import Delete from "desktop/containers/Generics/Delete";
import { _ } from "trans";
import { getGeo } from "desktop/containers/User/Profile/utils";

interface IProps extends RouteComponentProps {
  request: any;
  updateUrl: any;
  onDeleteSuccess: any;
}

class RequestObjectPreview extends React.PureComponent<IProps> {
  public render() {
    const obj = this.props.request.content_object;
    const image = obj.image;
    const name = obj.name || obj.name;
    const online = obj.online;
    // const city = obj.city;

    let detailUrl = null;
    let defaultImage = objSVG;
    let recipients = [obj.pk];
    let roundedCircle = false;
    switch (this.props.request.content_type) {
      case "users:user": {
        detailUrl = CLIENT_URLS.USER.PROFILE.buildPath({ userSlug: obj.slug });
        recipients = [obj.pk];
        defaultImage = userSVG;
        roundedCircle = true;
        break;
      }
      case "groups:group": {
        detailUrl = CLIENT_URLS.USER.GROUP_DETAIL.buildPath({
          groupSlug: obj.slug
        });
        recipients = [obj.pk];
        break;
      }
      case "clubs:club": {
        detailUrl = CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
          clubSlug: obj.slug
        });
        recipients = [obj.pk];
        break;
      }
      default:
        return null;
    }

    return (
      <Col lg={12} md={12} sm={12} className="request-item-container">
        <Media>
          <Link to={detailUrl}>
            {image && image.thumbnail_100x100 ? (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={image.thumbnail_100x100}
                roundedCircle={roundedCircle}
              />
            ) : (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={defaultImage}
                roundedCircle={roundedCircle}
              />
            )}
          </Link>
          <Media.Body>
            <Row className="request-item-data">
              <Col lg={8} md={8} sm={8} xs={8}>
                <Link to={detailUrl}>
                  <span className="text-break">
                    {this.props.request.status === REQUEST_APPROVED && (
                      <i className="fa fa-check" />
                    )}
                    {this.props.request.status === REQUEST_WAITING && (
                      <i className="text-waiting fa fa-clock-o" />
                    )}
                    {this.props.request.status === REQUEST_DECLINED && (
                      <i className="text-error fa fa-ban" />
                    )}{" "}
                    {online ? <i className="fa fa-circle" /> : null} {name}
                  </span>
                </Link>
                <div className="text-break request-item-info">
                  {obj.city && (
                    <p>
                      <span className="title">{_("Geo")}:</span> {getGeo(obj)}
                    </p>
                  )}
                </div>
              </Col>
              <Col lg={4} md={4} sm={4} xs={4} className="request-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  {this.props.request.status !== REQUEST_APPROVED && (
                    <Delete
                      description={_(
                        "Are you sure you want to delete the request?"
                      )}
                      onSuccess={(result: any) =>
                        this.props.onDeleteSuccess(result, recipients)
                      }
                      destoryServerPath={SERVER_URLS.MEMBERSHIP_REQUESTS_DELETE.buildPath(
                        { membershipPk: this.props.request.pk }
                      )}
                    >
                      <Button size="sm" variant="danger">
                        <i className="fa fa-trash" />
                      </Button>
                    </Delete>
                  )}
                </ButtonGroup>
              </Col>
            </Row>
          </Media.Body>
        </Media>
        <hr />
      </Col>
    );
  }
}

export default withRouter(RequestObjectPreview);

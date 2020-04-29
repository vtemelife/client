import React from "react";
import { Media, Button, Row, Col, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import { Mutate } from "restful-react";
import { toast } from "react-toastify";

import Image from "generic/components/Image";
import userSVG from "generic/layout/images/user.svg";
import { CLIENT_URLS } from "desktop/routes/client";
import {
  REQUEST_APPROVED,
  REQUEST_DECLINED,
  REQUEST_WAITING
} from "generic/constants";
import handleErrors from "../../ResponseErrors/utils";
import { _ } from "trans";
import { getGeo } from "desktop/containers/User/Profile/utils";

interface IProps extends RouteComponentProps {
  request: any;
  updateUrl: any;
  onUpdateSuccess: any;
}

class RequestUserPreview extends React.PureComponent<IProps> {
  public render() {
    const user = this.props.request.user;
    return (
      <Col lg={12} md={12} sm={12} className="request-item-container">
        <Media>
          <Link
            to={CLIENT_URLS.USER.PROFILE.buildPath({ userSlug: user.slug })}
          >
            {user.avatar && user.avatar.thumbnail_100x100 ? (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={user.avatar.thumbnail_100x100}
                roundedCircle={true}
              />
            ) : (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={userSVG}
                roundedCircle={true}
              />
            )}
          </Link>
          <Media.Body>
            <Row className="request-item-data">
              <Col lg={8} md={8} sm={8} xs={8}>
                <Link
                  to={CLIENT_URLS.USER.PROFILE.buildPath({
                    userSlug: user.slug
                  })}
                >
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
                    {user.online ? <i className="fa fa-circle" /> : null}{" "}
                    {user.name}
                  </span>
                </Link>
                <div className="text-break request-item-info">
                  <p>
                    <span className="title">{_("Geo")}:</span> {getGeo(user)}
                  </p>
                  <p>
                    <span className="title">{_("Real status")}:</span>{" "}
                    {user.is_real ? (
                      <i className="fa fa-check green-color" />
                    ) : (
                      <i className="fa fa-times-circle red-color" />
                    )}
                  </p>
                </div>
              </Col>
              <Col lg={4} md={4} sm={4} xs={4} className="request-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  {this.props.request.status !== REQUEST_APPROVED && (
                    <Mutate
                      verb="PATCH"
                      path={this.props.updateUrl.buildPath({
                        membershipPk: this.props.request.pk
                      })}
                    >
                      {confirm => (
                        <Button
                          size="sm"
                          onClick={() => {
                            confirm({ status: REQUEST_APPROVED })
                              .then((result: any) => {
                                toast.success(`The request has been approved.`);
                                this.props.onUpdateSuccess(result, [user.pk]);
                              })
                              .catch((errors: any) => {
                                handleErrors(errors);
                              });
                          }}
                        >
                          <i className="fa fa-check" />
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {this.props.request.status === REQUEST_WAITING && (
                    <Mutate
                      verb="PATCH"
                      path={this.props.updateUrl.buildPath({
                        membershipPk: this.props.request.pk
                      })}
                    >
                      {confirm => (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            confirm({ status: REQUEST_DECLINED })
                              .then((result: any) => {
                                toast.success(`The request has been declined.`);
                                this.props.onUpdateSuccess(result, [user.pk]);
                              })
                              .catch((errors: any) => {
                                handleErrors(errors);
                              });
                          }}
                        >
                          <i className="fa fa-ban" />
                        </Button>
                      )}
                    </Mutate>
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

export default withRouter(RequestUserPreview);

import React from "react";
import { Media, Button, Col, Row, ButtonGroup } from "react-bootstrap";
import Moment from "react-moment";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import { renderHtml } from "utils";
import Image from "generic/components/Image";
import pictureSVG from "generic/layout/images/picture.svg";
import { Link } from "react-router-dom";
import Delete from "desktop/containers/Generics/Delete";
import { _ } from "trans";

interface IProps {
  item: any;
  refetch: any;
  history: any;
}

interface IState {
  theme: any;
}

class NewsItem extends React.PureComponent<IProps, IState> {
  public state = {
    theme: {
      value: undefined
    }
  };

  public onDeleteSuccess = () => {
    this.props.refetch();
  };

  public render() {
    const item = this.props.item;
    const locale = localStorage.getItem("locale") || "ru";
    return (
      <Col lg={12} className="news-item-container">
        <Media>
          <Link
            to={CLIENT_URLS.MODERATOR.NEWS_DETAIL.buildPath({
              newsPk: item.pk
            })}
          >
            {item.image && item.image.thumbnail_100x100 ? (
              <Image
                width={100}
                height={100}
                className="mr-3"
                src={item.image.thumbnail_100x100}
              />
            ) : (
              <Image
                width={100}
                height={100}
                className="mr-3"
                src={pictureSVG}
              />
            )}
          </Link>
          <Media.Body>
            <Row className="post-item-data">
              <Col lg={8}>
                <Link
                  to={CLIENT_URLS.MODERATOR.NEWS_DETAIL.buildPath({
                    newsPk: item.pk
                  })}
                >
                  <span className="text-break">{item.title}</span>
                </Link>
                <div className="text-break news-item-info">
                  <Link
                    target="_blank"
                    to={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: item.creator.slug
                    })}
                  >
                    <i className="fa fa-user" /> {item.creator.name}
                  </Link>
                </div>
                {item.publish_date && (
                  <div className="text-break news-item-info">
                    <i className="fa fa-calendar" />{" "}
                    <span>
                      {_("Date of publication")}:{" "}
                      <Moment locale={locale} format="DD.MM.YYYY HH:mm">
                        {item.publish_date}
                      </Moment>
                    </span>
                  </div>
                )}
                {item.end_publish_date && (
                  <div className="text-break news-item-info">
                    <i className="fa fa-calendar" />{" "}
                    <span>
                      {_("End of publication")}:{" "}
                      <Moment locale={locale} format="DD.MM.YYYY HH:mm">
                        {item.end_publish_date}
                      </Moment>
                    </span>
                  </div>
                )}
                {!item.publish_date && (
                  <div className="text-break news-item-info">
                    <i className="fa fa-eye-slash text-error" />{" "}
                    <span>{_("Not published")}</span>
                  </div>
                )}
                <div className="text-break description-item-info">
                  {renderHtml(item.description)}
                </div>
              </Col>
              <Col lg={3}>
                <ButtonGroup vertical={true} className="float-right">
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => {
                      this.props.history.push({
                        pathname: CLIENT_URLS.MODERATOR.NEWS_UPDATE.buildPath({
                          newsPk: item.pk
                        })
                      });
                    }}
                  >
                    <i className="fa fa-pencil" /> {_("Update")}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      this.props.history.push({
                        pathname: CLIENT_URLS.MODERATOR.NEWS_DETAIL.buildPath({
                          newsPk: item.pk
                        })
                      });
                    }}
                  >
                    <i className="fa fa-bars" /> {_("Details")}
                  </Button>
                  <Delete
                    title={_("Are you sure?")}
                    description={_("Are you sure you want to delete the news?")}
                    onSuccess={this.onDeleteSuccess}
                    destoryServerPath={SERVER_URLS.MODERATION_NEWS_DELETE.buildPath(
                      {
                        newsPk: item.pk
                      }
                    )}
                  >
                    <Button variant="danger" size="sm">
                      <i className="fa fa-trash" /> {_("Delete")}
                    </Button>
                  </Delete>
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

export default NewsItem;

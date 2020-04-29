import React from "react";
import { Card, Col, Button, Row } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import Get from "restful-react";
import { LinkContainer } from "react-router-bootstrap";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import Loading from "generic/components/Loading";
import { renderHtml } from "utils";
import ResponseErrors from "desktop/components/ResponseErrors";
import Delete from "desktop/containers/Generics/Delete";
import { _ } from "trans";

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  response: any;
  loading: boolean;
  error: any;
  refetch: any;
}

class News extends React.PureComponent<IProps> {
  public onDeleteSuccess = () => {
    this.props.history.push({
      pathname: CLIENT_URLS.MODERATOR.NEWS_LIST.buildPath()
    });
  };

  public render() {
    const news = this.props.response;
    if (this.props.error) {
      return <ResponseErrors error={this.props.error} />;
    }
    if (!news || this.props.loading) {
      return <Loading />;
    }
    return (
      <Col lg={10} className="news-container">
        <Card>
          <Card.Body>
            <Row className="news-detail-block">
              <Col lg={12} className="title text-break">
                {news.title}
              </Col>
            </Row>
            <Row className="news-detail-block">
              <Delete
                title={_("Are you sure?")}
                description={_("Are you sure you want to delete the news?")}
                onSuccess={this.onDeleteSuccess}
                destoryServerPath={SERVER_URLS.MODERATION_NEWS_DELETE.buildPath(
                  {
                    newsPk: news.pk
                  }
                )}
              >
                <Button variant="danger" size="sm">
                  <i className="fa fa-trash" />
                </Button>
              </Delete>
              &nbsp;
              <LinkContainer
                to={CLIENT_URLS.MODERATOR.NEWS_UPDATE.buildPath({
                  newsPk: news.pk
                })}
              >
                <Button variant="primary" size="sm">
                  <i className="fa fa-pencil" />
                </Button>
              </LinkContainer>
            </Row>
            <hr />
            <div className="description text-break">
              {renderHtml(news.news)}
            </div>
            <div className="clearfix" />
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

const NewsWrapper: React.FC<IPropsWrapper> = props => (
  <Get
    path={SERVER_URLS.MODERATION_NEWS_DETAIL.buildPath({
      newsPk: props.match.params.newsPk
    })}
  >
    {(response, { loading, error }, { refetch }) => (
      <News
        {...props}
        response={response}
        loading={loading}
        error={error}
        refetch={refetch}
      />
    )}
  </Get>
);

export default NewsWrapper;

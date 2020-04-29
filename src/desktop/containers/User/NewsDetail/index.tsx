import React from "react";
import compose from "lodash/flowRight";
import { Card, Col, Row } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import Loading from "generic/components/Loading";
import BlockComments from "desktop/components/BlockComments";
import { renderHtml } from "utils";
import ResponseErrors from "desktop/components/ResponseErrors";
import Likes from "desktop/components/Likes";
import { withRestGet } from "generic/containers/Decorators";

interface IProps extends RouteComponentProps {
  match: any;
  news: any;
}

class NewsItem extends React.PureComponent<IProps> {
  public render() {
    const news = this.props.news.response;
    if (this.props.news.error) {
      return <ResponseErrors error={this.props.news.error} />;
    }
    if (!news || this.props.news.loading) {
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
            <hr />
            <div className="description text-break">
              {renderHtml(news.news)}
            </div>
            <hr />
            {news.hash_tags.length > 0 && (
              <>
                <div className="news-hash-tags">
                  {news.hash_tags.map((hashTag: string, index: number) => (
                    <Link
                      to={{
                        pathname: CLIENT_URLS.USER.NEWS_LIST.buildPath(),
                        search: `?hash_tag=${hashTag}`
                      }}
                      key={index}
                    >
                      {`#${hashTag}`}{" "}
                    </Link>
                  ))}
                </div>
                <hr />
              </>
            )}
            <Likes
              likePath={SERVER_URLS.NEWS_LIKE.buildPath({
                newsPk: news.pk
              })}
              item={news}
            />
          </Card.Body>
        </Card>
        <Row>
          <BlockComments objectId={news.pk} contentType="news:news" size={12} />
        </Row>
      </Col>
    );
  }
}

const withNews = withRestGet({
  propName: "news",
  path: (props: any) =>
    SERVER_URLS.NEWS_DETAIL.buildPath({
      newsPk: props.match.params.newsPk
    })
});

export default compose(withNews)(NewsItem);

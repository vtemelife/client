import React from "react";
import { Media, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { withRouter, Link } from "react-router-dom";
import Moment from "react-moment";

import Image from "generic/components/Image";
import { renderHtml } from "utils";
import pictureSVG from "generic/layout/images/picture.svg";
import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import Likes from "../../Likes";
import {
  TYPE_SITE_NEWS,
  TYPE_MEDIA,
  TYPE_ARTICLES,
  TYPE_WHISPER,
  TYPE_FRIENDS_MEDIA,
  TYPE_FRIENDS_ARTICLE,
  TYPE_FRIENDS_INFO,
  TYPE_GROUPS_MEDIA,
  TYPE_GROUPS_ARTICLE,
  TYPE_CLUBS_MEDIA,
  TYPE_CLUBS_ARTICLE,
  TYPE_CLUBS_EVENTS
} from "generic/constants";
import { getLocale } from "utils";

interface IProps extends RouteComponentProps {
  news: any;
}

class NewsPreview extends React.PureComponent<IProps> {
  public getLink = (news: any) => {
    switch (news.news_type.value) {
      case TYPE_FRIENDS_INFO:
        return CLIENT_URLS.USER.PROFILE.buildPath({
          userSlug: this.props.news.slug
        });
      case TYPE_ARTICLES:
      case TYPE_WHISPER:
      case TYPE_FRIENDS_ARTICLE:
      case TYPE_CLUBS_ARTICLE:
      case TYPE_GROUPS_ARTICLE:
        return CLIENT_URLS.POSTS_DETAIL.buildPath({
          postSlug: this.props.news.slug
        });
      case TYPE_MEDIA:
      case TYPE_FRIENDS_MEDIA:
      case TYPE_CLUBS_MEDIA:
      case TYPE_GROUPS_MEDIA:
        return CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_DETAIL.buildPath({
          mediaPk: this.props.news.object_id
        });
      case TYPE_CLUBS_EVENTS:
        return CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
          partySlug: this.props.news.slug
        });
      case TYPE_SITE_NEWS:
      default:
        return CLIENT_URLS.USER.NEWS_DETAIL.buildPath({
          newsPk: this.props.news.pk
        });
    }
  };

  public getLikesLink = (news: any) => {
    switch (news.news_type.value) {
      case TYPE_ARTICLES:
      case TYPE_WHISPER:
      case TYPE_FRIENDS_ARTICLE:
      case TYPE_CLUBS_ARTICLE:
      case TYPE_GROUPS_ARTICLE:
        return SERVER_URLS.POSTS_LIKE.toPath({
          urlParams: {
            postSlug: news.slug
          }
        });
      case TYPE_MEDIA:
      case TYPE_FRIENDS_MEDIA:
      case TYPE_CLUBS_MEDIA:
      case TYPE_GROUPS_MEDIA:
        return SERVER_URLS.MEDIA_LIKE.toPath({
          urlParams: {
            mediaPk: news.object_id
          }
        });
      case TYPE_CLUBS_EVENTS:
        return SERVER_URLS.PARTY_LIKE.toPath({
          urlParams: {
            partySlug: news.slug
          }
        });
      case TYPE_SITE_NEWS:
        return SERVER_URLS.NEWS_LIKE.toPath({
          urlParams: {
            newsPk: news.pk
          }
        });
      case TYPE_FRIENDS_INFO:
      default:
        return null;
    }
  };

  public renderTitle = (news: any) => {
    switch (news.news_type.value) {
      case TYPE_ARTICLES:
        return (
          <>
            {news.creator.name}{" "}
            {_("has published an article in Articles header section")}
          </>
        );
      case TYPE_WHISPER:
        return (
          <>
            {news.creator.name}{" "}
            {_("has published an article in Whisper header section")}
          </>
        );
      case TYPE_MEDIA:
        return (
          <>
            {news.creator.name}{" "}
            {_("has published a media in Media header section")}
          </>
        );
      case TYPE_FRIENDS_ARTICLE:
        return (
          <>
            {news.creator.name} {_("has published a post")}
          </>
        );
      case TYPE_FRIENDS_MEDIA:
        return (
          <>
            {news.creator.name} {_("has published a media")}
          </>
        );
      case TYPE_FRIENDS_INFO:
        return (
          <>
            {news.creator.name} {_("has changed own profile")}
          </>
        );
      case TYPE_GROUPS_MEDIA:
        return <>{_("New media in the group")}</>;
      case TYPE_GROUPS_ARTICLE:
        return <>{_("New post in the group")}</>;
      case TYPE_CLUBS_MEDIA:
        return <>{_("New media in the club")}</>;
      case TYPE_CLUBS_ARTICLE:
        return <>{_("New post in the club")}</>;
      case TYPE_CLUBS_EVENTS:
        return <>{_("New party in the club")}</>;
      case TYPE_SITE_NEWS:
      default:
        return <Link to={this.getLink(news)}>{news.title}</Link>;
    }
  };

  public render() {
    const news = this.props.news;
    const link = this.getLink(news);
    const locale = getLocale();
    return (
      <Col lg={12} className="newspreview-container">
        <Media>
          <Link to={link}>
            {news.image && news.image.thumbnail_500x500 ? (
              <Image
                width={200}
                height={200}
                className="mr-3"
                src={news.image.thumbnail_500x500}
              />
            ) : (
              <Image
                width={200}
                height={200}
                className="mr-3"
                src={pictureSVG}
              />
            )}
          </Link>
          <Media.Body>
            <div className="title">
              <Link to={link}>{this.renderTitle(news)}</Link>
            </div>
            <div className="info">
              <Link
                to={CLIENT_URLS.USER.PROFILE.buildPath({
                  userSlug: news.creator.slug
                })}
              >
                <i className="fa fa-user" /> {news.creator.name}
              </Link>
            </div>
            <div className="info">
              <i className="fa fa-clock-o" /> {_("Date of publication")}:{" "}
              <Moment locale={locale} format="DD.MM.YYYY HH:mm">
                {news.publish_date}
              </Moment>
            </div>
            <div className="info">
              <i className="fa fa-sitemap" /> {_("Category")}:{" "}
              {news.news_type.display}
            </div>
            <div className="title text-break">
              <Link to={link}>{news.title}</Link>
            </div>
            {news.description && (
              <div className="description text-break">
                {renderHtml(news.description)}
              </div>
            )}
          </Media.Body>
        </Media>
        {this.getLikesLink(news) && (
          <Likes likePath={this.getLikesLink(news) as any} item={news} />
        )}
        <hr />
      </Col>
    );
  }
}

export default withRouter(NewsPreview);

import React from "react";
import { Card, Nav } from "react-bootstrap";
import { RouteComponentProps } from "react-router";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";

import List from "desktop/containers/Generics/List";

import NewsItem from "./NewsItem";
import { _ } from "trans";

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  counters: any;
}

class NewsList extends React.PureComponent<IProps> {
  public renderTitle = (getParams: any) => {
    if (getParams.is_publish === "false") {
      return _("News (not published)");
    }
    if (getParams.is_publish === "true") {
      return _("News (published)");
    }
    return _("news");
  };

  public renderItem = (item: any, getParams: any, refetch: any) => {
    return (
      <NewsItem item={item} refetch={refetch} history={this.props.history} />
    );
  };

  public renderFilters = (getParams: any, onChangeGetParams: any) => {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-filter" /> {_("Filters")}
            </Card.Title>
            <Nav className="flex-column">
              <Nav.Link
                onClick={() =>
                  onChangeGetParams({
                    is_draft: undefined,
                    is_publish: undefined
                  })
                }
              >
                <i className="fa fa-newspaper-o" /> {_("All")}
              </Nav.Link>
              <Nav.Link
                onClick={() => onChangeGetParams({ is_publish: "false" })}
              >
                <i className="fa fa-eye-slash" /> {_("Not published")}
              </Nav.Link>
              <Nav.Link
                onClick={() => onChangeGetParams({ is_publish: "true" })}
              >
                <i className="fa fa-eye" /> {_("Published")}
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>
      </>
    );
  };

  public render() {
    return (
      <List
        listClientPath={CLIENT_URLS.MODERATOR.NEWS_LIST.buildPath()}
        listServerPath={SERVER_URLS.MODERATION_NEWS_LIST}
        createClientPath={CLIENT_URLS.MODERATOR.NEWS_CREATE.buildPath()}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }
}

export default NewsList;

import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import List from 'desktop/containers/Generics/List';
import { SERVER_URLS } from 'routes/server';

import NewsPreview from './NewsPreview';
import { _ } from 'trans';

interface IProps extends RouteComponentProps {
  renderTitle?: any;
  renderHeader?: any;
  renderFilters?: any;
  defaultqueryParams?: any;
  size?: number;
}

class BlockNews extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    return this.props.renderTitle
      ? this.props.renderTitle(queryParams)
      : _('News');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return <NewsPreview news={item} />;
  };

  public render() {
    return (
      <List
        listClientPath={this.props.location.pathname}
        listServerPath={SERVER_URLS.NEWS_LIST}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderHeader={this.props.renderHeader}
        renderFilters={this.props.renderFilters}
        searchLabel="search_news"
        size={this.props.size}
        defaultqueryParams={this.props.defaultqueryParams}
      />
    );
  }
}

export default withRouter(BlockNews);

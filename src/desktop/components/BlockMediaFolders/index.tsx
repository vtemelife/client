import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import List from 'desktop/containers/Generics/List';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';

import MediaFolderPreview from './MediaFolderPreview';
import { _ } from 'trans';

interface IProps extends RouteComponentProps {
  objectId?: string;
  contentType?: string;
  isReadonly?: boolean;
  renderTitle?: any;
  renderFilters?: any;
  renderNoItems?: any;
  defaultqueryParams?: any;
  size?: number;
  maxHeight?: number;
}

class BlockMedia extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    return this.props.renderTitle
      ? this.props.renderTitle(queryParams)
      : _('Media folders');
  };

  public renderItem = (item: any) => {
    return <MediaFolderPreview mediaFolder={item} />;
  };

  public render() {
    return (
      <List
        listClientPath={this.props.location.pathname}
        createClientPath={
          !this.props.isReadonly
            ? CLIENT_URLS.USER.MEDIA_FOLDER_CREATE.buildPath()
            : undefined
        }
        listServerPath={SERVER_URLS.MEDIA_FOLDER}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderNoItems={this.props.renderNoItems}
        renderFilters={this.props.renderFilters}
        disableSearching={true}
        maxHeight={this.props.maxHeight}
        size={this.props.size}
        className="media-folder-block-container"
        defaultqueryParams={
          this.props.defaultqueryParams
            ? { creator: this.props.objectId, ...this.props.defaultqueryParams }
            : { creator: this.props.objectId }
        }
      />
    );
  }
}

export default withRouter(BlockMedia);

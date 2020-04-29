import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import List from "desktop/containers/Generics/List";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";

import MediaPreview from "./MediaPreview";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  objectId?: string;
  contentType?: string;
  isReadonly?: boolean;
  renderTitle?: any;
  renderFilters?: any;
  renderNoItems?: any;
  defaultGetParams?: any;
  size?: number;
}

class BlockMedia extends React.PureComponent<IProps> {
  public renderTitle = (getParams: any) => {
    return this.props.renderTitle
      ? this.props.renderTitle(getParams)
      : _("Media");
  };

  public renderItem = (item: any) => {
    return <MediaPreview media={item} />;
  };

  public render() {
    return (
      <List
        listClientPath={this.props.location.pathname}
        createClientPath={
          !this.props.isReadonly
            ? CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_CREATE.buildPath(
                undefined,
                {
                  getParams: {
                    object_id: this.props.objectId,
                    content_type: this.props.contentType
                  }
                }
              )
            : undefined
        }
        listServerPath={SERVER_URLS.MEDIA}
        contentType={this.props.contentType}
        objectId={this.props.objectId}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.props.renderFilters}
        renderNoItems={this.props.renderNoItems}
        searchLabel="search_media"
        size={this.props.size}
        className="media-block-container"
        defaultGetParams={this.props.defaultGetParams}
      />
    );
  }
}

export default withRouter(BlockMedia);

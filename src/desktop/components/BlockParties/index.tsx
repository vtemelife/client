import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import List from "desktop/containers/Generics/List";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";

import PartyPreview from "./PartyPreview";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  club?: string;
  isReadonly?: boolean;
  renderTitle?: any;
  renderFilters?: any;
  renderNoItems?: any;
  size?: number;
}

class BlockParties extends React.PureComponent<IProps> {
  public renderTitle = (getParams: any) => {
    return this.props.renderTitle
      ? this.props.renderTitle(getParams)
      : _("Parties");
  };

  public renderItem = (item: any, getParams: any, refetch: any) => {
    return <PartyPreview item={item} refetch={refetch} />;
  };

  public render() {
    return (
      <List
        listClientPath={this.props.location.pathname}
        createClientPath={
          !this.props.isReadonly
            ? CLIENT_URLS.USER.PARTY_CREATE.buildPath(undefined, {
                getParams: {
                  club: this.props.club
                }
              })
            : undefined
        }
        listServerPath={SERVER_URLS.PARTY_LIST}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.props.renderFilters}
        renderNoItems={this.props.renderNoItems}
        searchLabel="search_parties"
        size={this.props.size}
        defaultGetParams={{ club: this.props.club }}
      />
    );
  }
}

export default withRouter(BlockParties);

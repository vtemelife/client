import React from "react";
import compose from "lodash/flowRight";
import { RouteComponentProps, withRouter } from "react-router";

import List from "desktop/containers/Generics/List";
import { SERVER_URLS } from "routes/server";

import RequestUserPreview from "./RequestUserPreview";
import RequestObjectPreview from "./RequestObjectPreview";
import { Card } from "react-bootstrap";
import FormSelect from "generic/components/Form/FormSelect";
import { REQUESTS, REQUEST_WAITING } from "generic/constants";
import { getDisplayValue } from "utils";
import {
  SERVICE_NOTIFICATION,
  MSG_TYPE_UPDATE_COUNTERS
} from "generic/containers/ContextProviders/WebSocketService/constants";
import { _ } from "trans";

import {
  withAuthUser,
  withCounters,
  withWebSocket
} from "generic/containers/Decorators";

interface IProps extends RouteComponentProps {
  objectId?: string;
  contentType?: string;
  isReadonly?: boolean;
  renderTitle?: any;
  renderFilters?: any;
  defaultGetParams?: any;
  size?: number;

  authUser: any;
  counters: any;
  websocket: any;
}

class BlockRequests extends React.PureComponent<IProps> {
  public onDeleteSuccess = (result: any, recipients: any, refetch: any) => {
    const user = this.props.authUser.user;
    this.props.websocket.sendMessage({
      service: SERVICE_NOTIFICATION,
      sender: user.pk,
      recipients,
      message_type: MSG_TYPE_UPDATE_COUNTERS,
      data: {}
    });
    refetch();
    this.props.counters.refetch();
  };

  public onUpdateSuccess = (result: any, recipients: any, refetch: any) => {
    const user = this.props.authUser.user;
    this.props.websocket.sendMessage({
      service: SERVICE_NOTIFICATION,
      sender: user.pk,
      recipients,
      message_type: MSG_TYPE_UPDATE_COUNTERS,
      data: {}
    });
    refetch();
    this.props.counters.refetch();
  };

  public renderTitle = (getParams: any) => {
    return this.props.renderTitle
      ? this.props.renderTitle(getParams)
      : "Запросы";
  };

  public renderItem = (item: any, getParams: any, refetch: any) => {
    const RequestPreview = getParams.user
      ? RequestObjectPreview
      : RequestUserPreview;
    return (
      <RequestPreview
        request={item}
        updateUrl={SERVER_URLS.MEMBERSHIP_REQUESTS_UPDATE}
        onUpdateSuccess={(result: any, recipients: any) =>
          this.onUpdateSuccess(result, recipients, refetch)
        }
        onDeleteSuccess={(result: any, recipients: any) =>
          this.onDeleteSuccess(result, recipients, refetch)
        }
      />
    );
  };

  public renderFilters = (getParams: any, onChangeGetParams: any) => {
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            <i className="fa fa-filter" /> {_("Filters")}
          </Card.Title>
          <FormSelect
            label={_("Request status")}
            name="status"
            isClearable={true}
            options={REQUESTS}
            value={
              getParams.status
                ? {
                    value: getParams.status,
                    display: getDisplayValue(getParams.status, REQUESTS)
                  }
                : {
                    value: REQUEST_WAITING,
                    display: getDisplayValue(REQUEST_WAITING, REQUESTS)
                  }
            }
            onChange={(target: any) =>
              onChangeGetParams({
                status: target.value ? target.value.value : undefined
              })
            }
          />
        </Card.Body>
      </Card>
    );
  };

  public render() {
    return (
      <List
        listClientPath={this.props.location.pathname}
        listServerPath={SERVER_URLS.MEMBERSHIP_REQUESTS_LIST}
        contentType={this.props.contentType}
        objectId={this.props.objectId}
        generateListServerPath={this.generateListServerPath}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.props.renderFilters}
        searchLabel="search_requests"
        size={this.props.size}
        defaultGetParams={this.props.defaultGetParams}
      />
    );
  }

  private generateListServerPath = (listServerPath: any, params: any) => {
    return listServerPath.buildPath({ parentPk: this.props.objectId }, params);
  };
}

const withAuth = withAuthUser({
  propName: "authUser"
});

const withCountersData = withCounters({
  propName: "counters"
});

const withWebSocketData = withWebSocket({
  propName: "websocket"
});

export default compose(
  withRouter,
  withAuth,
  withCountersData,
  withWebSocketData
)(BlockRequests);

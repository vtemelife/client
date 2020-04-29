import React from "react";
import { WebSocketConsumer } from "../WebSocketService";
import { HeaderUserConsumer } from "../HeaderUserService";
import {
  SERVICE_NOTIFICATION,
  MSG_TYPE_UPDATE_COUNTERS
} from "../WebSocketService/constants";
import Get from "restful-react";
import { SERVER_URLS } from "routes/server";

interface IContextInterface {
  counters: any;
  refetchCounters: any;
}

export const CountersContext = React.createContext<IContextInterface | null>(
  null
);
export const CountersConsumer = CountersContext.Consumer;

interface IPropsWrapper {
  children: any;
}

interface IProps extends IPropsWrapper {
  headerUser: any;
  subscribeMessage: any;
  isConnected: boolean;
  counters: any;
  refetch: any;
}

const DFEAULT_COUNTERS = {};

class CountersProviderComponent extends React.Component<IProps> {
  public subscriptions = [];

  public componentDidMount() {
    const { unsubscribe: unsubscribeMessage } = this.props.subscribeMessage(
      this.subscribeMessage
    );

    this.subscriptions = [unsubscribeMessage] as never;
  }

  public componentWillUnmount() {
    this.subscriptions.forEach((unsubscribe: any) => {
      unsubscribe();
    });
  }

  public subscribeMessage = (socketData: any) => {
    const data = socketData.data;

    if (
      data.service !== SERVICE_NOTIFICATION ||
      data.recipients.indexOf(this.props.headerUser.pk) === -1
    ) {
      return;
    }

    switch (data.message_type) {
      case MSG_TYPE_UPDATE_COUNTERS: {
        this.props.refetch();
        break;
      }
      default:
        break;
    }
  };

  public render() {
    return (
      <CountersContext.Provider
        value={{
          counters: this.props.counters || DFEAULT_COUNTERS,
          refetchCounters: this.props.refetch
        }}
      >
        {this.props.children}
      </CountersContext.Provider>
    );
  }
}

export const CountersProvider: React.FC<IPropsWrapper> = props => (
  <HeaderUserConsumer>
    {contextHeaderUser =>
      contextHeaderUser && (
        <WebSocketConsumer>
          {context => {
            if (!context) {
              return;
            }
            if (!contextHeaderUser.headerUser) {
              return (
                <CountersContext.Provider
                  value={{
                    counters: DFEAULT_COUNTERS,
                    refetchCounters: () => {
                      return;
                    }
                  }}
                >
                  {props.children}
                </CountersContext.Provider>
              );
            }
            return (
              <Get
                path={SERVER_URLS.COUNTERS.buildPath({
                  userSlug: contextHeaderUser.headerUser.slug
                })}
              >
                {(response, { loading, error }, { refetch }) => (
                  <CountersProviderComponent
                    headerUser={contextHeaderUser.headerUser}
                    subscribeMessage={context.subscribeMessage}
                    isConnected={context.isConnected}
                    counters={response}
                    refetch={refetch}
                  >
                    {props.children}
                  </CountersProviderComponent>
                )}
              </Get>
            );
          }}
        </WebSocketConsumer>
      )
    }
  </HeaderUserConsumer>
);

import React from "react";

import SockJS from "sockjs-client";

import { SERVER_URLS } from "routes/server";
import { HeaderUserConsumer } from "../HeaderUserService";

interface IContextInterface {
  subscribeOpen: any;
  subscribeMessage: any;
  subscribeClose: any;
  sendMessage: any;
  isConnected: boolean;
}

export const WebSocketContext = React.createContext<IContextInterface | null>(
  null
);

export const WebSocketConsumer = WebSocketContext.Consumer;

interface IPropsWrapper {
  children: any;
}

interface IProps extends IPropsWrapper {
  headerUser: any;
  refetchHeaderUser: any;
}

class WebSocketProviderComponent extends React.Component<IProps> {
  public socket = null as any;
  public subscribes = {
    open: [],
    message: [],
    close: []
  };

  constructor(props: IProps) {
    super(props);
    this.initSockJs();
  }

  public componentDidUpdate() {
    this.initSockJs();
  }

  public initSockJs() {
    const user = this.props.headerUser;
    if (this.socket === null && user) {
      this.connect(SERVER_URLS.SOCKJS.buildPath({ userPk: user.pk }));
    }
    if (!user) {
      this.disconnect();
    }
  }

  public isConnected = () => {
    return this.socket !== null && this.socket.readyState === SockJS.OPEN;
  };

  public connect = (url: string) => {
    this.disconnect();
    this.socket = new SockJS(url, [
      "websocket",
      "xhr-streaming",
      "xhr-polling",
      "iframe-xhr-polling",
      "iframe-eventsource",
      "iframe-htmlfile",
      "jsonp-polling"
    ]);
    this.socket.onopen = this.handleOpen;
    this.socket.onmessage = this.handleMessage;
    this.socket.onclose = this.handleClose;
  };

  public disconnect = () => {
    if (this.isConnected()) {
      this.socket.close();
      this.socket = null;
    }
  };

  public handleOpen = () => {
    this.subscribes.open.forEach((handler: any) => {
      handler();
    });
  };

  public handleMessage = (e: any) => {
    this.subscribes.message.forEach((handler: any) => {
      handler(JSON.parse(e.data));
    });
  };

  public handleClose = () => {
    this.subscribes.close.forEach((handler: any) => {
      handler();
    });
    const user = this.props.headerUser;
    if (user) {
      this.connect(SERVER_URLS.SOCKJS.buildPath({ userPk: user.pk }));
    }
  };

  public subscribeOpen = (cb: any) => {
    this.subscribes.open.push(cb as never);
    return {
      unsubscribe: () => {
        this.subscribes.open = this.subscribes.open.filter(i => i !== cb);
      }
    };
  };

  public subscribeMessage = (cb: any) => {
    this.subscribes.message.push(cb as never);
    return {
      unsubscribe: () => {
        this.subscribes.message = this.subscribes.message.filter(i => i !== cb);
      }
    };
  };

  public subscribeClose = (cb: any) => {
    this.subscribes.close.push(cb as never);
    return {
      unsubscribe: () => {
        this.subscribes.close = this.subscribes.close.filter(i => i !== cb);
      }
    };
  };

  public sendMessage = (data: any) => {
    if (!this.isConnected()) {
      return;
    }
    this.socket.send(JSON.stringify(data));
  };

  public render() {
    return (
      <WebSocketContext.Provider
        value={{
          subscribeOpen: this.subscribeOpen,
          subscribeMessage: this.subscribeMessage,
          subscribeClose: this.subscribeClose,
          sendMessage: this.sendMessage,
          isConnected: this.isConnected()
        }}
      >
        {this.props.children}
      </WebSocketContext.Provider>
    );
  }
}

export const WebSocketProvider: React.FC<IPropsWrapper> = props => (
  <HeaderUserConsumer>
    {contextHeaderUser =>
      contextHeaderUser && (
        <WebSocketProviderComponent
          {...props}
          headerUser={contextHeaderUser.headerUser}
          refetchHeaderUser={contextHeaderUser.refetchHeaderUser}
        >
          {props.children}
        </WebSocketProviderComponent>
      )
    }
  </HeaderUserConsumer>
);

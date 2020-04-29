import React from "react";

interface IContextInterface {
  isDisplayImages: boolean;
  toggleDisplayImages: any;

  isShowSideBar: boolean;
  showSideBar: any;
  hideSideBar: any;
}

export const StatesContext = React.createContext<IContextInterface | null>(
  null
);
export const StatesConsumer = StatesContext.Consumer;

interface IProps {
  children: any;
}

interface IState {
  isDisplayImages: boolean;
  isShowSideBar: boolean;
}

export class StatesProvider extends React.Component<IProps, IState> {
  public state = {
    isDisplayImages: true,
    isShowSideBar: false
  };

  public toggleDisplayImages = () => {
    this.setState({ isDisplayImages: !this.state.isDisplayImages });
  };

  public showSideBar = () => {
    this.setState({ isShowSideBar: true });
  };

  public hideSideBar = () => {
    this.setState({ isShowSideBar: false });
  };

  public render() {
    return (
      <StatesContext.Provider
        value={{
          isDisplayImages: this.state.isDisplayImages,
          toggleDisplayImages: this.toggleDisplayImages,
          isShowSideBar: this.state.isShowSideBar,
          showSideBar: this.showSideBar,
          hideSideBar: this.hideSideBar
        }}
      >
        {this.props.children}
      </StatesContext.Provider>
    );
  }
}

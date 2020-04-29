import React from "react";
import ReactLoading from "react-loading";

class Loading extends React.PureComponent {
  public render() {
    return (
      <ReactLoading
        type="spinningBubbles"
        className="loading-container"
        color="gray"
        height={80}
        width={80}
      />
    );
  }
}

export default Loading;

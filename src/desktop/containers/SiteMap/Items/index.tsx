import React from "react";

import ResponseErrors from "desktop/components/ResponseErrors";
import Loading from "generic/components/Loading";

import MapArea from "generic/components/MapArea";

interface IProps {
  response: any;
  loading: boolean;
  error: any;
}

class BlockMapItems extends React.Component<IProps> {
  public render() {
    if (this.props.error) {
      return <ResponseErrors error={this.props.error} />;
    }
    if (!this.props.response || this.props.loading) {
      return <Loading />;
    }
    return (
      <div className="map-container">
        <MapArea data={this.props.response} />
      </div>
    );
  }
}

export default BlockMapItems;

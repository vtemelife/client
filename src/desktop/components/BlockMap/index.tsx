import React from "react";
import { Card } from "react-bootstrap";
import { Map, Placemark, ZoomControl } from "react-yandex-maps";

interface IProps {
  zoom?: number;
  center?: number[];
  geo?: any;
  onClickMap?: any;
}

class BlockMap extends React.Component<IProps, any> {
  public static getDerivedStateFromProps(props: IProps, state: any) {
    if (props.geo && state.propsGeo !== props.geo) {
      return {
        chooseArea: props.geo.radius,
        propsGeo: props.geo,
        geometry: props.geo,
        center: props.geo.coordinates,
        zoom: 14
      };
    }
    if (props.center && state.propsCenter !== props.center) {
      return {
        propsCenter: props.center,
        geometry: state.geometry.coordinates
          ? state.geometry
          : { coordinates: props.center },
        center: props.center,
        zoom: 14
      };
    }
    if (props.zoom && state.propsZoom !== props.zoom) {
      return {
        propsZoom: props.zoom,
        zoom: props.zoom
      };
    }
    return null;
  }
  public state = {
    chooseArea: false,
    geometry: {},
    center: [55, 37],
    zoom: 4
  };

  public toggleState = () => {
    const geometry = this.state.geometry as any;
    this.setState({
      chooseArea: !this.state.chooseArea
    });
    if (this.state.chooseArea) {
      this.setState({
        geometry: { ...geometry, radius: 1000 }
      });
    } else {
      this.setState({
        geometry: { coordinates: geometry.coordinates }
      });
    }
  };

  public changeRadius = (radius: any) => {
    this.setState({
      geometry: { ...this.state.geometry, radius }
    });
  };

  public render() {
    const geometry = this.state.geometry as any;
    const isReadOnly = !this.props.onClickMap;
    return (
      <Card>
        <Map
          defaultState={{ center: this.state.center, zoom: this.state.zoom }}
          width="100%"
          height="300px"
          modules={["package.full"]}
        >
          {!this.state.chooseArea && (
            <Placemark
              geometry={geometry.coordinates}
              options={{
                draggable: !isReadOnly
              }}
              onDragEnd={(e: any) => {
                const coordinates = e.get("target").geometry.getCoordinates();
                const g = { coordinates };
                this.setState({ geometry: g }, () =>
                  this.props.onClickMap(this.state.geometry)
                );
              }}
            />
          )}
          <ZoomControl />
        </Map>
      </Card>
    );
  }
}

export default BlockMap;

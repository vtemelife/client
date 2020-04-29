import React, { Fragment } from "react";

import ResponseErrors from "desktop/components/ResponseErrors";
import Loading from "generic/components/Loading";
import { animateScroll, Element, scrollSpy } from "react-scroll";
import { Col } from "react-bootstrap";

export interface IProps {
  response: any;
  loading: boolean;
  error: any;

  renderItem: any;
  renderNoItems: any;
  getParams: any;

  reverse?: boolean;
  disableLoading?: boolean;

  maxHeight?: number;

  paginate: any;
  parentPk?: string;
  refetch: any;
}

const SCROLL_HEIGHT = window.innerHeight - 200;

class Items extends React.PureComponent<IProps> {
  public componentDidMount() {
    scrollSpy.update();
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.reverse) {
      this.scrollToBottom();
    }
  }

  public scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "containerElement",
      smooth: false,
      duration: 0
    });
  };

  public onScroll = (e: any) => {
    const count = this.props.response ? this.props.response.count : 0;
    if (e.target.scrollTop === 0 && this.props.reverse) {
      this.props.paginate(count);
    }
    const height = this.props.maxHeight || SCROLL_HEIGHT;
    if (
      e.target.scrollHeight - e.target.scrollTop <= height &&
      !this.props.reverse
    ) {
      this.props.paginate(count);
    }
  };

  public render() {
    if (this.props.error) {
      return <ResponseErrors error={this.props.error} size={12} />;
    }
    const results = this.props.response ? this.props.response.results : [];
    const height = this.props.maxHeight || SCROLL_HEIGHT;
    const noItems = this.props.renderNoItems
      ? this.props.renderNoItems(this.props.getParams)
      : "-";
    return (
      <Element
        name="element"
        className="element row"
        id="containerElement"
        style={{
          position: "relative",
          maxHeight: `${height}px`,
          overflow: "scroll"
        }}
        onScroll={this.onScroll}
      >
        {this.props.reverse ? (
          <Col lg={12}>
            {this.props.loading ? <Loading /> : null}
            {!this.props.loading && results.length === 0 ? noItems : null}
          </Col>
        ) : null}
        {results.map((item: any, index: number) => (
          <Fragment key={index}>
            {this.props.renderItem(
              item,
              this.props.getParams,
              this.props.refetch
            )}
          </Fragment>
        ))}
        {!this.props.reverse ? (
          <Col lg={12}>
            {this.props.loading ? <Loading /> : null}
            {!this.props.loading && results.length === 0 ? noItems : null}
          </Col>
        ) : null}
      </Element>
    );
  }
}

export default Items;

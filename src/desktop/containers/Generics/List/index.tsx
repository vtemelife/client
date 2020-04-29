import React from "react";
import { Row, Col, Card, Button, InputGroup, Form } from "react-bootstrap";
import { RouteComponentProps, withRouter } from "react-router";
import Get from "restful-react";
import { LinkContainer } from "react-router-bootstrap";
import queryString from "query-string";

import Items from "./Items";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  listClientPath: string;
  createClientPath?: string;

  listServerPath: any;

  contentType?: string;
  objectId?: string;

  renderTitle: any;
  renderItem: any;
  renderHeader?: any;
  renderFooter?: any;
  renderFilters?: any;
  renderNoItems?: any;

  createBtnName?: string;

  itemsContainer?: any;

  size?: number;
  defaultGetParams?: any;

  generateListServerPath?: any;
  searchLabel?: string;

  reverse?: boolean; // comments and chat we scroll down and have reverse pagination
  maxHeight?: number;

  disableLoading?: boolean;
  disableSearching?: boolean;

  className?: string;
  parentPk?: string; // for chat block to provide chatPk for Items container
}

interface IState {
  limit: number;
  offset: number;
}

class List extends React.Component<IProps, IState> {
  public state = {
    limit: 10,
    offset: 0
  };

  public paginate = (count: number) => {
    const limit =
      this.state.limit >= count ? this.state.limit : this.state.limit + 10;
    if (limit !== this.state.limit) {
      this.setState({ limit });
    }
  };

  public render() {
    const getParams = { ...queryString.parse(this.props.location.search) };
    getParams.limit = `${this.state.limit}`;
    getParams.offset = `${this.state.offset}`;
    if (this.props.contentType) {
      getParams.content_type = this.props.contentType;
    }
    if (this.props.objectId) {
      getParams.object_id = this.props.objectId;
    }
    const listServerPath = this.generateListServerPath(
      this.props.listServerPath,
      {
        getParams: this.props.defaultGetParams
          ? { ...getParams, ...this.props.defaultGetParams }
          : getParams,
        location: this.props.location
      }
    );

    const ItemsContainer = this.props.itemsContainer
      ? this.props.itemsContainer
      : Items;
    return (
      <Col
        lg={this.props.size ? this.props.size : 10}
        className={`object-list-container ${this.props.className || ""}`}
      >
        <Row className="flex-column-reverse flex-lg-row">
          <Col lg={this.props.renderFilters ? 9 : 12}>
            {this.props.renderHeader ? (
              <div>{this.props.renderHeader()}</div>
            ) : null}
            <Card>
              <Card.Header>
                <Card.Title className="object-header">
                  <div className="object-title">
                    {this.props.renderTitle(getParams)}
                  </div>

                  {!this.props.disableSearching && (
                    <InputGroup className="object-search">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="search">
                          <i className="fa fa-search" />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        type="text-break"
                        placeholder={_("Input smth and click Enter")}
                        aria-describedby="search"
                        required={true}
                        defaultValue={String(getParams.search || "")}
                        onKeyPress={this.onClickEnterSearch}
                      />
                    </InputGroup>
                  )}

                  {this.props.createClientPath && (
                    <LinkContainer to={this.props.createClientPath}>
                      <Button
                        size="sm"
                        variant="primary"
                        className="object-add"
                      >
                        <i className="fa fa-plus" />{" "}
                        {this.props.createBtnName
                          ? this.props.createBtnName
                          : _("Create")}
                      </Button>
                    </LinkContainer>
                  )}
                </Card.Title>
              </Card.Header>
              <Get path={listServerPath}>
                {(response, { loading, error }, { refetch }) => (
                  <>
                    <Card.Body className="object-list">
                      <ItemsContainer
                        response={response}
                        loading={loading}
                        error={error}
                        renderItem={this.props.renderItem}
                        renderNoItems={this.props.renderNoItems}
                        getParams={getParams}
                        disableLoading={this.props.disableLoading}
                        reverse={this.props.reverse}
                        maxHeight={this.props.maxHeight}
                        paginate={this.paginate}
                        parentPk={this.props.parentPk}
                        refetch={refetch}
                      />
                    </Card.Body>
                    {this.props.renderFooter ? (
                      <Card.Footer>
                        {this.props.renderFooter(refetch)}
                      </Card.Footer>
                    ) : null}
                  </>
                )}
              </Get>
            </Card>
          </Col>
          {this.props.renderFilters ? (
            <Col lg={3} className="right-filters">
              {this.props.renderFilters(getParams, this.onChangeGetParams)}
            </Col>
          ) : null}
        </Row>
      </Col>
    );
  }

  private onClickEnterSearch = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    const value = e.target.value;
    if (e.key === "Enter") {
      const getParams = queryString.parse(this.props.location.search);
      this.props.history.push({
        pathname: this.props.listClientPath,
        search: `?${queryString.stringify({
          ...getParams,
          [`${this.props.searchLabel || "search"}`]: value
        })}`
      });
    }
  };

  private onChangeGetParams = (updatedGetParams: any) => {
    const getParams = queryString.parse(this.props.location.search);
    this.props.history.push({
      pathname: this.props.listClientPath,
      search: `?${queryString.stringify({ ...getParams, ...updatedGetParams })}`
    });
  };

  private generateListServerPath = (listServerPath: any, params: any) => {
    if (this.props.searchLabel) {
      params.getParams.search = params.getParams[this.props.searchLabel];
    }
    if (this.props.generateListServerPath) {
      return this.props.generateListServerPath(listServerPath, params);
    }
    return listServerPath.buildPath(undefined, params);
  };
}

export default withRouter(List);

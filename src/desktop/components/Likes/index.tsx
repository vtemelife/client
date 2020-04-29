import React from "react";
import { Mutate } from "restful-react";
import { Row, Col } from "react-bootstrap";

import { HeaderUserConsumer } from "generic/containers/ContextProviders/HeaderUserService";

interface IPropsWrapper {
  likePath: string;
  item: any;
}

interface IProps extends IPropsWrapper {
  likeAction: any;
  headerUser: any;
  refetchHeaderUser: any;
}

interface IState {
  likes: number;
  isLike: boolean;
}

class Likes extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const user = this.props.headerUser || {};
    const likes = this.props.item.likes;
    this.state = {
      isLike: likes.indexOf(user.pk) !== -1,
      likes: likes.length
    };
  }

  public render() {
    return (
      <Row className="likes-container">
        <Col xs={8} className="likes-info">
          {this.props.item.comments_count !== undefined && (
            <div className="float-left likes-info-box">
              <i className="fa fa-comments" />
              <span>{this.props.item.comments_count}</span>
            </div>
          )}
          {this.props.item.views !== undefined && (
            <div className="float-left likes-info-box">
              <i className="fa fa-eye" />
              <span>{this.props.item.views}</span>
            </div>
          )}
        </Col>
        <Col xs={4} className="likes-actions">
          <div className="float-right">
            <div
              onClick={() => {
                this.props.likeAction().then((result: any) => {
                  this.setState({
                    likes: result.likes.length,
                    isLike: !this.state.isLike
                  });
                });
              }}
            >
              {this.state.isLike ? (
                <i className="fa fa-heart" />
              ) : (
                <i className="fa fa-heart" />
              )}
              <span>{this.state.likes}</span>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

const LikesWrapper: React.FC<IPropsWrapper> = props => (
  <HeaderUserConsumer>
    {contextHeaderUser =>
      contextHeaderUser && (
        <Mutate verb="PATCH" path={props.likePath}>
          {likeAction => (
            <Likes
              {...props}
              likeAction={likeAction}
              headerUser={contextHeaderUser.headerUser}
              refetchHeaderUser={contextHeaderUser.refetchHeaderUser}
            />
          )}
        </Mutate>
      )
    }
  </HeaderUserConsumer>
);

export default LikesWrapper;

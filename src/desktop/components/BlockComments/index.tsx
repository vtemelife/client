import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Mutate } from 'restful-react';

import Comment from './Comment';
import { SERVER_URLS } from 'routes/server';
import List from 'desktop/containers/Generics/List';
import FormMsgArea from 'generic/components/Form/FormMsgArea';
import handleErrors from '../ResponseErrors/utils';
import { _ } from 'trans';

interface IProps extends RouteComponentProps {
  objectId: string;
  contentType: string;
  isReadonly?: boolean;
  renderTitle?: any;
  renderFilters?: any;
  defaultqueryParams?: any;
  size?: number;
}

interface IState {
  comment: string;
  errors?: any;
}

export class BlockComments extends React.PureComponent<IProps, IState> {
  public state = {
    comment: '',
    errors: undefined,
  };

  public renderTitle = (queryParams: any) => {
    return this.props.renderTitle
      ? this.props.renderTitle(queryParams)
      : _('Comments');
  };

  public renderItem = (item: any) => {
    return (
      <Comment
        item={item}
        depth={0}
        objectId={this.props.objectId}
        contentType={this.props.contentType}
      />
    );
  };

  public renderFooter = (refetch: any) => {
    if (this.props.isReadonly) {
      return null;
    }
    return (
      <Mutate verb="POST" path={SERVER_URLS.COMMENT_CREATE.buildPath()}>
        {(sendComment, response) => (
          <div className="comments-form-message">
            <FormMsgArea
              name="comment"
              required={true}
              value={this.state.comment}
              onChange={(target: any) =>
                this.setState({ comment: target.value })
              }
              errors={this.state.errors}
              onSend={() => {
                sendComment({
                  object_id: this.props.objectId,
                  content_type: this.props.contentType,
                  comment: this.state.comment.replace(
                    /(?:\r\n|\r|\n)/g,
                    '<br />',
                  ),
                })
                  .then((result: any) => {
                    this.setState({ comment: '' });
                    refetch();
                  })
                  .catch((errors: any) => {
                    if (errors.status === 400) {
                      this.setState({ errors: errors.data.comment });
                    } else {
                      handleErrors(errors);
                    }
                  });
              }}
            />
          </div>
        )}
      </Mutate>
    );
  };

  public render() {
    return (
      <List
        listClientPath={this.props.location.pathname}
        listServerPath={SERVER_URLS.COMMENT_LIST}
        contentType={this.props.contentType}
        objectId={this.props.objectId}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFooter={this.renderFooter}
        renderFilters={this.props.renderFilters}
        searchLabel="search_comments"
        size={this.props.size}
        reverse={true}
        defaultqueryParams={this.props.defaultqueryParams}
      />
    );
  }
}

export default withRouter(BlockComments);

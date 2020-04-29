import React, { useState, useContext } from 'react';
import { Media, Col, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { useMutate } from 'restful-react';
import Moment from 'react-moment';

import Image from 'generic/components/Image';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import { getLocale, handleErrors, renderHtml } from 'utils';
import userSVG from 'generic/layout/images/user.svg';
import Likes from '../../Likes';
import { _ } from 'trans';
import DeleteItem from 'mobile/components/DeleteItem';
import FormMsgArea from 'generic/components/Form/FormMsgArea';

interface IProps {
  item: any;
  objectId: string;
  contentType: string;
  depth: number;
}

const MAX_DEPTH = 2;

const Comment: React.SFC<IProps> = ({ item, objectId, contentType, depth }) => {
  const [commentForUpdate, changeCommentForUpdate] = useState(item);
  const [commentForAnswer, changeCommentForAnswer] = useState({
    parent: item.pk,
    comment: '',
    object_id: objectId,
    content_type: contentType,
  });
  const [children, changeChildren] = useState(item.children || []);
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};

  const { mutate: updateComment } = useMutate({
    verb: 'PATCH',
    path: SERVER_URLS.COMMENT_UPDATE.buildPath({
      commentPk: item.pk,
    }),
  });

  const { mutate: createComment } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.COMMENT_CREATE.buildPath(),
  });

  return (
    <>
      <Col
        lg={12}
        md={12}
        sm={12}
        className={`comment-container depth-${depth}`}
      >
        <Media>
          {item.creator.avatar && item.creator.avatar.thumbnail_100x100 ? (
            <Image
              width={50}
              height={50}
              className="mr-2"
              src={item.creator.avatar.thumbnail_100x100}
              roundedCircle={true}
            />
          ) : (
            <Image
              width={50}
              height={50}
              className="mr-2"
              src={userSVG}
              roundedCircle={true}
            />
          )}

          <Media.Body>
            <div className="comment-title">
              <div className="comment-username">
                {item.creator.slug ? (
                  <a
                    href={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: item.creator.slug,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.creator.name}
                  </a>
                ) : (
                  <span>{item.creator.name}</span>
                )}
              </div>

              <div className="actions" />
              {!commentForUpdate.is_deleted && item.creator.pk === user.pk && (
                <OverlayTrigger
                  trigger="click"
                  rootClose={true}
                  placement="top"
                  overlay={
                    <Popover
                      id="popover-comment-change"
                      className="popover-comment"
                    >
                      <Popover.Title as="h3">
                        <i className="fa fa-bars" /> {_('Change comment')}
                      </Popover.Title>
                      <Popover.Content>
                        <DeleteItem
                          description={_(
                            'Are you sure you want to delete the comment?',
                          )}
                          onSuccess={() => {
                            changeCommentForUpdate({
                              ...commentForUpdate,
                              comment: _('Deleted comment'),
                              is_deleted: true,
                            });
                            document.body.click();
                          }}
                          path={SERVER_URLS.COMMENT_DELETE.buildPath({
                            commentPk: item.pk,
                          })}
                        >
                          <Button size="sm" variant="danger">
                            {_('Delete')}
                          </Button>
                        </DeleteItem>
                        <div style={{ marginTop: '10px' }} />
                        <FormMsgArea
                          name="comment"
                          required={true}
                          value={commentForUpdate.comment}
                          onChange={(target: any) => {
                            changeCommentForUpdate({
                              ...commentForUpdate,
                              comment: target.value,
                            });
                          }}
                          onSend={() => {
                            updateComment(commentForUpdate)
                              .then((data: any) => {
                                document.body.click();
                              })
                              .catch((errors: any) => {
                                handleErrors(errors);
                              });
                          }}
                        />
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <span className="comment-edit">
                    {' '}
                    {_('edit comment')} {depth < MAX_DEPTH ? '|' : undefined}{' '}
                  </span>
                </OverlayTrigger>
              )}
              {!commentForUpdate.is_deleted && depth < MAX_DEPTH && (
                <OverlayTrigger
                  trigger="click"
                  rootClose={true}
                  placement="top"
                  overlay={
                    <Popover
                      id="popover-comment-answer"
                      className="popover-comment"
                    >
                      <Popover.Title as="h3">
                        <i className="fa fa-comments" /> {_('Answer comment')}
                      </Popover.Title>
                      <Popover.Content>
                        <FormMsgArea
                          name="comment"
                          required={true}
                          value={commentForAnswer.comment}
                          onChange={(target: any) => {
                            changeCommentForAnswer({
                              ...commentForAnswer,
                              comment: target.value,
                            });
                          }}
                          onSend={() => {
                            createComment(commentForAnswer)
                              .then((data: any) => {
                                document.body.click();
                                changeCommentForAnswer({
                                  ...commentForAnswer,
                                  comment: '',
                                });
                                changeChildren([...children, ...[data]]);
                              })
                              .catch((errors: any) => {
                                handleErrors(errors);
                              });
                          }}
                        />
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <span className="comment-answer"> {_('answer')}</span>
                </OverlayTrigger>
              )}
            </div>
            <div className="comment-time">
              <Moment locale={getLocale()} fromNow={true}>
                {item.created_date}
              </Moment>
            </div>
            <div className="comment-description">
              {renderHtml(commentForUpdate.comment)}
            </div>
            <Likes
              likePath={SERVER_URLS.COMMENT_LIKE.buildPath({
                commentPk: item.pk,
              })}
              item={item}
            />
          </Media.Body>
        </Media>
        <hr />
      </Col>

      {!commentForUpdate.is_deleted &&
        depth < MAX_DEPTH &&
        children.map((subitem: any) => (
          <Comment
            key={subitem.pk}
            item={subitem}
            objectId={objectId}
            contentType={contentType}
            depth={depth + 1}
          />
        ))}
    </>
  );
};

export default Comment;

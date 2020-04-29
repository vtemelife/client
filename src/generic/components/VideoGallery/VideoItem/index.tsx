import React, { useState, useContext } from 'react';
import { useMutate } from 'restful-react';

import { SERVER_URLS } from 'routes/server';
import Likes from 'desktop/components/Likes';
import { OverlayTrigger, Popover, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';

import { ROLE_MODERATOR } from 'generic/constants';
import { CLIENT_URLS } from 'desktop/routes/client';
import { _ } from 'trans';
import DeleteItem from 'mobile/components/DeleteItem';
import Video from 'generic/components/Video';
import { confirmAlert } from 'react-confirm-alert';
import { handleSuccess, handleErrors } from 'utils';
import ModalComments from 'generic/components/ModalComments';

const VideoItem: React.SFC<any> = ({ video, refetch }) => {
  const [showComments, toggleShowComments] = useState(false);
  const [commentsCount, changeCommentsCount] = useState(video.comments_count);
  const { mutate: publicOnSite } = useMutate({
    verb: 'PATCH',
    path: SERVER_URLS.MEDIA_TO_MODERATE_MEDIA_SECTION.buildPath({
      mediaPk: video.pk,
    }),
  });
  const { mutate: sendComment } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.COMMENT_CREATE.buildPath(),
  });

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};

  const isCreator = (item: any) => {
    return item.creator === user.pk || user.role === ROLE_MODERATOR;
  };
  return (
    <div className="block">
      <div className="video-item-header">
        <div onClick={() => toggleShowComments(true)}>
          <i className="fa fa-comments fa-lg" /> {commentsCount}
        </div>
        {isCreator(video) && (
          <div>
            <OverlayTrigger
              trigger="click"
              rootClose={true}
              placement="left"
              overlay={
                <Popover id="video-menu">
                  <Popover.Content>
                    <ListGroup variant="flush">
                      {!video.status && (
                        <ListGroup.Item
                          onClick={() => {
                            confirmAlert({
                              title: _('Are you sure?'),
                              message: _(
                                'Are you sure that you want to publish your video in VTEME CONTENT menu for all users on site?',
                              ),
                              buttons: [
                                {
                                  label: _('Yes'),
                                  onClick: () => {
                                    publicOnSite({})
                                      .then((data: any) => {
                                        handleSuccess(
                                          _(
                                            'Sent to moderation. Waiting moderation...',
                                          ),
                                        );
                                      })
                                      .catch((errors: any) => {
                                        handleErrors(errors);
                                      });
                                  },
                                },
                                {
                                  label: _('No'),
                                  onClick: () => {
                                    return;
                                  },
                                },
                              ],
                            });
                          }}
                        >
                          <i className="fa fa-eye" />{' '}
                          {_('Publish your video for all users')}
                        </ListGroup.Item>
                      )}
                      <ListGroup.Item>
                        <Link
                          to={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_UPDATE.buildPath(
                            {
                              mediaPk: video.pk,
                            },
                          )}
                        >
                          <i className="fa fa-pencil" /> {_('Update')}
                        </Link>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <DeleteItem
                          description={_(
                            'Are you sure you want to delete the club?',
                          )}
                          onSuccess={() => refetch()}
                          path={SERVER_URLS.MEDIA_DELETE.buildPath({
                            mediaPk: video.pk,
                          })}
                        >
                          <i className="fa fa-trash" /> {_('Delete')}
                        </DeleteItem>
                      </ListGroup.Item>
                    </ListGroup>
                  </Popover.Content>
                </Popover>
              }
            >
              <i className="fa fa-bars fa-lg" />
            </OverlayTrigger>
          </div>
        )}
      </div>
      <div className="video-item-content">
        <Video video_code={video.video_code} height={300} />
      </div>
      <div className="video-item-footer">
        <Likes
          likePath={SERVER_URLS.MEDIA_LIKE.buildPath({
            mediaPk: video.pk,
          })}
          item={{ ...video, comments_count: undefined }}
        />
      </div>
      <ModalComments
        showComments={showComments}
        toggleShowComments={toggleShowComments}
        contentType={'media:media'}
        objectId={video.pk}
        onSuccess={() => changeCommentsCount(commentsCount + 1)}
        sendComment={sendComment}
      />
    </div>
  );
};

export default VideoItem;

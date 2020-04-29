import React, { useContext } from 'react';
import compose from 'lodash/flowRight';
import { Card, Col, Button, Row, ButtonGroup } from 'react-bootstrap';
import { RouteComponentProps, useParams, useHistory } from 'react-router';
import { useGet } from 'restful-react';
import { Mutate } from 'restful-react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import Loading from 'generic/components/Loading';
import BlockComments from 'desktop/components/BlockComments';
import Likes from 'desktop/components/Likes';
import Delete from 'desktop/containers/Generics/Delete';
import handleErrors from 'desktop/components/ResponseErrors/utils';
import { _ } from 'trans';
import { renderHtml } from 'utils';
import { withAuthUser, withRestGet } from 'generic/containers/Decorators';
import { REQUEST_APPROVED, ROLE_MODERATOR } from 'generic/constants';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
  post: any;
}

const Post = () => {
  const { postSlug } = useParams();
  const history = useHistory();

  const { data: postData, loading: postLoading, refetch } = useGet({
    path: SERVER_URLS.POSTS_DETAIL.buildPath({
      postSlug,
    }),
  });

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    pk: null,
  };

  const onDeleteSuccess = () => {
    history.goBack();
  };

  if (postLoading) {
    return <Loading />;
  }

  const post = postData;
  const isCreator = post.creator.pk === user.pk || user.role === ROLE_MODERATOR;
  return (
    <Col lg={10} className="post-container">
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Body>
              <Row className="post-detail-block">
                <Col lg={12} className="title text-break">
                  {post.title}
                </Col>
              </Row>
              <Row className="post-detail-block">
                <Col lg={12} className="text-break">
                  <Link
                    target="_blank"
                    to={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: post.creator.slug,
                    })}
                  >
                    <i className="fa fa-user" /> {post.creator.name}
                  </Link>
                </Col>
              </Row>
              <Row className="post-detail-block">
                {isCreator && (
                  <Col lg={12} className="text-break">
                    <Delete
                      description={_(
                        'Are you sure you want to delete the article?',
                      )}
                      onSuccess={onDeleteSuccess}
                      destoryServerPath={SERVER_URLS.POSTS_DELETE.buildPath({
                        postSlug: post.slug,
                      })}
                    >
                      <Button variant="danger" size="sm">
                        <i className="fa fa-trash" />
                      </Button>
                    </Delete>
                    &nbsp;
                    <LinkContainer
                      to={CLIENT_URLS.USER.POST_UPDATE.buildPath({
                        postSlug: post.slug,
                      })}
                    >
                      <Button variant="primary" size="sm">
                        <i className="fa fa-pencil" />
                      </Button>
                    </LinkContainer>
                  </Col>
                )}
              </Row>
              <hr />
              <div className="description text-break">
                {renderHtml(post.post)}
              </div>
              <hr />
              {post.hash_tags.length > 0 && (
                <>
                  <div className="post-hash-tags">
                    {post.hash_tags.map((hashTag: string, index: number) => (
                      <Link
                        to={{
                          pathname: CLIENT_URLS.POSTS.buildPath(),
                          search: `?hash_tag=${hashTag}`,
                        }}
                        key={index}
                      >
                        {`#${hashTag}`}{' '}
                      </Link>
                    ))}
                  </div>
                  <hr />
                </>
              )}
              {isCreator && post.status !== REQUEST_APPROVED && (
                <>
                  <Row>
                    <Col lg={12}>
                      <ButtonGroup vertical={true}>
                        <Mutate
                          verb="PATCH"
                          path={SERVER_URLS.WHISPER_TO_MODERATE.buildPath({
                            postSlug: post.slug,
                          })}
                        >
                          {(postToModerate, response) => (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                confirmAlert({
                                  title: _('Are you sure?'),
                                  message: _(
                                    'Are you sure want to publish the article in <Whisper> header section.',
                                  ),
                                  buttons: [
                                    {
                                      label: _('Yes'),
                                      onClick: () => {
                                        postToModerate({})
                                          .then((result: any) => {
                                            toast.success(
                                              _(
                                                'The request has been sent. Expect moderation.',
                                              ),
                                              { autoClose: 10000 },
                                            );
                                            refetch();
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
                                })
                              }
                            >
                              <i className="fa fa-eye-slash" />{' '}
                              {_('to <Whisper> header section')}
                            </Button>
                          )}
                        </Mutate>
                        <Mutate
                          verb="PATCH"
                          path={SERVER_URLS.POSTS_TO_MODERATE.buildPath({
                            postSlug: post.slug,
                          })}
                        >
                          {(postToModerate, response) => (
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() =>
                                confirmAlert({
                                  title: _('Are you sure?'),
                                  message: _(
                                    'Are you sure want to publish the article in <Article> header section.',
                                  ),
                                  buttons: [
                                    {
                                      label: _('Yes'),
                                      onClick: () => {
                                        postToModerate({})
                                          .then((result: any) => {
                                            toast.success(
                                              _(
                                                'The request has been sent. Expect moderation.',
                                              ),
                                              { autoClose: 10000 },
                                            );
                                            refetch();
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
                                })
                              }
                            >
                              <i className="fa fa-book" />{' '}
                              {_('to <Articles> header section')}
                            </Button>
                          )}
                        </Mutate>
                      </ButtonGroup>
                    </Col>
                  </Row>
                  <hr />
                </>
              )}
              <Likes
                likePath={SERVER_URLS.POSTS_LIKE.buildPath({
                  postSlug: post.slug,
                })}
                item={post}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <BlockComments
            objectId={post.pk}
            contentType="posts:post"
            size={12}
          />
        </Col>
      </Row>
    </Col>
  );
};

const withAuth = withAuthUser({
  propName: 'authUser',
});

const withPost = withRestGet({
  propName: 'post',
  path: (props: any) =>
    SERVER_URLS.POSTS_DETAIL.buildPath({
      postSlug: props.match.params.postSlug,
    }),
});

export default compose(withAuth, withPost)(Post);

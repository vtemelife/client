import React from 'react';
import {
  Card,
  Media,
  Row,
  Col,
  Button,
  Nav,
  ButtonGroup,
} from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Mutate } from 'restful-react';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

import Image from 'generic/components/Image';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import pictureSVG from 'generic/layout/images/picture.svg';

import List from 'desktop/containers/Generics/List';
import { CountersConsumer } from 'generic/containers/ContextProviders/CountersService';
import FormSelect from 'generic/components/Form/FormSelect';
import {
  REQUESTS,
  REQUEST_APPROVED,
  REQUEST_DECLINED,
  REQUEST_NONE,
} from 'generic/constants';
import { getDisplayValue } from 'utils';

import handleErrors from 'desktop/components/ResponseErrors/utils';
import { _ } from 'trans';

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  counters: any;
}

class MediaList extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    if (queryParams.is_ban) {
      return _('Media (banned)');
    }
    if (queryParams.status) {
      return `${_('Media')} (${getDisplayValue(queryParams.status, REQUESTS)})`;
    }
    return _('Media');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return (
      <Col lg={12} className="moderator-media-item-container">
        <Media>
          <Link
            target="_blank"
            to={CLIENT_URLS.MEDIA_DETAIL.buildPath({ mediaPk: item.pk })}
          >
            {item.image && item.image.thumbnail_500x500 ? (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={item.image.thumbnail_500x500}
              />
            ) : (
              <Image width={50} height={50} className="mr-3" src={pictureSVG} />
            )}
          </Link>
          <Media.Body>
            <Row className="media-item-data">
              <Col lg={8}>
                <Link
                  target="_blank"
                  to={CLIENT_URLS.MEDIA_DETAIL.buildPath({ mediaPk: item.pk })}
                >
                  <span className="text-break">{item.title}</span>
                </Link>
                <div className="text-break media-item-info">
                  <Link
                    target="_blank"
                    to={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: item.creator.slug,
                    })}
                  >
                    <i className="fa fa-user" /> {item.creator.name}
                  </Link>
                </div>
              </Col>
              <Col lg={3} className="media-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  {item.status && item.status !== REQUEST_APPROVED && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_MEDIA_APPROVE.buildPath({
                        mediaPk: item.pk,
                      })}
                    >
                      {(moderate) => (
                        <Button
                          size="sm"
                          variant="warning"
                          className="float-right"
                          onClick={() =>
                            confirmAlert({
                              title: _('Are you sure?'),
                              message: _(
                                'Are you sure you want to approve the media?',
                              ),
                              buttons: [
                                {
                                  label: _('Yes'),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_('Successfully'));
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
                          <i className="fa fa-check" /> {_('Approve')}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {item.status !== REQUEST_DECLINED && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_MEDIA_DECLINE.buildPath({
                        mediaPk: item.pk,
                      })}
                    >
                      {(moderate) => (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              confirmAlert({
                                title: _('Are you sure?'),
                                message: _(
                                  'Are you sure you want to decline the media?',
                                ),
                                buttons: [
                                  {
                                    label: _('Yes'),
                                    onClick: () => {
                                      moderate({})
                                        .then((result: any) => {
                                          toast.success(_('Successfully'));
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
                            <i className="fa fa-times-circle" /> {_('Decline')}
                          </Button>
                        </>
                      )}
                    </Mutate>
                  )}
                  {!item.is_ban && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_MEDIA_TOGGLE_BAN.buildPath({
                        mediaPk: item.pk,
                      })}
                    >
                      {(moderate) => (
                        <Button
                          size="sm"
                          variant={!item.is_ban ? 'danger' : 'success'}
                          className="float-right"
                          onClick={() =>
                            confirmAlert({
                              title: _('Are you sure?'),
                              message: _(
                                'Are you sure you want to ban the media?',
                              ),
                              buttons: [
                                {
                                  label: _('Yes'),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_('Successfully'));
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
                          <i className="fa fa-ban" /> {_('ban')}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {item.is_ban && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_MEDIA_TOGGLE_BAN.buildPath({
                        mediaPk: item.pk,
                      })}
                    >
                      {(moderate) => (
                        <Button
                          size="sm"
                          variant="success"
                          className="float-right"
                          onClick={() =>
                            confirmAlert({
                              title: _('Are you sure?'),
                              message: _(
                                'Are you sure you want to unban the media?',
                              ),
                              buttons: [
                                {
                                  label: _('Yes'),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_('Successfully'));
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
                          <i className="fa fa-check" /> {_('Unban')}
                        </Button>
                      )}
                    </Mutate>
                  )}
                </ButtonGroup>
              </Col>
            </Row>
          </Media.Body>
        </Media>
        <hr />
      </Col>
    );
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-list" /> {_('Type')}
            </Card.Title>
            <Nav className="flex-column">
              <Nav.Link
                onClick={() =>
                  onChangequeryParams({ is_ban: undefined, status: undefined })
                }
              >
                <i className="fa fa-list" /> {_('All')}
              </Nav.Link>
              <Nav.Link onClick={() => onChangequeryParams({ is_ban: 'true' })}>
                <i className="fa fa-ban" /> {_('Banned')}
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-filter" /> {_('Filters')}
            </Card.Title>
            <FormSelect
              label={_('Status')}
              name="status"
              isClearable={true}
              options={REQUESTS}
              value={
                queryParams.status
                  ? {
                      value: queryParams.status,
                      display: getDisplayValue(queryParams.status, REQUESTS),
                    }
                  : {
                      value: REQUEST_NONE,
                      display: getDisplayValue(REQUEST_NONE, REQUESTS),
                    }
              }
              onChange={(target: any) =>
                onChangequeryParams({
                  status: target.value ? target.value.value : undefined,
                })
              }
            />
          </Card.Body>
        </Card>
      </>
    );
  };

  public render() {
    return (
      <List
        listClientPath={CLIENT_URLS.MODERATOR.MEDIA_LIST.buildPath()}
        listServerPath={SERVER_URLS.MODERATION_MEDIA}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }
}

const MediaListWrapper: React.FC<IPropsWrapper> = (props) => (
  <CountersConsumer>
    {(context) =>
      context && <MediaList {...props} counters={context.counters} />
    }
  </CountersConsumer>
);

export default MediaListWrapper;

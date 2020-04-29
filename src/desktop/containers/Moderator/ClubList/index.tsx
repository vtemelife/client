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

import Image from 'generic/components/Image';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import pictureSVG from 'generic/layout/images/picture.svg';

import List from 'desktop/containers/Generics/List';
import { CountersConsumer } from 'generic/containers/ContextProviders/CountersService';
import { renderHtml } from 'utils';
import FormSelect from 'generic/components/Form/FormSelect';
import {
  REQUESTS,
  REQUEST_APPROVED,
  REQUEST_NONE,
  REQUEST_DECLINED,
} from 'generic/constants';
import { getDisplayValue } from 'utils';
import { Mutate } from 'restful-react';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import handleErrors from 'desktop/components/ResponseErrors/utils';
import { _ } from 'trans';

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  counters: any;
}

class ClubList extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    if (queryParams.is_ban) {
      return _('Clubs (ban)');
    }
    if (queryParams.status) {
      return `${_('Clubs')} (${getDisplayValue(queryParams.status, REQUESTS)})`;
    }
    return _('Clubs');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return (
      <Col lg={12} className="moderator-club-item-container">
        <Media>
          <Link
            target="_blank"
            to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({ clubSlug: item.slug })}
          >
            {item.image && item.image.thumbnail_100x100 ? (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={item.image.thumbnail_100x100}
              />
            ) : (
              <Image width={50} height={50} className="mr-3" src={pictureSVG} />
            )}
          </Link>
          <Media.Body>
            <Row className="club-item-data">
              <Col lg={8}>
                <Link
                  target="_blank"
                  to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                    clubSlug: item.slug,
                  })}
                >
                  <span className="text-break">{item.name}</span>
                </Link>
                <div className="text-break club-item-info">
                  <i className="fa fa-map-marker-alt" />{' '}
                  {item.city ? item.city.country.name : ''}
                  {item.city ? ', ' : ''}
                  {item.city ? item.city.name : ''}
                </div>
                <br />
                <div className="text-break club-item-info">
                  {renderHtml(item.description)}
                </div>
              </Col>
              <Col lg={3} className="club-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  {item.status !== REQUEST_APPROVED && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_CLUB_APPROVE.buildPath({
                        clubPk: item.pk,
                      })}
                    >
                      {(moderate) => (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            confirmAlert({
                              title: _('Are you sure?'),
                              message: _(
                                'Are you sure you want to approve the club?',
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
                      path={SERVER_URLS.MODERATION_CLUB_DECLINE.buildPath({
                        clubPk: item.pk,
                      })}
                    >
                      {(moderate) => (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            confirmAlert({
                              title: _('Are you sure?'),
                              message: _(
                                'Are you sure you want to decline the club?',
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
                          <i className="fa fa-fa-times-circle" /> {_('Decline')}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {!item.is_ban && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_CLUB_TOGGLE_BAN.buildPath({
                        clubPk: item.pk,
                      })}
                    >
                      {(moderate) => (
                        <Button
                          size="sm"
                          variant={!item.is_ban ? 'danger' : 'success'}
                          onClick={() =>
                            confirmAlert({
                              title: _('Are you sure?'),
                              message: _(
                                'Are you sure you want to ban the club?',
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
                      path={SERVER_URLS.MODERATION_CLUB_TOGGLE_BAN.buildPath({
                        clubPk: item.pk,
                      })}
                    >
                      {(moderate) => (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            confirmAlert({
                              title: _('Are you sure?'),
                              message: _(
                                'Are you sure you want to unban the club?',
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
        listClientPath={CLIENT_URLS.MODERATOR.CLUB_LIST.buildPath()}
        listServerPath={SERVER_URLS.MODERATION_CLUBS}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }
}

const ClubListWrapper: React.FC<IPropsWrapper> = (props) => (
  <CountersConsumer>
    {(context) =>
      context && <ClubList {...props} counters={context.counters} />
    }
  </CountersConsumer>
);

export default ClubListWrapper;

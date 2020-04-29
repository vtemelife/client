import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useGet } from 'restful-react';
import { useParams } from 'react-router';
import {
  ListGroup,
  Button,
  OverlayTrigger,
  Popover,
  Modal,
} from 'react-bootstrap';
import ShowMore from 'react-show-more';

import { TYPE_OPEN, ROLE_MODERATOR } from 'generic/constants';
import defaultSVG from 'generic/layout/images/picture.svg';
import { CLIENT_URLS } from 'mobile/routes/client';
import userSVG from 'generic/layout/images/user.svg';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import Image from 'generic/components/Image';
import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import Header from 'mobile/containers/Header';
import Loading from 'generic/components/Loading';
import { getGeo } from 'desktop/containers/User/Profile/utils';

import PartyMedia from './PartyMedia';
import PartyActions from '../../../../generic/components/PartyActions';

import { renderHtml, getLocale } from 'utils';
import DeleteItem from 'mobile/components/DeleteItem';
import BlockMap from 'desktop/components/BlockMap';

import Moment from 'react-moment';

const PartyDetail: React.SFC<any> = () => {
  const [showMap, toggleShowMap] = useState(false);
  const { partySlug } = useParams();
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    pk: null,
  };

  const { data: partyData, loading: partyLoading, refetch } = useGet({
    path: SERVER_URLS.PARTY_DETAIL.buildPath({
      partySlug,
    }),
  });
  const party = partyData || {
    slug: null,
    name: '',
  };

  if (partyLoading) {
    return <Loading />;
  }

  const title = party.name;

  const isModerator = (item: any) => {
    return (
      item.moderators.map((m: any) => m.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR
    );
  };
  const isParticipant = (item: any) => {
    return item.users.map((m: any) => m.pk).indexOf(user.pk) !== -1;
  };

  const isParticipantOrOpen = (item: any) => {
    return isParticipant(item) || item.party_type.value === TYPE_OPEN;
  };

  return (
    <div className="container-party">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
        <body className="body-mobile body-party" />
      </Helmet>
      <Header name={' '} fixed={true} />
      {partyLoading && <Loading />}
      <div className="party-data">
        <div className="party-avatar block">
          <Image
            src={
              party.image && party.image.image ? party.image.image : defaultSVG
            }
          />
          <div className="party-title">
            <h1>{party.name}</h1>
            {isModerator(party.club) && (
              <div className="actions">
                <OverlayTrigger
                  trigger="click"
                  rootClose={true}
                  placement="left"
                  overlay={
                    <Popover id="popover-basic">
                      <Popover.Content>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <Link
                              to={CLIENT_URLS.USER.PARTY_UPDATE.buildPath({
                                partySlug: party.slug,
                              })}
                            >
                              <i className="fa fa-pencil" />{' '}
                              {_('Update the party')}
                            </Link>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <DeleteItem
                              description={_(
                                'Are you sure you want to delete the party?',
                              )}
                              onSuccess={() => refetch()}
                              path={SERVER_URLS.PARTY_DELETE.buildPath({
                                partySlug: party.slug,
                              })}
                            >
                              <i className="fa fa-trash" />{' '}
                              {_('Delete the party')}
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
          <div className="info-line about">
            <div className="info-icon">
              <i className="fa fa-map" />
            </div>
            <div className="geo-text">{getGeo(party)}</div>
          </div>
          <div className="info-line participants">
            <div className="info-icon">
              <i className="fa fa-users" />
            </div>
            <div className="participants-count">
              {party.users.length} {_('Participants')}
            </div>
            <div className="participants-list">
              {isParticipantOrOpen(party) && (
                <Link
                  to={CLIENT_URLS.USER.PARTICIPANT_LIST.buildPath({
                    queryParams: {
                      objectId: party.pk,
                      contentType: 'events:party',
                    },
                  })}
                >
                  {party.users
                    .slice(0, 3)
                    .map((participant: any, index: number) => (
                      <Image
                        key={index}
                        src={
                          participant.avatar &&
                          participant.avatar.thumbnail_100x100
                            ? participant.avatar.thumbnail_100x100
                            : userSVG
                        }
                        width={30}
                        height={30}
                        roundedCircle={true}
                      />
                    ))}
                </Link>
              )}
            </div>
          </div>

          <div className="info-line about">
            <div className="info-icon">
              <i className="fa fa-comment" />
            </div>
            <div className="about-text">
              <ShowMore
                lines={3}
                more={_('Show more')}
                less={_('Show less')}
                anchorClass=""
              >
                {renderHtml(party.description)}
              </ShowMore>
            </div>
          </div>
          <div className="info-line actions">
            <PartyActions item={party} refetch={refetch} user={user} />
          </div>
        </div>
        <div className="party-info block">
          <h2>{_('Party info')}</h2>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <span className="item-title">{_('Club')}:</span>
              <Link
                to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                  clubSlug: party.club.slug,
                })}
              >
                {party.club.name}
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_('Type')}:</span>
              {party.party_type.display}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_('Theme')}:</span>
              {party.theme.display}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_('Start date')}:</span>
              <Moment locale={getLocale()} format="DD.MM.YYYY HH:mm">
                {party.start_date}
              </Moment>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_('End date')}:</span>
              <Moment locale={getLocale()} format="DD.MM.YYYY HH:mm">
                {party.end_date}
              </Moment>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_('Address')}:</span>
              <ShowMore
                lines={3}
                more={_('Show more')}
                less={_('Show less')}
                anchorClass=""
              >
                {renderHtml(party.address)}
              </ShowMore>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_('Map')}:</span>
              <br />
              <Button
                size="sm"
                variant="warning"
                className="float-left"
                onClick={() => toggleShowMap(true)}
              >
                <i className="fa fa-map" /> {_('Show map')}
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </div>
        {isParticipantOrOpen(party) && (
          <div className="party-info block">
            <h2>{_('Count of participants')}</h2>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <span className="item-title">{_('Couples')}:</span>
                {party.pair_count}
              </ListGroup.Item>
              <ListGroup.Item>
                <span className="item-title">{_('M')}:</span>
                {party.man_count}
              </ListGroup.Item>
              <ListGroup.Item>
                <span className="item-title">{_('W')}:</span>
                {party.woman_count}
              </ListGroup.Item>
            </ListGroup>
          </div>
        )}
        {isParticipantOrOpen(party) && (
          <div className="party-info block">
            <h2>{_('Costs')}</h2>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <span className="item-title">{_('Couples')}:</span>
                {party.pair_cost} {'Rub'}
              </ListGroup.Item>
              <ListGroup.Item>
                <span className="item-title">{_('M')}:</span>
                {party.man_cost} {'Rub'}
              </ListGroup.Item>
              <ListGroup.Item>
                <span className="item-title">{_('W')}:</span>
                {party.woman_cost} {'Rub'}
              </ListGroup.Item>
            </ListGroup>
          </div>
        )}
        {party.pk && isParticipantOrOpen(party) && (
          <PartyMedia party={party} user={user} />
        )}
      </div>
      <Modal size="lg" show={showMap} onHide={() => toggleShowMap(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-map" /> {_('Map')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BlockMap geo={party.geo} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PartyDetail;

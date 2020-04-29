import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { Helmet } from 'react-helmet-async';
import {
  Nav,
  Badge,
  OverlayTrigger,
  Popover,
  ListGroup,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { useMutate } from 'restful-react';

import { ROLE_MODERATOR } from 'generic/constants';
import { CountersContext } from 'generic/containers/ContextProviders/CountersService';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import { StatesContext } from 'generic/containers/ContextProviders/StatesService';
import Image from 'generic/components/Image';
import userSVG from 'generic/layout/images/user.svg';
import Header from 'mobile/containers/Header';

import { _ } from 'trans';
import { CLIENT_URLS } from 'mobile/routes/client';
import { SERVER_URLS } from 'routes/server';
import { getLocale, changeLocale } from 'utils';

const Menu: React.SFC<any> = () => {
  const history = useHistory();
  const states = useContext(StatesContext) || {
    isDisplayImages: false,
    toggleDisplayImages: () => {
      return;
    },
  };
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};
  const countersData = useContext(CountersContext) || {
    counters: {},
  };
  const counters = countersData.counters || {};

  const { mutate: serverSignOut } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.SIGN_OUT.buildPath(),
  });

  const signOut = () => {
    serverSignOut({}).then((result: any) => {
      history.push({
        pathname: CLIENT_URLS.AUTH.SIGN_IN.buildPath(),
      });
      userAuth.refetchHeaderUser();
    });
  };

  const locale = getLocale();
  const code2 = locale === 'en' ? 'gb' : locale;

  const isModerator = () => {
    return user.role === ROLE_MODERATOR;
  };

  return (
    <div className="container-menu">
      <Helmet>
        <title>{_('User menu')}</title>
        <meta name="description" content={_('User menu')} />
      </Helmet>
      <Header name={_('User menu')}>
        {isModerator() && (
          <div>
            <Link to={CLIENT_URLS.MODERATOR.MENU.buildPath()}>
              <i
                className={`fa fa-cogs ${
                  counters.m_notifications > 0 ? 'text-notification' : ''
                }`}
              />{' '}
            </Link>
          </div>
        )}
        <div>
          <OverlayTrigger
            trigger="click"
            rootClose={true}
            placement="left"
            overlay={
              <Popover id="popover-basic">
                <Popover.Content>
                  <ListGroup variant="flush">
                    <ListGroup.Item
                      onClick={() =>
                        changeLocale('ru', CLIENT_URLS.USER.MENU.buildPath())
                      }
                    >
                      <span className="flag-icon flag-icon-ru" />
                    </ListGroup.Item>
                    <ListGroup.Item
                      onClick={() =>
                        changeLocale('en', CLIENT_URLS.USER.MENU.buildPath())
                      }
                    >
                      <span className="flag-icon flag-icon-gb" />
                    </ListGroup.Item>
                  </ListGroup>
                </Popover.Content>
              </Popover>
            }
          >
            <span className={`flag-icon flag-icon-${code2}`} />
          </OverlayTrigger>
        </div>
        <div>
          <i
            onClick={states.toggleDisplayImages}
            className={`fa fa-photo ${
              !states.isDisplayImages ? 'text-notification' : ''
            }`}
          />
        </div>
      </Header>
      <div className="block">
        <div className="profile d-flex">
          <Image
            width={50}
            height={50}
            src={
              user.avatar && user.avatar.thumbnail_100x100
                ? user.avatar.thumbnail_100x100
                : userSVG
            }
            roundedCircle={true}
          />
          <Link
            to={CLIENT_URLS.USER.PROFILE.buildPath({
              userSlug: user.slug,
            })}
          >
            {user.name}
            <br />
            <span>{_('Go to profile')}</span>
          </Link>
        </div>
      </div>
      <div className="block">
        <Nav className="flex-column">
          <LinkContainer to={CLIENT_URLS.USER.FRIEND_LIST.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-users" /> {_('Friends')}{' '}
              {counters.u_friends_requests > 0 ? (
                <Badge variant="primary">{counters.u_friends_requests}</Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.USER.CLUB_LIST.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-venus-mars" /> {_('Clubs')}{' '}
              {counters.u_clubs_requests > 0 ? (
                <Badge variant="primary">{counters.u_clubs_requests}</Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.USER.GROUP_LIST.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-copy" /> {_('Groups')}{' '}
              {counters.u_groups_requests > 0 ? (
                <Badge variant="primary">{counters.u_groups_requests}</Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.USER.PARTY_LIST.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-calendar" /> {_('Parties')}{' '}
              {counters.u_events > 0 ? (
                <Badge variant="primary">{counters.u_events}</Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.USER.MEDIA_FOLDER_LIST.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-photo" /> {_('Media folders')}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.USER.GAME_LIST.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-gamepad" /> {_('Games')}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.USER.BLACKLIST_LIST.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-eye-slash" /> {_('Black list')}
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </div>
      <div className="block">
        <h2>{_('VTeme content')}</h2>
        <Nav className="flex-column">
          <LinkContainer to={CLIENT_URLS.WHISPER.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-eye-slash" /> {_('Whisper')}{' '}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.POSTS.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-book" /> {_('Articles')}{' '}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.MEDIA.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-photo" /> {_('Media (photos and videos)')}{' '}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.MAP.buildPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-map" /> {_('Map (parties and clubs)')}{' '}
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </div>
      <div className="block">
        <Nav className="flex-column">
          <LinkContainer to={CLIENT_URLS.USER.SETTINGS.buildPath()}>
            <Nav.Link>
              <i className="fa fa-cogs" /> {_('Settings')}
            </Nav.Link>
          </LinkContainer>
          <Nav.Link onClick={() => signOut()}>
            <i className="fa fa-sign-out" /> {_('Sign Out')}
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
};

export default Menu;

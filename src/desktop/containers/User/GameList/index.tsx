import React from 'react';
import { Card, Nav, Media, Button, Row, Col } from 'react-bootstrap';
import { RouteComponentProps as IPropsWrapper } from 'react-router';

import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import Image from 'generic/components/Image';
import defaultSVG from 'generic/layout/images/picture.svg';
import List from 'desktop/containers/Generics/List';
import Delete from 'desktop/containers/Generics/Delete';
import { renderHtml } from 'utils';
import { HeaderUserConsumer } from 'generic/containers/ContextProviders/HeaderUserService';
import { _ } from 'trans';

interface IProps extends IPropsWrapper {
  headerUser: any;
  refetchHeaderUser: any;
}

class GameList extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    if (queryParams.is_participant === 'true') {
      return _('Last games');
    }
    return _('Search a game');
  };

  public onDeleteSuccess = (result: any, refetch: any) => {
    refetch();
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    const user = this.props.headerUser;
    const isCreator = item.creator === user.pk;
    return (
      <Col lg={12} className="games-item-container">
        <Media>
          <div>
            <Link
              to={CLIENT_URLS.USER.GAME_DETAIL.buildPath({
                gameSlug: item.slug,
              })}
            >
              {item.image && item.image.thumbnail_500x500 ? (
                <Image
                  width={125}
                  height={125}
                  className="mr-3"
                  src={item.image.thumbnail_500x500}
                />
              ) : (
                <Image
                  width={125}
                  height={125}
                  className="mr-3"
                  src={defaultSVG}
                />
              )}
            </Link>
          </div>
          <Media.Body>
            <Row className="games-item-data">
              <Col lg={7}>
                <Link
                  to={CLIENT_URLS.USER.GAME_DETAIL.buildPath({
                    gameSlug: item.slug,
                  })}
                >
                  <span className="text-break">{item.name}</span>
                </Link>
                <div className="text-break games-item-players">
                  <i className="fa fa-users" /> {item.players_count}{' '}
                  {_('already playing')}
                </div>
                <div className="games-item-description">
                  {renderHtml(item.description)}
                </div>
              </Col>
              <Col lg={5} className="games-item-actions">
                <LinkContainer
                  to={CLIENT_URLS.USER.GAME_PLAY.buildPath({
                    gameSlug: item.slug,
                  })}
                >
                  <Button size="sm">
                    <i className="fa fa-play" /> {_('Play')}
                  </Button>
                </LinkContainer>
                {isCreator ? (
                  <>
                    <LinkContainer
                      to={CLIENT_URLS.USER.GAME_UPDATE.buildPath({
                        gameSlug: item.slug,
                      })}
                    >
                      <Button size="sm">
                        <i className="fa fa-pencil" />
                      </Button>
                    </LinkContainer>
                    <Delete
                      title={_('Are you sure?')}
                      description={_(
                        'Are you sure you want to delete the game?',
                      )}
                      onSuccess={(result: any) =>
                        this.onDeleteSuccess(result, refetch)
                      }
                      destoryServerPath={SERVER_URLS.GAME_DELETE.buildPath({
                        gameSlug: item.slug,
                      })}
                      method="PATCH"
                    >
                      <Button size="sm" variant="danger">
                        <i className="fa fa-trash" />
                      </Button>
                    </Delete>
                  </>
                ) : null}
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
      <Card>
        <Card.Body>
          <Card.Title />
          <Nav className="flex-column">
            <LinkContainer to={CLIENT_URLS.USER.GAME_LIST.buildPath()}>
              <Nav.Link>
                <i className="fa fa-search" /> {_('Search a game')}
              </Nav.Link>
            </LinkContainer>
            <LinkContainer
              to={CLIENT_URLS.USER.GAME_LIST.buildPath({
                queryParams: { is_participant: true },
              })}
            >
              <Nav.Link>
                <i className="fa fa-gamepad" /> {_('Last games')}
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Card.Body>
      </Card>
    );
  };

  public render() {
    return (
      <List
        listClientPath={CLIENT_URLS.USER.GAME_LIST.buildPath()}
        listServerPath={SERVER_URLS.GAME_LIST}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }
}

const GameListWrapper: React.FC<IPropsWrapper> = (props) => (
  <HeaderUserConsumer>
    {(contextHeaderUser) =>
      contextHeaderUser && (
        <GameList
          {...props}
          headerUser={contextHeaderUser.headerUser}
          refetchHeaderUser={contextHeaderUser.refetchHeaderUser}
        />
      )
    }
  </HeaderUserConsumer>
);

export default GameListWrapper;

import React from 'react';
import compose from 'lodash/flowRight';
import {
  Card,
  Nav,
  NavDropdown,
  Alert,
  ButtonGroup,
  Button,
} from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import BlockMediaFolders from 'desktop/components/BlockMediaFolders';
import {
  PERMISSION_NO_USERS,
  PERMISSION_ONLY_FRIENDS,
  PERMISSION_ALL_USERS,
} from 'generic/constants';
import { _ } from 'trans';
import { withAuthUser } from 'generic/containers/Decorators';
import { LinkContainer } from 'react-router-bootstrap';
import { CLIENT_URLS } from 'desktop/routes/client';

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
}

class MediaFolderList extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    let mediaType = null;
    switch (queryParams.show_media) {
      case PERMISSION_NO_USERS:
        mediaType = <i className="fa fa-eye-slash" />;
        break;
      case PERMISSION_ONLY_FRIENDS:
        mediaType = <i className="fa fa-users" />;
        break;
      case PERMISSION_ALL_USERS:
        mediaType = <i className="fa fa-eye" />;
        break;
      default:
        break;
    }
    return (
      <>
        {mediaType} {_('Media folders')}
      </>
    );
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            <i className="fa fa-filter" /> {_('Filters')}
          </Card.Title>
          <Nav className="flex-column">
            <Nav.Link
              onClick={() => onChangequeryParams({ show_media: undefined })}
            >
              <i className="fa fa-copy" /> {_('All folders')}
            </Nav.Link>
            <NavDropdown.Divider />
            <Nav.Link
              onClick={() =>
                onChangequeryParams({ show_media: PERMISSION_NO_USERS })
              }
            >
              <i className="fa fa-eye-slash" /> {_('No one has an access')}
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                onChangequeryParams({ show_media: PERMISSION_ONLY_FRIENDS })
              }
            >
              <i className="fa fa-users" /> {_('Only for friends')}
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                onChangequeryParams({ show_media: PERMISSION_ALL_USERS })
              }
            >
              <i className="fa fa-eye" /> {_('Everyone has an access')}
            </Nav.Link>
          </Nav>
        </Card.Body>
      </Card>
    );
  };

  public renderNoItems = () => {
    return (
      <Alert variant="warning">
        <div>{_("You don't have media folders.")}</div>
        <hr />
        <div className="d-flex">
          <ButtonGroup vertical={true}>
            <LinkContainer
              to={CLIENT_URLS.USER.MEDIA_FOLDER_CREATE.buildPath()}
            >
              <Button size="sm" variant="warning">
                <i className="fa fa-plus" /> {_('Create a media folder')}
              </Button>
            </LinkContainer>
          </ButtonGroup>
        </div>
      </Alert>
    );
  };

  public render() {
    const user = this.props.authUser.user;
    return (
      <BlockMediaFolders
        objectId={user.pk}
        contentType="users:user"
        renderTitle={this.renderTitle}
        renderFilters={this.renderFilters}
        renderNoItems={this.renderNoItems}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: 'authUser',
});

export default compose(withAuth)(MediaFolderList);

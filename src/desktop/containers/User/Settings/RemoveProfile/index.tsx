import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { Button, Card } from 'react-bootstrap';
import { useMutate } from 'restful-react';
import { Row, Col } from 'react-bootstrap';

import { CLIENT_URLS } from 'desktop/routes/client';

import { _ } from 'trans';

import { SERVER_URLS } from 'routes/server';
import Delete from 'desktop/containers/Generics/Delete';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';

const RemoveProfile = () => {
  const history = useHistory();
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};
  const { mutate: serverSignOut } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.SIGN_OUT.buildPath(),
  });
  return (
    <Row>
      <Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title className="float-left">
              <div className="object-title">{_('Remove your profile')}</div>
            </Card.Title>
          </Card.Header>
          <Card.Body className="object-update">
            <Delete
              description={_('Are you sure you want to delete the profile?')}
              onSuccess={() => {
                serverSignOut({}).then(() => {
                  history.push({
                    pathname: CLIENT_URLS.AUTH.SIGN_IN.buildPath(),
                  });
                  userAuth.refetchHeaderUser();
                });
              }}
              destoryServerPath={SERVER_URLS.PROFILE_DELETE.buildPath({
                userSlug: user.slug,
              })}
              method="PATCH"
            >
              <Button variant="danger" className="float-right">
                <i className="fa fa-trash" /> {_('Delete you profile')}
              </Button>
            </Delete>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RemoveProfile;

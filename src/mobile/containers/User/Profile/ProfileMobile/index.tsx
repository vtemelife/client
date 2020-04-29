/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useGet } from 'restful-react';
import { ListGroup, Modal, Button } from 'react-bootstrap';
import { renderHtml } from 'utils';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';

const ProfileMobile: React.SFC<any> = () => {
  const [showReadme, changeShowReadme] = useState(false);
  const { data: mobileVersion } = useGet({
    path: SERVER_URLS.MOBILE_VERSION.buildPath(),
  });
  if (!mobileVersion || !mobileVersion.android_apk) {
    return null;
  }
  return (
    <div className="profile-info block">
      <h2>
        {_('Download mobile')} <i className="fa fa-exclamation-circle" />
      </h2>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <span className="item-title">
            {_('Android')}({mobileVersion.version}):
          </span>{' '}
          <a download={true} href={mobileVersion.android_apk}>
            {_('Click here to download .apk app')}
          </a>
        </ListGroup.Item>
        {mobileVersion.readme && (
          <ListGroup.Item>
            <span className="item-title">{_('Readme')}:</span>{' '}
            <a href="#" onClick={() => changeShowReadme(true)}>
              {_('How to install APK on Android')}
            </a>
          </ListGroup.Item>
        )}
      </ListGroup>
      <Modal size="lg" show={showReadme} onHide={() => changeShowReadme(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-bars" /> {_('Readme')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderHtml(mobileVersion.readme)}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => changeShowReadme(false)} variant="secondary">
            {_('Close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileMobile;

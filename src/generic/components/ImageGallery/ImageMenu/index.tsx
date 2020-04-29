import React, { useState } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';

import { _ } from 'trans';
import { CLIENT_URLS } from 'mobile/routes/client';
import { handleSuccess, handleErrors } from 'utils';
import { confirmAlert } from 'react-confirm-alert';

const ImageMenu: React.SFC<any> = ({
  currentImage,
  publicOnSite,
  imageDelete,
  refetch,
  history,
}) => {
  const [showImageMenu, toggleShowImageMenu] = useState(false);
  return (
    <>
      <button
        key="bars"
        className="gallery-control"
        onClick={() => toggleShowImageMenu(true)}
      >
        <i className="fa fa-bars fa-lg" />
      </button>
      <Modal
        size="lg"
        className="modal-media-menu"
        show={showImageMenu}
        onHide={() => toggleShowImageMenu(false)}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-bars" /> {_('Menu')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            {!currentImage.status && (
              <ListGroup.Item
                onClick={() => {
                  confirmAlert({
                    title: _('Are you sure?'),
                    message: _(
                      'Are you sure that you want to publish your photo in VTEME CONTENT menu for all users on site?',
                    ),
                    buttons: [
                      {
                        label: _('Yes'),
                        onClick: () => {
                          publicOnSite({})
                            .then((data: any) => {
                              handleSuccess(
                                _('Sent to moderation. Waiting moderation...'),
                              );
                              toggleShowImageMenu(false);
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
                {_('Publish your photo for all users')}
              </ListGroup.Item>
            )}
            <ListGroup.Item
              onClick={() => {
                history.push(
                  CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_UPDATE.buildPath({
                    mediaPk: currentImage.pk,
                  }),
                );
              }}
            >
              <i className="fa fa-pencil" /> {_('Update')}
            </ListGroup.Item>
            <ListGroup.Item
              className="text-notification"
              onClick={() => {
                confirmAlert({
                  title: _('Are you sure?'),
                  message: _('Are you sure that you want to delete the media?'),
                  buttons: [
                    {
                      label: _('Yes'),
                      onClick: () => {
                        imageDelete({})
                          .then((data: any) => {
                            handleSuccess(_('Deleted successfully.'));
                            toggleShowImageMenu(false);
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
                });
              }}
            >
              <i className="fa fa-trash" /> {_('Delete')}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageMenu;

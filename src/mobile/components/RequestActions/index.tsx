import React from 'react';
import { useMutate } from 'restful-react';
import { ListGroup, OverlayTrigger, Popover } from 'react-bootstrap';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import DeleteItem from 'mobile/components/DeleteItem';
import { REQUEST_APPROVED, REQUEST_DECLINED } from 'generic/constants';

const RequestActions: React.SFC<any> = ({ mine, membershipPk, refetch }) => {
  const { mutate: updateRequest } = useMutate({
    verb: 'PATCH',
    path: SERVER_URLS.MEMBERSHIP_REQUESTS_UPDATE.buildPath({
      membershipPk,
    }),
  });

  return (
    <OverlayTrigger
      trigger="click"
      rootClose={true}
      placement="left"
      overlay={
        <Popover id="popover-basic">
          <Popover.Content>
            <ListGroup variant="flush">
              {mine ? (
                <ListGroup.Item>
                  <DeleteItem
                    description={_(
                      'Are you sure you want to delete the request?',
                    )}
                    onSuccess={() => refetch()}
                    path={SERVER_URLS.MEMBERSHIP_REQUESTS_DELETE.buildPath({
                      membershipPk,
                    })}
                  >
                    <i className="fa fa-trash" /> {_('Drop your request')}
                  </DeleteItem>
                </ListGroup.Item>
              ) : (
                <>
                  <ListGroup.Item
                    onClick={() => {
                      updateRequest({
                        status: REQUEST_APPROVED,
                      }).then((response: any) => {
                        refetch();
                      });
                    }}
                  >
                    <i className="fa fa-check" /> {_('Approve')}
                  </ListGroup.Item>
                  <ListGroup.Item
                    className="text-notification"
                    onClick={() => {
                      updateRequest({
                        status: REQUEST_DECLINED,
                      }).then((response: any) => {
                        refetch();
                      });
                    }}
                  >
                    <i className="fa fa-ban" /> {_('Decline')}
                  </ListGroup.Item>
                </>
              )}
            </ListGroup>
          </Popover.Content>
        </Popover>
      }
    >
      <i className="fa fa-bars fa-lg" />
    </OverlayTrigger>
  );
};

export default RequestActions;

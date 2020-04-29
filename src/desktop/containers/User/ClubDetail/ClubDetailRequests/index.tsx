import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { CLIENT_URLS } from 'desktop/routes/client';

import FormSelect from 'generic/components/Form/FormSelect';
import { getDisplayValue } from 'utils';
import { REQUESTS } from 'generic/constants';
import BlockRequests from 'desktop/components/BlockRequests';
import { _ } from 'trans';

interface IProps extends RouteComponentProps {
  match: any;
}

class ClubDetailRequests extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    return _('Requests to join the club');
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-bars" /> {_('Menu')}
            </Card.Title>
            <Nav className="flex-column">
              <LinkContainer
                to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                  clubSlug: this.props.match.params.clubSlug,
                })}
              >
                <Nav.Link>
                  <i className="fa fa-arrow-left" /> {_('Go back')}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-filter" /> {_('Filters')}
            </Card.Title>
            <FormSelect
              label={_('Request status')}
              name="status"
              isClearable={true}
              options={REQUESTS}
              value={
                queryParams.status
                  ? {
                      value: queryParams.status,
                      display: getDisplayValue(queryParams.status, REQUESTS),
                    }
                  : null
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
      <BlockRequests
        contentType="clubs:club"
        renderTitle={this.renderTitle}
        renderFilters={this.renderFilters}
        size={10}
      />
    );
  }
}

export default ClubDetailRequests;

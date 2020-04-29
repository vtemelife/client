import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from 'react-bootstrap';
import { RouteComponentProps as IProps } from 'react-router';
import BlockPosts from 'desktop/components/BlockPosts';
import { _ } from 'trans';
import {
  POST_THEMES,
  POST_THEME_SWING,
  POST_THEME_SWING_HISTORY,
  POST_THEME_BDSM,
  POST_THEME_BDSM_HISTORY,
  POST_THEME_LGBT,
  POST_THEME_LGBT_HISTORY,
  POST_THEME_SEX,
  POST_THEME_SEX_HISTORY,
} from 'generic/constants';
import { getDisplayValue } from 'utils';
import FormSelect from 'generic/components/Form/FormSelect';

class Posts extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    switch (queryParams.theme) {
      case POST_THEME_SWING:
        return getDisplayValue(POST_THEME_SWING, POST_THEMES);
      case POST_THEME_SWING_HISTORY:
        return getDisplayValue(POST_THEME_SWING_HISTORY, POST_THEMES);
      case POST_THEME_BDSM:
        return getDisplayValue(POST_THEME_BDSM, POST_THEMES);
      case POST_THEME_BDSM_HISTORY:
        return getDisplayValue(POST_THEME_BDSM_HISTORY, POST_THEMES);
      case POST_THEME_LGBT:
        return getDisplayValue(POST_THEME_LGBT, POST_THEMES);
      case POST_THEME_LGBT_HISTORY:
        return getDisplayValue(POST_THEME_LGBT_HISTORY, POST_THEMES);
      case POST_THEME_SEX:
        return getDisplayValue(POST_THEME_SEX, POST_THEMES);
      case POST_THEME_SEX_HISTORY:
        return getDisplayValue(POST_THEME_SEX_HISTORY, POST_THEMES);
      default:
        return _('Articles');
    }
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    return (
      <Card>
        <Helmet>
          <title>{_('Posts')}</title>
          <meta name="description" content={_('Posts')} />
        </Helmet>
        <Card.Body>
          <Card.Title>
            <i className="fa fa-tags" /> {_('Theme')}
          </Card.Title>
          <FormSelect
            label={_('Theme')}
            name="theme"
            isClearable={true}
            options={[
              {
                value: POST_THEME_SWING,
                display: this.renderTitle({ theme: POST_THEME_SWING }),
              },
              {
                value: POST_THEME_SWING_HISTORY,
                display: this.renderTitle({ theme: POST_THEME_SWING_HISTORY }),
              },
              {
                value: POST_THEME_BDSM,
                display: this.renderTitle({ theme: POST_THEME_BDSM }),
              },
              {
                value: POST_THEME_BDSM_HISTORY,
                display: this.renderTitle({ theme: POST_THEME_BDSM_HISTORY }),
              },
              {
                value: POST_THEME_LGBT,
                display: this.renderTitle({ theme: POST_THEME_LGBT }),
              },
              {
                value: POST_THEME_LGBT_HISTORY,
                display: this.renderTitle({ theme: POST_THEME_LGBT_HISTORY }),
              },
              {
                value: POST_THEME_SEX,
                display: this.renderTitle({ theme: POST_THEME_SEX }),
              },
              {
                value: POST_THEME_SEX_HISTORY,
                display: this.renderTitle({ theme: POST_THEME_SEX_HISTORY }),
              },
            ]}
            value={
              queryParams.theme
                ? {
                    value: queryParams.theme,
                    display: this.renderTitle({ theme: queryParams.theme }),
                  }
                : null
            }
            onChange={(target: any) =>
              onChangequeryParams({
                theme: target.value ? target.value.value : undefined,
              })
            }
          />
        </Card.Body>
      </Card>
    );
  };

  public render() {
    return (
      <BlockPosts
        isReadonly={true}
        renderTitle={this.renderTitle}
        renderFilters={this.renderFilters}
        defaultqueryParams={{ status: 'approved', is_whisper: false }}
      />
    );
  }
}

export default Posts;

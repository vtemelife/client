import React from "react";
import compose from "lodash/flowRight";
import { Card } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { Helmet } from "react-helmet-async";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import List from "desktop/containers/Generics/List";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import FormCheckBoxes from "generic/components/Form/FormCheckBoxes";
import { USER_GENDER, USER_THEMES } from "generic/constants";
import { getUserFormats } from "../User/Profile/utils";
import { _ } from "trans";

import SearchItem from "./SearchItem";
import { withAuthUser } from "generic/containers/Decorators";

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
}

class Search extends React.PureComponent<IProps> {
  public renderTitle = (getParams: any) => {
    return _("Search friends");
  };

  public renderItem = (item: any, getParams: any, refetch: any) => {
    return <SearchItem item={item} refetch={refetch} />;
  };

  public renderFilters = (getParams: any, onChangeGetParams: any) => {
    const userFormats = getUserFormats(
      getParams.gender,
      getParams.relationship_themes
    );
    const user = this.props.authUser.user;
    return (
      <Card>
        <Helmet>
          <title>{_("Search")}</title>
          <meta name="description" content={_("Search")} />
        </Helmet>
        <Card.Body className="search-filter">
          <Card.Title>
            <i className="fa fa-filter" /> {_("Filters")}
          </Card.Title>
          <br />
          <FormAsyncSelect
            label={_("Country")}
            placeholder={_("Start typing...")}
            name="city__country"
            defaultValue={
              user.city && user.city.country
                ? {
                    pk: user.city.country.pk,
                    name: user.city.country.name
                  }
                : null
            }
            onChange={(target: any) =>
              onChangeGetParams({
                city__country: target.value ? target.value.pk : undefined
              })
            }
            fetchURL={SERVER_URLS.SELECTS.COUNTRY.buildPath()}
          />
          <FormAsyncSelect
            label={_("Region/State")}
            placeholder={_("Start typing...")}
            name="city__region"
            defaultValue={
              user.city && user.city.region
                ? {
                    pk: user.city.region.pk,
                    name: user.city.region.name
                  }
                : null
            }
            onChange={(target: any) =>
              onChangeGetParams({
                city__region: target.value ? target.value.pk : undefined
              })
            }
            fetchURL={SERVER_URLS.SELECTS.REGION.buildPath()}
            filterURL={`country=${
              getParams.city__country
                ? getParams.city__country
                : user.city.country.pk
            }`}
          />
          <FormAsyncSelect
            label={_("City")}
            placeholder={_("Start typing...")}
            name="city"
            onChange={(target: any) =>
              onChangeGetParams({
                city: target.value ? target.value.pk : undefined
              })
            }
            fetchURL={SERVER_URLS.SELECTS.CITY.buildPath()}
            filterURL={`region=${
              getParams.city__region
                ? getParams.city__region
                : user.city.region.pk
            }`}
          />
          <FormCheckBoxes
            type="checkbox"
            name="is_online"
            label={_("Online")}
            checkboxes={[{ value: "true", display: _("Online") }]}
            value={getParams.is_online ? getParams.is_online.split(",") : []}
            onChange={(target: any) => {
              onChangeGetParams({
                is_online: this.selectValues(target, getParams.is_online || "")
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="is_real"
            label={_("Real status")}
            checkboxes={[{ value: "true", display: _("Real status") }]}
            value={getParams.is_real ? getParams.is_real.split(",") : []}
            onChange={(target: any) => {
              onChangeGetParams({
                is_real: this.selectValues(target, getParams.is_real || "")
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="relationship_themes"
            label={_("Theme")}
            checkboxes={USER_THEMES}
            value={
              getParams.relationship_themes
                ? getParams.relationship_themes.split(",")
                : []
            }
            onChange={(target: any) => {
              onChangeGetParams({
                relationship_themes: this.selectValues(
                  target,
                  getParams.relationship_themes || ""
                )
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="relationship_formats"
            label={_("Format")}
            checkboxes={userFormats}
            value={
              getParams.relationship_formats
                ? getParams.relationship_formats.split(",")
                : []
            }
            onChange={(target: any) => {
              onChangeGetParams({
                relationship_formats: this.selectValues(
                  target,
                  getParams.relationship_formats || ""
                )
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="gender"
            label={_("Gender")}
            checkboxes={USER_GENDER}
            value={getParams.gender ? getParams.gender.split(",") : []}
            onChange={(target: any) => {
              onChangeGetParams({
                gender: this.selectValues(target, getParams.gender || "")
              });
            }}
          />
        </Card.Body>
      </Card>
    );
  };

  public render() {
    return (
      <List
        listClientPath={CLIENT_URLS.SEARCH.buildPath()}
        listServerPath={SERVER_URLS.FRIENDS_SEARCH}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }

  private selectValues = (target: any, stringValues: any) => {
    const values = stringValues.length === 0 ? [] : stringValues.split(",");
    const el = target.target;
    if (el.checked) {
      return [...values, el.id].join(",");
    }
    return values.filter((item: string) => item !== el.id).join(",");
  };
}

const withAuth = withAuthUser({
  propName: "authUser"
});

export default compose(withAuth)(Search);

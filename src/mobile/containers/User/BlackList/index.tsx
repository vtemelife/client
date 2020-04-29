import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { InputGroup, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGet } from "restful-react";

import Image from "generic/components/Image";
import userSVG from "generic/layout/images/user.svg";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "mobile/routes/client";
import Header from "mobile/containers/Header";
import PaginateList from "generic/components/PaginateList";

import { _ } from "trans";
import DeleteItem from "mobile/components/DeleteItem";

interface IProps {
  authUser: any;
  countersData: any;
}

const BlackList: React.SFC<IProps> = () => {
  const [search, changeSearch] = useState("");
  const [offset, changeOffset] = useState(0);

  const getParams = {
    search
  };
  const { data: blacklistData, loading, refetch } = useGet({
    path: SERVER_URLS.BLACKLIST_LIST.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const blacklistItems = (blacklistData || {}).results || [];
  const blacklistCount = (blacklistData || {}).count || 0;

  const title = _("Black list");
  return (
    <div className="container-blacklist">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${blacklistCount > 0 ? `(${blacklistCount})` : ""}`}
        fixed={true}
      />
      <div className="blacklist-search">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="search">
              <i className="fa fa-search" />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text-break"
            placeholder={_("Start input here")}
            aria-describedby="search"
            value={search}
            onChange={(event: any) => changeSearch(event.target.value)}
          />
        </InputGroup>
      </div>
      <div className="blacklist-list">
        {!loading && blacklistItems.length === 0 && (
          <Alert variant="warning">
            <div>{_("No users in black list.")}</div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={blacklistCount}
          objs={blacklistItems}
          loading={loading}
          getParamsHash={JSON.stringify(getParams)}
        >
          {(item: any) => (
            <div className="blacklist-item" key={item.pk}>
              <div className="blacklist-avatar">
                <Link
                  to={CLIENT_URLS.USER.PROFILE.toPath({
                    urlParams: {
                      userSlug: item.user.slug
                    }
                  })}
                >
                  <Image
                    width={50}
                    height={50}
                    src={
                      item.user.avatar && item.user.avatar.thumbnail_100x100
                        ? item.user.avatar.thumbnail_100x100
                        : userSVG
                    }
                    roundedCircle={true}
                  />
                </Link>
              </div>
              <div className="blacklist-body">
                <div className="blacklist-title">
                  <Link
                    to={CLIENT_URLS.USER.PROFILE.toPath({
                      urlParams: {
                        userSlug: item.user.slug
                      }
                    })}
                  >
                    <div className="blacklist-title-name">{item.user.name}</div>
                  </Link>
                  <div className="blacklist-title-time">
                    <DeleteItem
                      description={_(
                        "Are you sure you want to delete the user from the blacklist?"
                      )}
                      onSuccess={() => refetch()}
                      path={SERVER_URLS.BLACKLIST_DELETE.toPath({
                        urlParams: {
                          blacklistPk: item.pk
                        }
                      })}
                    >
                      <i className="fa fa-trash" />
                    </DeleteItem>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PaginateList>
      </div>
    </div>
  );
};

export default BlackList;

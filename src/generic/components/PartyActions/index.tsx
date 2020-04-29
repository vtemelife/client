import React from "react";
import { Dropdown } from "react-bootstrap";
import { useMutate } from "restful-react";
import { SERVER_URLS } from "routes/server";

import {
  PARTY_STATUS_YES,
  PARTY_STATUS_PROBABLY,
  PARTY_STATUS_NO,
  PARTY_STATUS_UNKNOWN,
  PARTY_STATUSES
} from "generic/constants";
import { getDisplayValue, handleErrors } from "utils";
import Loading from "generic/components/Loading";

const PartyActions: React.SFC<any> = ({
  item,
  refetch,
  user,
  disableLoading
}) => {
  const { mutate, loading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.PARTY_APPLY.toPath({
      urlParams: {
        partySlug: item.slug
      }
    })
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case PARTY_STATUS_YES:
        return "primary";
      case PARTY_STATUS_PROBABLY:
        return "warning";
      case PARTY_STATUS_NO:
      case PARTY_STATUS_UNKNOWN:
      default:
        return "danger";
    }
  };

  const changeStatus = (status: string) => {
    mutate({
      user: user.pk,
      status
    })
      .then((result: any) => {
        refetch();
      })
      .catch((errors: any) => {
        handleErrors(errors);
      });
  };

  return (
    <>
      {!disableLoading && loading && <Loading />}
      <Dropdown>
        <Dropdown.Toggle
          variant={getStatusVariant(item.user_status)}
          id="dropdown-party"
          size="sm"
        >
          {getDisplayValue(
            item.user_status || PARTY_STATUS_UNKNOWN,
            PARTY_STATUSES
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {item.user_status !== PARTY_STATUS_YES && (
            <Dropdown.Item onClick={() => changeStatus(PARTY_STATUS_YES)}>
              {getDisplayValue(PARTY_STATUS_YES, PARTY_STATUSES)}
            </Dropdown.Item>
          )}
          {item.user_status !== PARTY_STATUS_PROBABLY && (
            <Dropdown.Item onClick={() => changeStatus(PARTY_STATUS_PROBABLY)}>
              {getDisplayValue(PARTY_STATUS_PROBABLY, PARTY_STATUSES)}
            </Dropdown.Item>
          )}
          {item.user_status !== PARTY_STATUS_NO && (
            <Dropdown.Item onClick={() => changeStatus(PARTY_STATUS_NO)}>
              {getDisplayValue(PARTY_STATUS_NO, PARTY_STATUSES)}
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default PartyActions;

import React from "react";
import { useMutate } from "restful-react";
import { confirmAlert } from "react-confirm-alert";

import { _ } from "trans";

interface IProps {
  children: any;
  description: string;
  path: string;
  verb?: "PATCH" | "POST" | "PUT" | "DELETE";
  onSuccess?: any;
}

const DeleteItem: React.SFC<IProps> = ({
  children,
  description,
  path,
  verb,
  onSuccess
}) => {
  const { mutate: deleteItem } = useMutate({
    verb: verb || "PATCH",
    path
  });

  const onDelete = () => {
    confirmAlert({
      title: _("Are you sure?"),
      message: description,
      buttons: [
        {
          label: _("Yes"),
          onClick: () => {
            deleteItem({}).then((result: any) => {
              onSuccess(result);
            });
          }
        },
        {
          label: _("No"),
          onClick: () => {
            return;
          }
        }
      ]
    });
  };
  return (
    <div
      className="text-notification"
      onClick={() => {
        onDelete();
      }}
    >
      {children}
    </div>
  );
};

export default DeleteItem;

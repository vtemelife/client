import React from "react";
import { Mutate } from "restful-react";
import { confirmAlert } from "react-confirm-alert";
import { _ } from "trans";

interface IPropsWrapper {
  title?: string;
  description?: string;
  destoryServerPath: string;
  onSuccess?: any;
  method?: "PATCH" | "DELETE";
}

interface IProps extends IPropsWrapper {
  destroyResponse: any;
  destroyObject: any;
}

class Delete extends React.PureComponent<IProps> {
  public onClick = () => {
    confirmAlert({
      title: this.props.title || _("Are you sure?"),
      message: this.props.description,
      buttons: [
        {
          label: _("Yes"),
          onClick: () => {
            this.props.destroyObject().then((result: any) => {
              this.props.onSuccess(result);
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

  public render() {
    return (
      <>
        {React.cloneElement(this.props.children as any, {
          onClick: this.onClick
        })}
      </>
    );
  }
}

const DeleteWrapper: React.FC<IPropsWrapper> = props => (
  <Mutate
    verb={props.method ? props.method : "PATCH"}
    path={props.destoryServerPath}
  >
    {(destroyObject, destroyResponse) => (
      <Delete
        {...props}
        destroyObject={destroyObject}
        destroyResponse={destroyResponse}
      />
    )}
  </Mutate>
);

export default DeleteWrapper;

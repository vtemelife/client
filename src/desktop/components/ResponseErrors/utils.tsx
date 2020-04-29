import { toast } from "react-toastify";
import { _ } from "trans";

const handleErrors = (errors: any) => {
  if (errors.status === 403) {
    toast.error(_("You don't have an access"));
  } else if (errors.status === 400) {
    if (errors.data && errors.data.non_field_errors) {
      errors.data.non_field_errors.forEach((error: string) =>
        toast.error(error)
      );
    } else {
      toast.error(errors.message);
    }
  } else {
    toast.error(errors.message);
  }
};

export default handleErrors;

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useGet, useMutate } from "restful-react";
import { useHistory, useParams } from "react-router";
import slugify from "slugify";

import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import Header from "mobile/containers/Header";
import FormInput from "generic/components/Form/FormInput";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import FormFilesUpload from "generic/components/Form/FormFilesUpload";
import { Button } from "react-bootstrap";
import Loading from "generic/components/Loading";
import { handleSuccess, handleErrors } from "utils";
import FormSlug from "generic/components/Form/FormSlug";

const GameUpdate: React.SFC<any> = () => {
  const { gameSlug } = useParams();
  const history = useHistory();

  const { data: gameData, loading: gameLoading } = useGet({
    path: SERVER_URLS.GAME_DETAIL.toPath({
      urlParams: {
        gameSlug
      }
    })
  });

  const [formData, changeFormData] = useState({} as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  useEffect(() => {
    if (!gameData) {
      return;
    }
    const defaultFormData = {
      name: gameData.name || "",
      slug: gameData.slug || "",
      description: gameData.description || "",
      image: gameData.image ? [gameData.image] : [],
      rules: gameData.rules || ""
    } as any;
    changeFormData(defaultFormData);
  }, [gameData, changeFormData]);

  const { mutate: submitForm, loading } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.GAME_UPDATE.toPath({
      urlParams: {
        gameSlug
      }
    })
  });

  if (Object.keys(formData).length === 0) {
    return <Loading />;
  }

  return (
    <div className="container-games-update">
      <Helmet>
        <title>{_("Update the game")}</title>
        <meta name="description" content={_("Update the game")} />
      </Helmet>
      <Header name={_("Update the game")} fixed={true} />
      <div className="games-update">
        {(gameLoading || loading) && <Loading />}
        <FormInput
          label={`${_("Name")}*:`}
          type="text-break"
          name="name"
          required={true}
          value={formData.name}
          errors={formErrors.name}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              name: target.target.value,
              slug: slugify(target.target.value)
            });
          }}
        />
        <FormSlug
          label={`${_("Slug")}*:`}
          type="text-break"
          name="slug"
          required={true}
          value={formData.slug}
          errors={formErrors.slug}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              slug: target.value
            });
          }}
        />
        <FormRichEditor
          label={`${_("Description")}:`}
          name="description"
          value={formData.description}
          errors={formErrors.description}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              description: target.value
            })
          }
        />
        <FormFilesUpload
          label={`${_("Image")}:`}
          multiple={false}
          name="image"
          description={_("Click here to choose your image")}
          errors={formErrors.image}
          value={formData.image}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              image: target.value
            })
          }
        />
        <FormRichEditor
          label={`${_("Rules")}:`}
          name="rules"
          value={formData.rules}
          errors={formErrors.rules}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              rules: target.value
            })
          }
        />
        <Button
          className="form-button"
          onClick={() => {
            submitForm({
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
              image:
                formData.image && formData.image.length > 0
                  ? formData.image[0].pk
                  : undefined,
              rules: formData.rules
            })
              .then((data: any) => {
                handleSuccess(_("Updated successfully."));
                history.goBack();
              })
              .catch((errors: any) => {
                handleErrors(errors, changeFormErrors);
              });
          }}
        >
          <i className="fa fa-save fa-lg" />
        </Button>
      </div>
    </div>
  );
};

export default GameUpdate;

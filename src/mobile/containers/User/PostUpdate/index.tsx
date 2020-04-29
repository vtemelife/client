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

const PostUpdate: React.SFC<any> = () => {
  const { postSlug } = useParams();
  const history = useHistory();

  const { data: postData, loading: postLoading } = useGet({
    path: SERVER_URLS.POSTS_DETAIL.toPath({
      urlParams: {
        postSlug
      }
    })
  });

  const [formData, changeFormData] = useState({} as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  useEffect(() => {
    if (!postData) {
      return;
    }
    const defaultFormData = {
      title: postData.title || "",
      slug: postData.slug || "",
      image: postData.image ? [postData.image] : [],
      description: postData.description || "",
      post: postData.post || "",
      hash_tags: postData.hash_tags.map((item: string) => `#${item}`).join(" ")
    } as any;
    changeFormData(defaultFormData);
  }, [postData, changeFormData]);

  const { mutate: submitForm, loading } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.POSTS_UPDATE.toPath({
      urlParams: {
        postSlug
      }
    })
  });

  if (Object.keys(formData).length === 0) {
    return <Loading />;
  }

  return (
    <div className="container-posts-update">
      <Helmet>
        <title>{_("Update the post")}</title>
        <meta name="description" content={_("Update the post")} />
      </Helmet>
      <Header name={_("Update the post")} fixed={true} />
      <div className="posts-update">
        {(postLoading || loading) && <Loading />}
        <FormInput
          label={`${_("Title")}*:`}
          type="text-break"
          name="title"
          required={true}
          value={formData.title}
          errors={formErrors.title}
          onChange={(target: any) => {
            changeFormData({
              ...formData,
              title: target.target.value,
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
          label={`${_("Short description (in list)")}*:`}
          name="description"
          required={true}
          value={formData.description}
          errors={formErrors.description}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              description: target.value
            })
          }
        />
        <FormRichEditor
          label={`${_("Post")}*:`}
          name="post"
          richToolbar={true}
          required={true}
          value={formData.post}
          errors={formErrors.post}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              post: target.value
            })
          }
        />
        <FormInput
          label={`${_("Hash tags")}:`}
          type="text-break"
          name="hash_tags"
          value={formData.hash_tags}
          errors={formErrors.hash_tags}
          onChange={(target: any) =>
            changeFormData({
              ...formData,
              hash_tags: target.target.value
            })
          }
        />
        <Button
          className="form-button"
          onClick={() => {
            submitForm({
              title: formData.title,
              slug: formData.slug,
              image:
                formData.image && formData.image.length > 0
                  ? formData.image[0].pk
                  : undefined,
              description: formData.description,
              post: formData.post,
              hash_tags: formData.hash_tags
                .split("#")
                .map((el: string) => el.trim())
                .filter((el: string) => el.length > 0)
            })
              .then((data: any) => {
                handleSuccess(_("Created successfully."));
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

export default PostUpdate;

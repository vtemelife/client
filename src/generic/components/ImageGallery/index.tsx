import React, { useState, useContext, useEffect } from "react";
import Gallery from "react-grid-gallery";
import { useHistory } from "react-router";
import { useMutate } from "restful-react";
import { StatesContext } from "generic/containers/ContextProviders/StatesService";
import hideSVG from "generic/layout/images/hide.svg";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";

import { ROLE_MODERATOR } from "generic/constants";
import { SERVER_URLS } from "routes/server";

import ImageViews from "./ImageViews";
import ImageLikes from "./ImageLikes";
import ImageComments from "./ImageComments";
import ImageMenu from "./ImageMenu";
import { CLIENT_URLS } from "desktop/routes/client";

const ImageGallery: React.SFC<any> = ({
  mediaItems,
  refetch,
  size,
  openMediaPk
}) => {
  const history = useHistory();
  const states = useContext(StatesContext) || {
    isDisplayImages: false
  };
  const [images, changeImages] = useState([] as any);
  const isDisplayImages = states.isDisplayImages;

  useEffect(() => {
    const convertMediaItems = (items: any) => {
      return items.map((item: any, index: number) => {
        return {
          src: isDisplayImages && item.image ? item.image.image : hideSVG,
          thumbnail:
            isDisplayImages && item.image
              ? item.image.thumbnail_500x500
              : hideSVG,
          thumbnailWidth: size ? size : 500,
          thumbnailHeight: size ? size : 500,
          caption: (
            <span>
              {item.title ? <>{item.title} - </> : ""}
              <a
                href={CLIENT_URLS.USER.PROFILE.buildPath({
                  userSlug: item.creator.slug
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.creator.name}
              </a>
            </span>
          ),
          image: item,
          pk: item.pk
        };
      });
    };
    if (mediaItems.length !== images.length) {
      changeImages(convertMediaItems(mediaItems));
    }
  }, [size, isDisplayImages, images, mediaItems]);

  const defaultImage = {
    views: 0,
    likes: [],
    comments_count: 0,
    pk: null
  };
  const [currentImage, changeCurrentImage] = useState(defaultImage);

  const { mutate: likeAction } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.MEDIA_LIKE.toPath({
      urlParams: {
        mediaPk: currentImage.pk
      }
    })
  });
  const { mutate: publicOnSite } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.MEDIA_TO_MODERATE_MEDIA_SECTION.toPath({
      urlParams: {
        mediaPk: currentImage.pk
      }
    })
  });
  const { mutate: imageDelete } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.MEDIA_DELETE.toPath({
      urlParams: {
        mediaPk: currentImage.pk
      }
    })
  });

  const { mutate: sendComment } = useMutate({
    verb: "POST",
    path: SERVER_URLS.COMMENT_CREATE.toPath()
  });

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};

  const isCreator = (item: any) => {
    return item.creator === user.pk || user.role === ROLE_MODERATOR;
  };

  return (
    <div onContextMenu={(e: any) => e.preventDefault()}>
      <Gallery
        images={images}
        enableImageSelection={false}
        currentImageWillChange={(index: number) => {
          const imageObj = images[index];
          changeCurrentImage(imageObj ? imageObj.image : defaultImage);
        }}
        lightboxWillOpen={() => {
          const timerId = setInterval(() => {
            const lightBox = document.getElementById("lightboxBackdrop");
            if (lightBox) {
              lightBox.oncontextmenu = (e: any) => e.preventDefault();
              clearInterval(timerId);
            }
          }, 100);
          setTimeout(() => {
            clearInterval(timerId);
          }, 5000);
        }}
        isOpen={!!openMediaPk}
        currentImage={images.findIndex((i: any) => i.pk === openMediaPk) || 0}
        customControls={
          isCreator(currentImage)
            ? [
                <ImageViews key="views" currentImage={currentImage} />,
                <ImageLikes
                  key="likes"
                  currentImage={currentImage}
                  likeAction={likeAction}
                  changeCurrentImage={changeCurrentImage}
                  changeImages={changeImages}
                  images={images}
                />,
                <ImageComments
                  key="comments"
                  currentImagePk={currentImage.pk}
                  defaultCommentsCount={currentImage.comments_count}
                  sendComment={sendComment}
                />,
                <ImageMenu
                  key="media-menu"
                  currentImage={currentImage}
                  publicOnSite={publicOnSite}
                  imageDelete={imageDelete}
                  refetch={refetch}
                  history={history}
                />
              ]
            : [
                <ImageViews key="views" currentImage={currentImage} />,
                <ImageLikes
                  key="likes"
                  currentImage={currentImage}
                  likeAction={likeAction}
                  changeCurrentImage={changeCurrentImage}
                  changeImages={changeImages}
                  images={images}
                />,
                <ImageComments
                  key="comments"
                  currentImagePk={currentImage.pk}
                  defaultCommentsCount={currentImage.comments_count}
                  sendComment={sendComment}
                />
              ]
        }
      />
    </div>
  );
};

const ImageGalleryWrapper: React.SFC<any> = props => {
  if (!props.mediaItems || props.mediaItems.length === 0) {
    return null;
  }
  return <ImageGallery {...props} />;
};

export default ImageGalleryWrapper;

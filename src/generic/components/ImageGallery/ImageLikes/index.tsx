import React from "react";

const ImageLikes: React.SFC<any> = ({
  currentImage,
  likeAction,
  changeCurrentImage,
  changeImages,
  images
}) => {
  return (
    <button
      key="likes"
      onClick={() => {
        likeAction({}).then((result: any) => {
          const newCurrentImage = { ...currentImage, likes: result.likes };
          changeCurrentImage(newCurrentImage);
          changeImages(
            images.map((image: any) => {
              if (image.image.pk === currentImage.pk) {
                return { ...image, image: newCurrentImage };
              }
              return image;
            })
          );
        });
      }}
      className="gallery-control"
    >
      <i className="fa fa-heart fa-lg" />{" "}
      <span>{currentImage.likes.length}</span>
    </button>
  );
};

export default ImageLikes;

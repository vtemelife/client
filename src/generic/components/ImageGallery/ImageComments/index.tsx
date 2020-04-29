import React, { useState } from "react";
import ModalComments from "generic/components/ModalComments";

const ImageComments: React.SFC<any> = ({
  currentImagePk,
  defaultCommentsCount,
  sendComment
}) => {
  const [showComments, toggleShowComments] = useState(false);
  const [commentsCount, changeCommentsCount] = useState(defaultCommentsCount);
  return (
    <>
      <button
        key="comments"
        onClick={() => toggleShowComments(true)}
        className="gallery-control"
      >
        <i className="fa fa-comments fa-lg" /> <span>{commentsCount}</span>
      </button>
      <ModalComments
        showComments={showComments}
        toggleShowComments={toggleShowComments}
        contentType={"media:media"}
        objectId={currentImagePk}
        onSuccess={() => changeCommentsCount(commentsCount + 1)}
        sendComment={sendComment}
      />
    </>
  );
};

export default ImageComments;

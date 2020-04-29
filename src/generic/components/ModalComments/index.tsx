import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";

import { _ } from "trans";
import { useGet } from "restful-react";
import { SERVER_URLS } from "routes/server";
import FormMsgArea from "generic/components/Form/FormMsgArea";
import { handleErrors } from "utils";
import PaginateList from "generic/components/PaginateList";
import Comment from "desktop/components/BlockComments/Comment";

const ModalComments: React.SFC<any> = ({
  toggleShowComments,
  objectId,
  contentType,
  sendComment,
  onSuccess
}) => {
  const messagesEndRef = useRef(null);
  const [newComments, changeNewComments] = useState([] as any);
  const [offset, changeOffset] = useState(0);
  const [formData, changeFormData] = useState({
    comment: ""
  } as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  const getParams = {
    object_id: objectId,
    content_type: contentType
  };
  const { data: commentsData, loading } = useGet({
    path: SERVER_URLS.COMMENT_LIST.toPath({
      getParams: { ...getParams, offset }
    })
  });

  const comments = (commentsData || {}).results || [];
  const commentsCount = (commentsData || {}).count || 0;

  return (
    <>
      <Modal
        className="modal-comments"
        size="lg"
        show={true}
        onHide={() => toggleShowComments(false)}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-comments" /> {_("Comments")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="comments-messages">
            <PaginateList
              offset={offset}
              changeOffset={changeOffset}
              count={commentsCount}
              reverse={true}
              objs={comments}
              loading={loading}
              getParamsHash={JSON.stringify(getParams)}
            >
              {(comment: any) => (
                <Comment
                  item={comment}
                  key={comment.pk}
                  objectId={objectId}
                  contentType={contentType}
                  depth={0}
                />
              )}
            </PaginateList>
            {newComments.map((item: any) => (
              <Comment
                item={item}
                key={item.pk}
                objectId={objectId}
                contentType={contentType}
                depth={0}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="comments-form-message">
            <FormMsgArea
              name="comment"
              required={true}
              value={formData.comment}
              onChange={(target: any) =>
                changeFormData({
                  ...formData,
                  comment: target.value
                })
              }
              errors={formErrors.comment}
              onSend={() => {
                sendComment({
                  object_id: objectId,
                  content_type: contentType,
                  comment: formData.comment.replace(/(?:\r\n|\r|\n)/g, "<br />")
                })
                  .then((data: any) => {
                    const comment = data;
                    changeNewComments([...newComments, ...[comment]]);
                    changeFormData({
                      comment: ""
                    } as any);
                    onSuccess();
                    if (messagesEndRef) {
                      const m = messagesEndRef as any;
                      m.current.scrollIntoView({ behavior: "smooth" });
                    }
                  })
                  .catch((errors: any) => {
                    handleErrors(errors, changeFormErrors);
                  });
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const ModalCommentsWrapper: React.SFC<any> = props => {
  if (!props.showComments) {
    return null;
  }
  return <ModalComments {...props} />;
};

export default ModalCommentsWrapper;

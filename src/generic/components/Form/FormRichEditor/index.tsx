import React from "react";
import { Form } from "react-bootstrap";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/ru";

import { SERVER_URLS } from "routes/server";

class FormRichEditor extends React.PureComponent<any, any> {
  public render() {
    const { errors, help, label, richToolbar } = this.props;
    const locale = localStorage.getItem("locale") || "ru";
    const simpleConfiguration = {
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "undo",
        "redo",
        "|",
        "link"
      ],
      language: locale
    };
    const editorConfiguration = {
      ckfinder: {
        uploadUrl: SERVER_URLS.IMAGE_EDITOR_UPLOAD.buildPath()
      },
      language: locale
    };
    return (
      <Form.Group className="form-rich-editor-container">
        {label ? <Form.Label>{label}</Form.Label> : null}
        <CKEditor
          editor={ClassicEditor}
          config={richToolbar ? editorConfiguration : simpleConfiguration}
          data={this.props.value}
          onChange={(event: any, editor: any) => {
            const data = editor.getData();
            this.props.onChange({
              name: this.props.name,
              value: data
            });
          }}
          // onInit={editor => {
          //   // You can store the "editor" and use when it is needed.
          //   console.log('Editor is ready to use!', editor);
          // }}
          // onBlur={(event, editor) => {
          //   console.log('Blur.', editor);
          // }}
          // onFocus={(event, editor) => {
          //   console.log('Focus.', editor);
          // }}
        />
        {errors
          ? errors.map((error: string, index: number) => (
              <Form.Text className="text-error" key={index}>
                {error}
              </Form.Text>
            ))
          : null}
        {help ? <Form.Text className="text-muted">{help}</Form.Text> : null}
      </Form.Group>
    );
  }
}

export default FormRichEditor;

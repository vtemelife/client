import React from "react";
import { Form, Card, Button, Row, Col } from "react-bootstrap";
import Dropzone from "react-dropzone";
// import mime from 'mime-types';

import { SERVER_URLS } from "routes/server";
import Loading from "generic/components/Loading";
import { requestOptions } from "utils";
import { _ } from "trans";

class FormFilesUpload extends React.PureComponent<any> {
  public state = {
    acceptedFiles: [],
    loading: false,
    errors: {
      data: {
        non_field_errors: undefined,
        image: undefined
      }
    }
  };

  public UNSAFE_componentWillMount() {
    if (this.props.value) {
      this.setState({ acceptedFiles: this.props.value });
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (this.props.value !== nextProps.value) {
      this.setState({ acceptedFiles: nextProps.value });
    }
  }

  public render() {
    const { name, errors, help, label, ...props } = this.props;
    const widgetErrors = this.state.errors.data.image || [];
    return (
      <Form.Group className="files-upload-container">
        {label ? <Form.Label>{label}</Form.Label> : null}
        <div className={errors || widgetErrors.length ? "form-error" : ""}>
          <Row className="files">
            {this.state.loading ? <Loading /> : null}
            {this.state.acceptedFiles.map(
              (acceptedFile: any, index: number) => (
                <Col lg={6} key={index} className="file-block">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={acceptedFile.thumbnail_500x500}
                    />
                    <Card.Footer>
                      <Button
                        variant="danger"
                        size="sm"
                        className="float-right"
                        onClick={() => this.onDelete(acceptedFile.pk)}
                      >
                        <i className="fa fa-trash" /> {_("Delete")}
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              )
            )}
          </Row>
          {this.props.multiple || !this.state.acceptedFiles.length ? (
            <Dropzone {...props} onDrop={this.onDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      {this.props.description ||
                        _("Click here to choose your files")}
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          ) : null}
        </div>
        {widgetErrors
          ? widgetErrors.map((error: string, index: number) => (
              <Form.Text className="text-error" key={index}>
                {error}
              </Form.Text>
            ))
          : null}
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

  private onDrop = (acceptedFiles: any[]) => {
    acceptedFiles.forEach((attachment: any) => {
      // const ext = mime.extension(attachment.type)
      const formData = new FormData();
      formData.append("image", attachment);
      this.setState({ loading: true });
      fetch(SERVER_URLS.IMAGE_UPLOAD.buildPath(), {
        ...requestOptions(),
        method: "POST",
        body: formData
      })
        .then(response => {
          const data = response.json();
          if (response.status >= 400) {
            throw data;
          }
          this.setState({ loading: false });
          return data;
        })
        .then(data => {
          const acceptedNewFiles = this.props.multiple
            ? [...this.state.acceptedFiles, data]
            : [data];
          this.setState(
            { acceptedFiles: acceptedNewFiles, errors: { data: {} } },
            () =>
              this.props.onChange({
                name: this.props.name,
                value: acceptedNewFiles
              })
          );
        })
        .catch((promise: any) => {
          promise.then((error: any) => {
            this.setState({ errors: { data: error } });
          });
        });
    });
  };

  private onDelete = (imagePk: string) => {
    this.setState({ loading: true });
    fetch(SERVER_URLS.IMAGE_DELETE.buildPath({ imagePk }), {
      ...requestOptions(),
      method: "DELETE"
    })
      .then(response => {
        if (response.status >= 400) {
          throw new Error(_("Delete error"));
        }
        return {};
      })
      .then(() => {
        const acceptedFiles = this.state.acceptedFiles.filter(
          (item: any) => item.pk !== imagePk
        );
        this.setState(
          { acceptedFiles, errors: { data: {} }, loading: false },
          () =>
            this.props.onChange({ name: this.props.name, value: acceptedFiles })
        );
      })
      .catch((error: any) => {
        this.setState({ errors: { data: { image: [error] } } });
      });
  };
}

export default FormFilesUpload;

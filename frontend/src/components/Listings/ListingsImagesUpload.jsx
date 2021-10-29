import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { uploadListingImage } from "../../services/listings-service";
import StrawhatSpinner from "../StrawhatSpinner";
import LazyImage from "./LazyImage";
import "./ListingsImageUpload.css";

const ListingsImagesUpload = (props) => {
  const [state, setState] = useState({
    selectedFiles: undefined,
    currentFile: undefined,
    message: "",
  });

  const { selectedFiles, currentFile, message } = state;

  const onDrop = (files) => {
    if (files.length > 0) {
      setState({ ...state, selectedFiles: files });
    }
  };

  const uploadFile = () => {
    let currentFile = state.selectedFiles[0];

    setState({
      ...state,
      currentFile: currentFile,
    });

    // Upload file
    uploadListingImage(currentFile)
      .then((filename) => {
        props.imageFiles.push(filename);
        props.setImageFiles(props.imageFiles);
      })
      .finally(() => {
        setState({
          ...state,
          selectedFiles: undefined,
        });
      });
  };

  const deleteImage = (imagename, index) => {
    props.deleteImages.push(imagename);
    props.setDeleteImages(props.deleteImages);
    props.setImageFiles(
      props.imageFiles.filter((filename, index) => imagename !== filename)
    );
  };

  return (
    <div>
      {props.imageFiles.length > 0 && (
        <Card>
          <Card.Header className="card-header">List of Files</Card.Header>
          <ul className="list-group list-group-flush">
            {props.imageFiles.map((filename, index) => (
              <li className="list-group-item" key={filename}>
                <p>{filename}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <LazyImage imagename={filename} />
                  <Button onClick={() => deleteImage(filename, index)}>
                    Delete Image
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {currentFile && <StrawhatSpinner />}

      <Dropzone onDrop={onDrop} multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              {selectedFiles && selectedFiles[0].name ? (
                <div className="selected-file">
                  {selectedFiles && selectedFiles[0].name}
                </div>
              ) : (
                "Drag and drop file here, or click to select file"
              )}
            </div>
            <aside className="selected-file-wrapper">
              <Button
                variant="success"
                disabled={!selectedFiles}
                onClick={uploadFile}
              >
                Upload
              </Button>
            </aside>
          </section>
        )}
      </Dropzone>

      <div className="alert alert-light" role="alert">
        {message}
      </div>
    </div>
  );
};

export default ListingsImagesUpload;

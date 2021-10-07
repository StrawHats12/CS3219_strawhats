import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { uploadListingImage } from "../../services/listings-service";
import StrawhatSpinner from "../StrawhatSpinner";
import "./ListingsImageUpload.css";

const ListingsImagesUpload = (props) => {
  const [state, setState] = useState({
    selectedFiles: undefined,
    currentFile: undefined,
    uploadedFiles: [],
    message: "",
  });

  const { selectedFiles, currentFile, message } = state;
  const imageFiles = props.imageFiles;

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
        imageFiles.push(filename);
        props.setImageFiles(imageFiles);

        state.uploadedFiles.push(currentFile);
        setState(state);
      })
      .finally(() => {
        setState({
          ...state,
          selectedFiles: undefined,
        });
      });
  };

  return (
    <div>
      {state.uploadedFiles.length > 0 && (
        <Card>
          <Card.Header className="card-header">List of Files</Card.Header>
          <ul className="list-group list-group-flush">
            {state.uploadedFiles.map((file, index) => (
              <li className="list-group-item" key={index}>
                <a href={file.url}>{file.name}</a>
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
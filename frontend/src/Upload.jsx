import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

function Upload() {
  const [files, setFiles] = useState([]);
  const [showLinkButton, setShowLinkButton] = useState(false);

  function handleClickDropzone() {
    document.getElementById("fileInput").click();
  }

  function handleImport(e) {
    const newFiles = Array.from(e.target.files);
    setFiles(files.concat(newFiles));
    setShowLinkButton(true);
  }

  function handleDrop(e) {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles(files.concat(newFiles));
    setShowLinkButton(true);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function getResponse(response) {
    return response.json();
  }

  function getLinkHash(data) {
    return data.link_hash;
  }

  function sendFilesToBackEnd() {
    const uploadedFiles = new FormData();
    for (let file of files) {
      uploadedFiles.append("files", file);
    }

    return fetch("/api/upload", {
      method: "POST",
      body: uploadedFiles,
    })
      .then(getResponse)
      .then(getLinkHash);
  }

  const navigate = useNavigate();
  function bringToShareLink(linkHash) {
    navigate(`/share/${linkHash}`);
  }

  function createLink() {
    sendFilesToBackEnd().then(bringToShareLink);
  }

  return (
    <div className="center">
      <div className="dropzone-border">
        <div
          className="dropzone"
          onClick={handleClickDropzone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <img
            className="upload-icon"
            src="/upload-icon.png"
            alt="upload-icon"
          />
          <p>Click or drag and drop to upload files</p>
          <input
            className="upload-input"
            type="file"
            id="fileInput"
            onChange={handleImport}
            multiple
          />
        </div>
      </div>
      {showLinkButton && (
        <button className="button" onClick={createLink}>
          Create link
        </button>
      )}
    </div>
  );
}

export default Upload;

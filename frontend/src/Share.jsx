import { useParams } from "react-router-dom";
import "./Share.css";

function Share() {
  const { id } = useParams();

  function fetchDownloadData() {
    return fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link_hash: id,
      }),
    });
  }

  function getBlobFromResponse(response) {
    return response.blob();
  }

  function triggerDownload(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${id}.zip`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getResponse(response) {
    return response.json();
  }

  function getLinkStashStatus(data) {
    const validLinkHash = data.valid_link_hash === "true"; // convert to boolean
    return validLinkHash;
  }

  function ifValidLinkHash(id) {
    return fetch("/api/check_link_hash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link_hash: id,
      }),
    })
      .then(getResponse)
      .then(getLinkStashStatus);
  }

  async function download() {
    const isValidLinkHash = await ifValidLinkHash(id);
    if (isValidLinkHash) {
      fetchDownloadData().then(getBlobFromResponse).then(triggerDownload);
    } else {
      alert("Invalid download link");
    }
  }

  return (
    <div className="center">
      <h1 className="download-instructions">
        Press the button below to download files
      </h1>
      <button className="button" onClick={download}>
        Download files
      </button>
    </div>
  );
}

export default Share;

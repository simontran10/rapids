import uuid
from flask import Flask, request, send_file
from s3_manipulations import (
    upload_files_to_aws,
    download_files_to_aws,
    check_folder_on_aws,
)


app = Flask(__name__)


@app.route("/api/check_link_hash", methods=["POST"])
def check_link_hash():
    if request.method == "POST":
        link_hash = request.json.get("link_hash")

        folder_on_aws = f"{link_hash}/"
        valid_link_hash = check_folder_on_aws(folder_on_aws)

        valid_link_hash_response = {"valid_link_hash": valid_link_hash}
        return valid_link_hash_response


@app.route("/api/upload", methods=["POST"])
def upload():
    if request.method == "POST":
        link_hash = str(uuid.uuid4())

        folder_on_aws = f"{link_hash}/"
        uploaded_files = request.files.getlist("files")
        upload_files_to_aws(uploaded_files, folder_on_aws)

        link_hash_response = {"link_hash": link_hash}
        return link_hash_response


@app.route("/api/download", methods=["POST"])
def download():
    if request.method == "POST":
        link_hash = request.json.get("link_hash")

        folder_on_aws = f"{link_hash}/"
        zipped_data = download_files_to_aws(folder_on_aws)

        zip_name = "rapids-files.zip"
        zipped_data_response = send_file(
            zipped_data, download_name=zip_name, as_attachment=True
        )
        return zipped_data_response


if __name__ == "__main__":
    app.run()

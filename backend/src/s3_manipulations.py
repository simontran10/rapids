import boto3, zipfile, concurrent.futures
from io import BytesIO
from keys import BUCKET_NAME, ACCESS_KEY, SECRET_KEY


def connect_to_aws_s3(interface_type):
    if interface_type == "client":
        s3 = boto3.client(
            "s3", aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY
        )
    elif interface_type == "resource":
        s3 = boto3.resource(
            "s3", aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY
        )
    return s3


def upload_file(file, folder_on_aws, s3):
    file_name = file.filename
    s3_path = folder_on_aws + file_name
    s3.upload_fileobj(file, BUCKET_NAME, s3_path)


def upload_files_to_aws(uploaded_files, folder_on_aws):
    s3 = connect_to_aws_s3("client")
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(upload_file, file, folder_on_aws, s3)
            for file in uploaded_files
        ]
        for future in concurrent.futures.as_completed(futures):
            result = future.result()  # no manipulation needed


def check_folder_on_aws(folder_on_aws):
    s3 = connect_to_aws_s3("resource")
    bucket = s3.Bucket(BUCKET_NAME)
    match_folder_objects = list(bucket.objects.filter(Prefix=folder_on_aws))

    on_aws = len(match_folder_objects) == 1
    if on_aws:
        return "true"
    else:
        return "false"


def download_file(bucket, file_name):
    file_object = bucket.Object(file_name)
    return file_object.get()["Body"].read()


def download_and_zip_worker(args):
    bucket, file_name = args
    file_contents = download_file(bucket, file_name)
    return file_name, file_contents


def download_and_zip(bucket, bucket_folder):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(download_and_zip_worker, (bucket, object.key))
            for object in bucket_folder
        ]
        file_contents_list = [
            future.result() for future in concurrent.futures.as_completed(futures)
        ]

    zipped_data = BytesIO()
    zip_handler = zipfile.ZipFile(zipped_data, "a")

    for file_name, file_contents in file_contents_list:
        zip_handler.writestr(file_name, file_contents)

    zip_handler.close()
    zipped_data.seek(0)

    return zipped_data


def download_files_to_aws(folder_name):
    s3 = connect_to_aws_s3("resource")
    bucket = s3.Bucket(BUCKET_NAME)
    bucket_folder = bucket.objects.filter(Prefix=folder_name)

    zipped_data = download_and_zip(bucket, bucket_folder)

    return zipped_data

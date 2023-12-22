from dotenv import load_dotenv
import os


load_dotenv()


ACCESS_KEY = os.environ.get("ACCESS_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY")
BUCKET_NAME = os.environ.get("BUCKET_NAME")

# rapids

a loginless file sharing web app with basic concurrency

## Installation

### Dependencies

- [Python 3](https://www.python.org/downloads/) for Flask
- [Node.JS](https://nodejs.org/en) for React
- [AWS](https://aws.amazon.com/) for AWS S3 (use AWS Lightsail S3 for simplicity)

### Local development setup

1. Git clone the repo
```sh
git clone https://github.com/simontran07/rapids.git
```
2. install front end dependencies and start the front end server
```sh
cd rapids/
cd frontend/
npm install
npm start
```

3. install back end dependencies
```sh
cd .. && cd backend/src/
python3 -m venv venv
source venv/bin/activate
pip3 install -r ../requirements.txt
```

4. create a `.env` file in `backend/src` to add your AWS S3 access key, secret key, and bucket name
```sh
touch .env
echo "
ACCESS_KEY="YOUR_ACCESS_KEY"
SECRET_KEY="YOUR_SECRET_KEY"
BUCKET_NAME="YOUR_BUCKET_NAME"
" >> .env
```

5. start both front end and back end servers
```sh
cd frontend/ && npm start
cd .. && cd backend/src && source venv/bin/activate && python3 app.py
```

## Usage

https://github.com/simontran17/rapids/assets/148033321/917760e1-1c5c-4792-84a6-236acbb62b45

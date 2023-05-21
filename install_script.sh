#!/bin/bash
sudo apt update
wait
sudo apt install nodejs npm python3-pip python3-venv
wait
npm install react
#npm install react react-dom react-router-dom react-scripts web-vitals react-bootstrap react-datepicker react-component-export-image
wait
python3 -m venv qss-env
source qss-env/bin/activate
pip install -U Flask flask_cors python-cas pandas
wait
cd frontend
wait
npm run build
wait
cd ..
cd backend
bash script.sh

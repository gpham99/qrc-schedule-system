#!/bin/bash
sudo apt update
wait
sudo apt install nodejs npm python3-pip python3-venv nginx
wait
npm install react react-scripts react-dom react-router-dom web-vitals react-bootstrap react-component-export-image react-datepicker
wait
python3 -m venv qss-env
source qss-env/bin/activate
pip install -U Flask flask_cors python-cas pandas
wait
sudo cp qrc-shedule-system.nginx /etc/nginx/sites-enabled/
sudo cp nginx.conf /etc/nginx/
sudo rm /etc/nginx/sites-enabled/default
sudo chmod o+x ..
sudo service nginx restart
cd frontend
wait
npm run build
wait
cd ..
cd backend
bash script.sh

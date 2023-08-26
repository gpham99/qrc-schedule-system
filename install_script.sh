#!/bin/bash
if [[ $# -eq 0 ]] ; then
	echo 'Please supply the host URL e.g. bash install_script.sh qss.coloradocollege.edu'
	exit 1
fi
sudo apt update
wait
sudo apt install nodejs npm python3-pip python3-venv nginx
wait
npm install react react-scripts react-dom react-router-dom web-vitals react-bootstrap react-component-export-image react-datepicker bootstrap
npm i --save-dev eslint-plugin-jest
wait
cd backend
find . -exec sed -i "s/44.230.115.148/$1/g" {} \;
python3 database_init.py
cd ..
cd frontend/src/Components
find . -exec sed -i "s/44.230.115.148/$1/g" {} \;
cd ../../..
wait
secret_key=`python3 -c 'import secrets; print(secrets.token_hex())'`
sed -i "s/;sufhiagr3yugfjcnkdlmsx0-w9u4fhbuewiejfigehbjrs/$secret_key/" backend/application.py
python3 -m venv qss-env
source qss-env/bin/activate
pip install -U Flask flask_cors python-cas pandas xlrd openpyxl waitress
wait
sudo cp qrc-schedule-system.nginx /etc/nginx/sites-enabled/
sudo cp nginx.conf /etc/nginx/
sudo rm /etc/nginx/sites-enabled/default
sudo chmod o+x ..
sudo service nginx restart
cd frontend

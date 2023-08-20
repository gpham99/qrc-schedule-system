#!/bin/bash
source qss-env/bin/activate
cd frontend
wait
npm run build
wait
sudo service nginx restart
wait
cd ..
cd backend
bash script.sh

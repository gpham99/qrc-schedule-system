#! /bin/bash

export FLASK_APP=/home/ubuntu/qrc-shedule-system/backend/application.py
export FLASK_DEBUG=1
flask run --host=0.0.0.0 --port=5000

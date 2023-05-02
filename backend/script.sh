#! /bin/bash

export FLASK_APP=application.py
# /home/ubuntu/qrc-shedule-system/backend/application.py
export FLASK_DEBUG=1
flask run --host=0.0.0.0 --port=8080 2>&1 | grep -v "is_within_window"

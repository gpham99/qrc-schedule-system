#! /bin/bash

export FLASK_APP=application.py
export FLASK_DEBUG=1
flask run --host=0.0.0.0 --port=8080
#waitress-serve --host 127.0.0.1 application:application

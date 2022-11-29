#!/usr/bin/python3

import sys
import logging
import os

logging.basicConfig(stream=sys.stderr)

os.environ["DJANGO_SETTINGS_MODULE"] = "{{ project_name }}.settings"

from app import app as application

application.secret_key = "3d6f45a5fc12445dbac2f59c3b6c7cb1"

#!/usr/bin/python3

import sys
import logging
import os
import pathlib

logging.basicConfig(stream=sys.stderr)

BASE_PATH = pathlib.Path("/var/www/html/csp-solver")


sys.path.insert(0, BASE_PATH)
sys.path.insert(
    0,
    BASE_PATH.join("/my_venv/lib/python3.10/site-packages"),
)

from app import app as application

application.secret_key = "3d6f45a5fc12445dbac2f59c3b6c7cb1"

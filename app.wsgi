#!/home/mbabb/.cache/pypoetry/virtualenvs/csp-solver-smbx6EIP-py3.9/bin/python3

import sys
import logging

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, "/var/www/csp-solver/")

import importlib

csp_solver = importlib.import_module("csp-solver")

from csp_solver import app as application

application.secret_key = "3d6f45a5fc12445dbac2f59c3b6c7cb1"

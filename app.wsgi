 #!/usr/bin/python3

import sys
import logging

logging.basicConfig(stream=sys.stderr)


sys.path.insert(0, "/var/www/html/csp-solver")
sys.path.insert(
    0,
    "/var/www/html/csp-solver/my_venv/lib/python3.8/site-packages",
)


from app import app as application

application.secret_key = "3d6f45a5fc12445dbac2f59c3b6c7cb1"

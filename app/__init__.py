# from app.api import app

# if __name__ == "__main__":
#     # app.jinja_env.auto_reload = True
#     # app.config["TEMPLATES_AUTO_RELOAD"] = True

#     app.run()

from flask import Flask
app = Flask(__name__)
@app.route("/")
def hello():
    return "Hello, I love Digital Ocean!"
if __name__ == "__main__":
    app.run()
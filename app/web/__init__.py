from flask import Flask
from flask_cors import CORS

from .db import db, init_db_command, models
from app.celeryapi import celery_init_app
from .config import Config
from .hooks import load_logged_in_user, handle_error, add_headers
from .views import (
    auth_views,
    pdf_views,
    score_views,
    client_views,
    conversation_views,
    github_views,
)
# from .db import db, init_db_command
# from .db import models
# from app.celery import celery_init_app
# from .config import Config
# from .hooks import load_logged_in_user, handle_error, add_headers
# from .views import (
#     auth_views,
#     pdf_views,
#     score_views,
#     client_views,
#     conversation_views,
#     github_views,
# )


def create_app():
    app = Flask(__name__, static_folder="../../client/build")
    app.url_map.strict_slashes = False
    app.config.from_object(Config)

    # Configuration CORS pour autoriser les requêtes spécifiquement pour votre client
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    register_extensions(app)
    register_hooks(app)
    register_blueprints(app)
    if Config.CELERY["broker_url"]:
        celery_init_app(app)

    return app


def register_extensions(app):
    db.init_app(app)
    app.cli.add_command(init_db_command)


def register_blueprints(app):
    app.register_blueprint(auth_views.bp)
    app.register_blueprint(pdf_views.bp)
    app.register_blueprint(github_views.bp)

    app.register_blueprint(score_views.bp)
    app.register_blueprint(conversation_views.bp)
    app.register_blueprint(client_views.bp)


def register_hooks(app):
    CORS(app)
    app.before_request(load_logged_in_user)
    app.after_request(add_headers)
    app.register_error_handler(Exception, handle_error)

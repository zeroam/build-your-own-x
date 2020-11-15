import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy


# instantiate the db
db = SQLAlchemy()


def create_app(script_info=None):

    # instantiate the app
    app = Flask(__name__)

    # set config
    app_setting = os.getenv("APP_SETTINGS")
    app.config.from_object(app_setting)

    # set up extensions
    db.init_app(app)

    # register blueprints
    from project.api.ping import ping_blueprint
    from project.api.users import users_blueprint

    app.register_blueprint(ping_blueprint)
    app.register_blueprint(users_blueprint)

    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}

    return app

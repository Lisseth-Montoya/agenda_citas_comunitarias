# app/__init__.py
from flask import Flask
from app.config import Config

def create_app(config_class=Config):
    app = Flask(
        __name__,
        static_folder="../static",
        template_folder="../templates"
    )
    app.config.from_object(config_class)

    # Opcional en desarrollo:
    app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
    app.config["TEMPLATES_AUTO_RELOAD"] = True

    from app.routes import bp
    app.register_blueprint(bp)

    return app

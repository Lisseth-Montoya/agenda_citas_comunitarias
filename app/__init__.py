# app/__init__.py
from pathlib import Path
from flask import Flask
from jinja2 import FileSystemLoader, ChoiceLoader
from config import Config

ROOT = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = ROOT / "templates"
STATIC_DIR    = ROOT / "static"

def create_app(config_class=Config):
    app = Flask(
        __name__,
        static_folder=str(STATIC_DIR),
        template_folder=str(TEMPLATES_DIR)
    )
    app.config.from_object(config_class)

    # Desactiva autoreload si no quieres recarga automática
    # app.config["TEMPLATES_AUTO_RELOAD"] = False

    # Loader simple (sin prints)
    app.jinja_loader = ChoiceLoader([
        FileSystemLoader(str(TEMPLATES_DIR)),
    ])

    from .routes import bp
    app.register_blueprint(bp)
    return app

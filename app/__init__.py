from pathlib import Path
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from jinja2 import FileSystemLoader, ChoiceLoader
from config import DevelopmentConfig   # ← usaremos esta para modo desarrollo

# Rutas base
ROOT = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = ROOT / "templates"
STATIC_DIR = ROOT / "static"

# Instancia global de la BD
db = SQLAlchemy()

def create_app(config_class=DevelopmentConfig):
    app = Flask(
        __name__,
        static_folder=str(STATIC_DIR),
        template_folder=str(TEMPLATES_DIR)
    )

    # Cargar configuración
    app.config.from_object(config_class)

    # Configurar el motor de plantillas
    app.jinja_loader = ChoiceLoader([
        FileSystemLoader(str(TEMPLATES_DIR)),
    ])

    # Inicializar SQLAlchemy
    db.init_app(app)

    # Registrar blueprints
    from .routes import bp
    app.register_blueprint(bp)

    # Crear tablas si no existen (solo en desarrollo)
    with app.app_context():
        db.create_all()

    return app
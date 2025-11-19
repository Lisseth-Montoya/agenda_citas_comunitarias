

# wsgi.py
from app import create_app

app = create_app()

if __name__ == "__main__":
    # Ejecuta sin debug para no ver mensajes extra
    app.run(debug=False)

from . import db   # Importa la instancia global de SQLAlchemy desde __init__.py
from datetime import datetime

class Paciente(db.Model):
    __tablename__ = 'paciente'

    id_paciente = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    genero = db.Column(db.String(1), nullable=False)  # 'M' (Masculino) o 'F' (Femenino)
    telefono = db.Column(db.String(15))
    direccion = db.Column(db.String(100))
    email = db.Column(db.String(50))
    dui = db.Column(db.String(10), unique=True, nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    estado = db.Column(db.String(10), nullable=False)
    observaciones = db.Column(db.String(255), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('dui', name='uq_paciente_dui'),
        db.CheckConstraint("genero IN ('M','F')", name='chk_genero'),
        db.CheckConstraint("dui REGEXP '^[0-9]{8}-[0-9]$'", name='chk_dui_formato'),
    )

    def __repr__(self):
        return f"<Paciente {self.nombre} {self.apellido} ({self.dui})>"
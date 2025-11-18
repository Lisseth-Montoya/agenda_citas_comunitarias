from datetime import datetime
from . import db

# ============================================================
#  ESPECIALIDADES MÉDICAS
# ============================================================
class Especialidad(db.Model):
    __tablename__ = 'especialidades'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=False)
    duracion_min = db.Column(db.Integer, nullable=False)
    precio_base = db.Column(db.Float, nullable=False)
    estado = db.Column(db.String(20), default="Activo")
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

    # Relación con citas
    citas = db.relationship("Cita", back_populates="especialidad")

    # Relación con médicos
    medicos = db.relationship("Medico", back_populates="especialidad")

    def __repr__(self):
        return f'<Especialidad {self.nombre}>'


# ============================================================
#  MÉDICOS
# ============================================================
class Medico(db.Model):
    __tablename__ = 'medicos'

    id = db.Column(db.Integer, primary_key=True)
    nombres = db.Column(db.String(120), nullable=False)
    apellidos = db.Column(db.String(120), nullable=False)
    dui = db.Column(db.String(15), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    email = db.Column(db.String(120))

    estado = db.Column(db.String(20), default="Activo")

    # FK → Especialidad
    especialidad_id = db.Column(db.Integer, db.ForeignKey('especialidades.id'), nullable=False)

    # Relación con especialidad
    especialidad = db.relationship("Especialidad", back_populates="medicos")

    # Relación con citas
    citas = db.relationship("Cita", back_populates="medico")

    def __repr__(self):
        return f'<Medico {self.nombres} {self.apellidos}>'


# ============================================================
#  PACIENTES
# ============================================================
class Paciente(db.Model):
    __tablename__ = 'pacientes'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    dui = db.Column(db.String(15), unique=True, nullable=False)
    fecha_nac = db.Column(db.Date)
    telefono = db.Column(db.String(20))
    correo = db.Column(db.String(120))
    direccion = db.Column(db.String(250))
    genero = db.Column(db.String(10))
    observaciones = db.Column(db.Text)
    estado = db.Column(db.String(20), default="Activo")

    # Relación con citas
    citas = db.relationship("Cita", back_populates="paciente")

    def __repr__(self):
        return f'<Paciente {self.nombre}>'


# ============================================================
#  CITAS MÉDICAS
# ============================================================
class Cita(db.Model):
    __tablename__ = "citas"

    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.Date)
    hora = db.Column(db.Time)
    duracion_min = db.Column(db.Integer)
    estado = db.Column(db.String(20))
    detalles = db.Column(db.Text)

    paciente_id = db.Column(db.Integer, db.ForeignKey("pacientes.id"))
    medico_id = db.Column(db.Integer, db.ForeignKey("medicos.id"))
    especialidad_id = db.Column(db.Integer, db.ForeignKey("especialidades.id"))

    # Relaciones correctas (SIN backref duplicado)
    paciente = db.relationship("Paciente", back_populates="citas")
    medico = db.relationship("Medico", back_populates="citas")
    especialidad = db.relationship("Especialidad", back_populates="citas")

    def __repr__(self):
        return f'<Cita {self.id}>'

from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from app.models import db, Paciente
from datetime import datetime

# Blueprint principal
bp = Blueprint("main", __name__)

# ===================== RUTA PRINCIPAL =====================
@bp.route("/")
def index():
    """Página de inicio o dashboard"""
    return render_template("layout/index.html", title="Inicio")

# ===================== AGENDA =====================
@bp.route("/agenda")
def agenda():
    """Vista principal de Agenda"""
    return render_template("Modules/Gestionar_Citas/Agenda.html", title="Agenda")

@bp.route("/citas/registrar")
def citas_registrar():
    """Formulario de registro de citas"""
    return render_template("Modules/Gestionar_Citas/Registrar_Citas.html", title="Registrar Citas")

@bp.route("/agenda/semanal")
def agenda_semanal():
    """Agenda semanal"""
    return render_template("Modules/Gestionar_Citas/Agenda_semanal.html", title="Agenda Semanal")

# ===== Rutas legacy (mayúsculas) → redirigen a las canónicas =====
@bp.route("/Agenda")
def agenda_legacy():
    return redirect(url_for("main.agenda"), code=301)

@bp.route("/Registrar_Citas")
def citas_registrar_legacy():
    return redirect(url_for("main.citas_registrar"), code=301)

@bp.route("/Agenda_semanal")
def agenda_semanal_legacy():
    return redirect(url_for("main.agenda_semanal"), code=301)

# ===================== PERFILES MÉDICOS =====================
@bp.route("/perfiles-medicos")
def perfiles_medicos():
    """Módulo de Perfiles Médicos"""
    return render_template("modulos/PerfilesMedicos/P-medicos.html", title="Perfiles Médicos")

# ===================== GESTIÓN PACIENTES =====================
@bp.route("/pacientes")
def pacientes():
    """Módulo de Gestión de Pacientes"""
    return render_template("modulos/Pacientes/Pacientes.html", title="Pacientes")

# ===================== ESPECIALIDADES =====================
@bp.route("/especialidades")
def especialidades():
    """Módulo de Especialidades"""
    return render_template("modulos/especialidades/especialidades.html", title="Especialidades")

# ===================== REPORTES =====================
@bp.route("/reportes")
def reportes():
    """Sección de reportes"""
    return render_template("layout/index.html", title="Reportes")

# ===================== API: CRUD PACIENTES =====================
@bp.route("/api/pacientes", methods=['GET'])
def api_listar_pacientes():
    pacientes = Paciente.query.all()
    return jsonify([
        {
            "id_paciente": p.id_paciente,
            "nombre": p.nombre,
            "apellido": p.apellido,
            "dui": p.dui,
            "fecha_nacimiento": p.fecha_nacimiento.strftime('%Y-%m-%d'),
            "telefono": p.telefono,
            "email": p.email,
            "genero": p.genero,
            "estado": p.estado,
            "direccion": p.direccion,
            "observaciones": p.observaciones,
        } for p in pacientes
    ])

@bp.route("/api/pacientes/<int:id_paciente>", methods=['GET'])
def api_detalle_paciente(id_paciente):
    p = Paciente.query.get_or_404(id_paciente)
    return jsonify({
        "id_paciente": p.id_paciente,
        "nombre": p.nombre,
        "apellido": p.apellido,
        "dui": p.dui,
        "fecha_nacimiento": p.fecha_nacimiento.strftime('%Y-%m-%d'),
        "telefono": p.telefono,
        "email": p.email,
        "genero": p.genero,
        "estado": p.estado,
        "direccion": p.direccion,
        "observaciones": p.observaciones,
    })

@bp.route("/api/pacientes", methods=['POST'])
def api_crear_paciente():
    data = request.json
    try:
        p = Paciente(
            nombre=data['nombre'],
            apellido=data['apellido'],
            fecha_nacimiento=datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d'),
            genero=data['genero'],
            telefono=data['telefono'],
            direccion=data['direccion'],
            email=data['email'],
            dui=data['dui'],
            estado=data['estado'],
            observaciones=data['observaciones']
        )
        db.session.add(p)
        db.session.commit()
        return jsonify({"status": "success", "message": "Paciente registrado correctamente."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400

@bp.route("/api/pacientes/<int:id_paciente>", methods=['PUT'])
def api_editar_paciente(id_paciente):
    data = request.json
    try:
        p = Paciente.query.get_or_404(id_paciente)
        p.nombre = data['nombre']
        p.apellido = data['apellido']
        p.fecha_nacimiento = datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d')
        p.genero = data['genero']
        p.telefono = data['telefono']
        p.direccion = data['direccion']
        p.email = data['email']
        p.dui = data['dui']
        p.estado = data['estado']
        p.observaciones = data['observaciones']
        db.session.commit()
        return jsonify({"status": "success", "message": "Paciente actualizado correctamente."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400

@bp.route("/api/pacientes/<int:id_paciente>", methods=['DELETE'])
def api_eliminar_paciente(id_paciente):
    try:
        p = Paciente.query.get_or_404(id_paciente)
        db.session.delete(p)
        db.session.commit()
        return jsonify({"status": "success", "message": "Paciente eliminado correctamente."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400

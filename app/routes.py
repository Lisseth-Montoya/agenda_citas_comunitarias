# app/routes.py
from flask import Blueprint, render_template

bp = Blueprint("main", __name__)

# ===================== RUTA PRINCIPAL =====================
@bp.route("/")
def index():
    return render_template("layout/index.html", title="Inicio")

# ===================== AGENDA =====================
@bp.route("/agenda")
def agenda():
    return render_template("layout/index.html", title="Agenda")

@bp.route("/citas/registrar")
def citas_registrar():
    return render_template("layout/index.html", title="Registrar Citas")

@bp.route("/agenda/semanal")
def agenda_semanal():
    return render_template("layout/index.html", title="Agenda Semanal")

# ===================== PERFILES MÉDICOS =====================
@bp.route("/perfiles-medicos")
def perfiles_medicos():
    return render_template("modulos/PerfilesMedicos/P-medicos.html", title="Perfiles Médicos")

# ===================== GESTIÓN PACIENTES =====================
@bp.route("/pacientes")
def pacientes():
    """Módulo de Gestión de Pacientes"""
    return render_template("modulos/Pacientes/Pacientes.html", title="Pacientes")

# ===================== ESPECIALIDADES =====================
@bp.route("/especialidades")
def especialidades():
    return render_template("layout/index.html", title="Especialidades")

# ===================== REPORTES =====================
@bp.route("/reportes")
def reportes():
    return render_template("layout/index.html", title="Reportes")

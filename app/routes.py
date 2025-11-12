# app/routes.py
from flask import Blueprint, render_template

# Blueprint principal
bp = Blueprint("main", __name__)

# ===================== RUTA PRINCIPAL =====================
@bp.route("/")
def index():
    """Página principal (dashboard o portada del sistema)"""
    return render_template("layout/index.html", title="Inicio")

# ===================== AGENDA =====================
@bp.route("/agenda")
def agenda():
    """Vista principal de Agenda"""
    return render_template("layout/index.html", title="Agenda")

@bp.route("/citas/registrar")
def citas_registrar():
    """Formulario de registro de citas"""
    return render_template("layout/index.html", title="Registrar Citas")

# ===================== PERFILES MÉDICOS =====================
@bp.route("/perfiles-medicos")
def perfiles_medicos():
    """Módulo de Perfiles Médicos"""
    return render_template("modulos/PerfilesMedicos/P-medicos.html", title="Perfiles Médicos")

# ===================== GESTION PACIENTES =====================
@bp.route("/pacientes")
def pacientes():
    """Módulo de Gestion Pacientes"""
    return render_template("modulos/Pacientes/Pacientes.html", title="Pacientes")

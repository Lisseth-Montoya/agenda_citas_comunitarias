# app/routes.py
from flask import Blueprint, render_template, redirect, url_for

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

# app/routes.py
from flask import Blueprint, render_template, redirect, url_for

bp = Blueprint("main", __name__)

# ===================== RUTA PRINCIPAL =====================
@bp.route("/")
def index():
    return render_template("layout/index.html", title="Inicio")

# ===================== AGENDA (canónica en minúsculas) =====================
@bp.route("/agenda")
def agenda():
    # Si ya tienes la vista real, úsala. Si no existe aún, cambia a layout/index.html
    return render_template("Modules/Gestionar_Citas/Agenda.html", title="Agenda")

@bp.route("/citas/registrar")
def citas_registrar():
    return render_template("Modules/Gestionar_Citas/Registrar_Citas.html", title="Registrar Citas")

@bp.route("/agenda/semanal")
def agenda_semanal():
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

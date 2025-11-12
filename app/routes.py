from flask import Blueprint, render_template

bp = Blueprint("main", __name__)

@bp.route("/")
def index():
    return render_template("layout/index.html")

# Placeholders del sidebar (todos apuntan al mismo index por ahora)
@bp.route("/agenda")
def agenda():
    return render_template("layout/index.html", page_title="Agenda")

@bp.route("/citas/registrar")
def citas_registrar():
    return render_template("layout/index.html", page_title="Registrar Citas")

@bp.route("/agenda/semanal")
def agenda_semanal():
    return render_template("layout/index.html", page_title="Agenda Semanal")

@bp.route("/pacientes")
def pacientes():
    return render_template("layout/index.html", page_title="Pacientes")

@bp.route("/perfiles-medicos")
def perfiles_medicos():
    
    return render_template("modulos/PerfilesMedicos/P-medicos.html", title="Perfiles Médicos")
@bp.route("/especialidades")
def especialidades():
    return render_template("layout/index.html", page_title="Especialidades")

@bp.route("/reportes")
def reportes():
    return render_template("layout/index.html", page_title="Reportes")

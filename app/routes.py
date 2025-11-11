from flask import Blueprint, render_template

bp = Blueprint("main", __name__)

@bp.route("/")
def index():
    return render_template("layout/index.html")

# Placeholders del sidebar (todos apuntan al mismo index por ahora)
@bp.route("/Agenda")
def agenda():
    return render_template("Modules/Gestionar_Citas/Agenda.html")

@bp.route("/Registrar_Citas")
def citas_registrar():
    return render_template("Modules/Gestionar_Citas/Registrar_Citas.html")

@bp.route("/Agenda_semanal")
def agenda_semanal():
    return render_template("Modules/Gestionar_Citas/Agenda_semanal.html")

@bp.route("/pacientes")
def pacientes():
    return render_template("layout/index.html", page_title="Pacientes")

@bp.route("/doctores")
def doctores():
    return render_template("layout/index.html", page_title="Doctores")

@bp.route("/especialidades")
def especialidades():
    return render_template("layout/index.html", page_title="Especialidades")

@bp.route("/reportes")
def reportes():
    return render_template("layout/index.html", page_title="Reportes")

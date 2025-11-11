from flask import Blueprint, render_template

bp = Blueprint("main", __name__)

@bp.route("/")
def index():
    return render_template("index.html")

# Rutas de los ítems del sidebar (pueden ser placeholders por ahora)
@bp.route("/agenda")
def agenda():
    return render_template("index.html", page_title="Agenda")

@bp.route("/citas/registrar")
def citas_registrar():
    return render_template("index.html", page_title="Registrar Citas")

@bp.route("/agenda/semanal")
def agenda_semanal():
    return render_template("index.html", page_title="Agenda Semanal")

@bp.route("/pacientes")
def pacientes():
    return render_template("index.html", page_title="Pacientes")

@bp.route("/doctores")
def doctores():
    return render_template("index.html", page_title="Doctores")



@bp.route("/reportes")
def reportes():
    return render_template("index.html", page_title="Reportes")

from flask import render_template

@bp.route('/especialidades')
def especialidades():
    return render_template('modulos/especialidades/especialidades.html')

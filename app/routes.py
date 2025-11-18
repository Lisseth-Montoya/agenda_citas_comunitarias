from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from .models import Cita, Paciente, Medico, Especialidad
from . import db

bp = Blueprint("main", __name__)

# =====================================================
# RUTA PRINCIPAL
# =====================================================
@bp.route("/")
def index():
    return render_template("layout/index.html", title="Inicio")


# =====================================================
# AGENDA – LISTADO DE CITAS
# =====================================================
@bp.route("/agenda")
def agenda():

    citas = db.session.query(
        Cita.id,
        Paciente.nombre.label("paciente"),
        (Medico.nombres + " " + Medico.apellidos).label("medico"),
        Cita.fecha,
        Cita.hora,
        Cita.estado,
        Cita.detalles
    ).join(Paciente).join(Medico).order_by(Cita.fecha.asc()).all()

    return render_template(
        "Modules/Gestionar_Citas/Agenda.html",
        title="Agenda",
        citas=citas
    )


# =====================================================
# REGISTRAR / EDITAR CITA
# =====================================================
@bp.route("/citas/registrar", methods=["GET", "POST"])
def citas_registrar():

    if request.method == "POST":

        id_editar = request.form.get("id_editar")  # para edición
        nombre_paciente = request.form.get("paciente")
        dui = request.form.get("dui")
        especialidad_id = request.form.get("especialidad")
        profesional_id = request.form.get("profesional")
        fecha = request.form.get("fecha")
        hora = request.form.get("hora")
        duracion = request.form.get("duracion")
        estado = request.form.get("estado")
        notas = request.form.get("notas")

        # -------------------------------------------------------
        # BUSCAR PACIENTE POR DUI
        # -------------------------------------------------------
        pac = Paciente.query.filter_by(dui=dui).first()

        if pac is None:
            # Crear paciente nuevo
            pac = Paciente(nombre=nombre_paciente, dui=dui)
            db.session.add(pac)
            db.session.commit()
        else:
            # 🔥 Si el nombre cambió, actualizarlo
            if pac.nombre != nombre_paciente:
                pac.nombre = nombre_paciente
                db.session.commit()

        # -------------------------------------------------------
        # EDITAR UNA CITA YA EXISTENTE
        # -------------------------------------------------------
        if id_editar and id_editar.strip() != "":
            cita = Cita.query.get(id_editar)

            cita.paciente_id = pac.id
            cita.medico_id = profesional_id
            cita.especialidad_id = especialidad_id
            cita.fecha = fecha
            cita.hora = hora
            cita.duracion_min = duracion
            cita.estado = estado
            cita.detalles = notas

            db.session.commit()
            return redirect(url_for("main.agenda"))

        # -------------------------------------------------------
        # NUEVA CITA
        # -------------------------------------------------------
        nueva = Cita(
            paciente_id=pac.id,
            medico_id=profesional_id,
            especialidad_id=especialidad_id,
            fecha=fecha,
            hora=hora,
            duracion_min=duracion,
            estado=estado,
            detalles=notas
        )

        db.session.add(nueva)
        db.session.commit()
        return redirect(url_for("main.agenda"))

    # =====================================================
    # GET – MOSTRAR FORMULARIO
    # =====================================================
    editar_id = request.args.get("editar")
    cita = Cita.query.get(editar_id) if editar_id else None

    medicos = Medico.query.all()
    especialidades = Especialidad.query.all()

    return render_template(
        "Modules/Gestionar_Citas/Registrar_Citas.html",
        title="Registrar / Editar",
        medicos=medicos,
        especialidades=especialidades,
        cita=cita
    )


# =====================================================
# ELIMINAR CITA (AJAX)
# =====================================================
@bp.route("/citas/eliminar/<int:id>", methods=["DELETE"])
def citas_eliminar(id):
    cita = Cita.query.get(id)

    if not cita:
        return jsonify({"error": "No existe"}), 404

    db.session.delete(cita)
    db.session.commit()
    return jsonify({"mensaje": "Cita eliminada"}), 200


# =====================================================
# AGENDA SEMANAL
# =====================================================
@bp.route("/agenda/semanal")
def agenda_semanal():
    return render_template(
        "Modules/Gestionar_Citas/Agenda_semanal.html",
        title="Agenda Semanal"
    )


# =====================================================
# RUTAS LEGACY
# =====================================================
@bp.route("/Agenda")
def agenda_legacy():
    return redirect(url_for("main.agenda"), code=301)

@bp.route("/Registrar_Citas")
def citas_registrar_legacy():
    return redirect(url_for("main.citas_registrar"), code=301)

@bp.route("/Agenda_semanal")
def agenda_semanal_legacy():
    return redirect(url_for("main.agenda_semanal"), code=301)


# =====================================================
# OTRAS PÁGINAS
# =====================================================
@bp.route("/perfiles-medicos")
def perfiles_medicos():
    return render_template("modulos/PerfilesMedicos/P-medicos.html",
                           title="Perfiles Médicos")

@bp.route("/pacientes")
def pacientes():
    return render_template("modulos/Pacientes/Pacientes.html",
                           title="Pacientes")

@bp.route("/especialidades")
def especialidades():
    return render_template("modulos/especialidades/especialidades.html",
                           title="Especialidades")

@bp.route("/reportes")
def reportes():
    return render_template("layout/index.html", title="Reportes")

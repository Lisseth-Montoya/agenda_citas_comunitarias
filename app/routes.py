from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from .models import Cita, Paciente, Medico, Especialidad
from . import db
from datetime import datetime, timedelta

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

        id_editar = request.form.get("id_editar")
        nombre_paciente = request.form.get("paciente")
        dui = request.form.get("dui")
        especialidad_id = request.form.get("especialidad")
        profesional_id = request.form.get("profesional")
        fecha = request.form.get("fecha")
        hora = request.form.get("hora")
        duracion = request.form.get("duracion")
        estado = request.form.get("estado")
        notas = request.form.get("notas")

        # Buscar o crear paciente
        pac = Paciente.query.filter_by(dui=dui).first()

        if pac is None:
            pac = Paciente(nombre=nombre_paciente, dui=dui)
            db.session.add(pac)
            db.session.commit()
        else:
            if pac.nombre != nombre_paciente:
                pac.nombre = nombre_paciente
                db.session.commit()

        # EDITAR CITA
        if id_editar:
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

        # NUEVA CITA
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
# ELIMINAR CITA
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
    medicos = Medico.query.all()
    return render_template(
        "Modules/Gestionar_Citas/Agenda_semanal.html",
        title="Agenda Semanal",
        medicos=medicos
    )

# =====================================================
# API – CITAS POR SEMANA
# =====================================================
@bp.route("/api/citas/semana")
def api_citas_semana():

    medico_id = request.args.get("medico_id")
    fecha_base = request.args.get("fecha")

    if not medico_id or not fecha_base:
        return jsonify({"error": "Faltan parámetros"}), 400

    fecha_inicio = datetime.fromisoformat(fecha_base)
    fecha_inicio = fecha_inicio - timedelta(days=fecha_inicio.weekday())
    fecha_fin = fecha_inicio + timedelta(days=6)

    citas = Cita.query.filter(
        Cita.medico_id == medico_id,
        Cita.fecha >= fecha_inicio.date(),
        Cita.fecha <= fecha_fin.date()
    ).all()

    data = []
    for c in citas:
        data.append({
            "id": c.id,
            "paciente": c.paciente.nombre if c.paciente else "",
            "especialidad": c.especialidad.nombre if c.especialidad else "",
            "fecha": str(c.fecha),
            "hora": str(c.hora),
            "duracion": c.duracion_min,
            "estado": c.estado
        })

    return jsonify(data)

# =====================================================
# PÁGINAS SECCIONALES
# =====================================================
@bp.route("/perfiles-medicos")
def vista_perfiles_medicos():
    return render_template("modulos/PerfilesMedicos/P-medicos.html", title="Perfiles Médicos")

@bp.route("/pacientes")
def vista_pacientes():
    return render_template("modulos/Pacientes/Pacientes.html", title="Pacientes")

@bp.route("/especialidades")
def vista_especialidades():
    return render_template("modulos/especialidades/especialidades.html", title="Especialidades")

# =====================================================
# MÉDICOS – CRUD API
# =====================================================
@bp.route("/api/medicos/listar")
def api_medicos_listar():
    medicos = Medico.query.all()

    data = []
    for m in medicos:
        data.append({
            "id": m.id,
            "nombres": m.nombres,
            "apellidos": m.apellidos,
            "dui": m.dui,
            "especialidad": m.especialidad.nombre if m.especialidad else "",
            "telefono": m.telefono,
            "email": m.email,
            "estado": m.estado
        })

    return jsonify(data)

@bp.route("/api/medicos/guardar", methods=["POST"])
def api_medicos_guardar():
    data = request.json

    id_medico = data.get("id")
    nombres = data.get("nombres")
    apellidos = data.get("apellidos")
    dui = data.get("dui")
    especialidad = data.get("especialidad")
    telefono = data.get("telefono")
    email = data.get("email")
    estado = data.get("estado")

    if id_medico:
        medico = Medico.query.get(id_medico)
        if not medico:
            return jsonify({"error": "Médico no encontrado"}), 404
    else:
        medico = Medico()

    medico.nombres = nombres
    medico.apellidos = apellidos
    medico.dui = dui
    medico.telefono = telefono
    medico.email = email
    medico.estado = estado

    esp = Especialidad.query.filter_by(nombre=especialidad).first()
    if not esp:
        esp = Especialidad(nombre=especialidad, descripcion="Auto", duracion_min=30, precio_base=0)
        db.session.add(esp)
        db.session.commit()

    medico.especialidad_id = esp.id
    db.session.add(medico)
    db.session.commit()

    return jsonify({"mensaje": "Guardado correctamente"})

@bp.route("/api/medicos/obtener/<int:id>")
def api_medicos_obtener(id):
    m = Medico.query.get(id)
    if not m:
        return jsonify({"error": "No encontrado"}), 404

    return jsonify({
        "id": m.id,
        "nombres": m.nombres,
        "apellidos": m.apellidos,
        "dui": m.dui,
        "especialidad": m.especialidad.nombre if m.especialidad else "",
        "telefono": m.telefono,
        "email": m.email,
        "estado": m.estado
    })

@bp.route("/api/medicos/eliminar/<int:id>", methods=["DELETE"])
def api_medicos_eliminar(id):
    m = Medico.query.get(id)
    if not m:
        return jsonify({"error": "No existe"}), 404

    db.session.delete(m)
    db.session.commit()

    return jsonify({"mensaje": "Eliminado"})

# =======================================================
#   ESPECIALIDADES – CRUD API
# =======================================================

@bp.route("/api/especialidades/listar")
def api_especialidades_listar():
    especialidades = Especialidad.query.order_by(Especialidad.id.asc()).all()

    data = []
    for e in especialidades:
        data.append({
            "id": e.id,
            "nombre": e.nombre,
            "descripcion": e.descripcion,
            "duracion_min": e.duracion_min,
            "precio_base": e.precio_base,
            "estado": e.estado,
            "fecha_registro": e.fecha_registro.strftime("%Y-%m-%d %H:%M") if e.fecha_registro else "Sin fecha"
        })

    return jsonify(data)

@bp.route("/api/especialidades/guardar", methods=["POST"])
def api_especialidades_guardar():
    data = request.json

    id_esp = data.get("id")
    nombre = data.get("nombre")
    descripcion = data.get("descripcion")
    duracion_min = data.get("duracion_min")
    precio_base = data.get("precio_base")
    estado = data.get("estado")

    if id_esp:
        esp = Especialidad.query.get(id_esp)
        if not esp:
            return jsonify({"error": "Especialidad no encontrada"}), 404
    else:
        esp = Especialidad(fecha_registro=datetime.utcnow())

    esp.nombre = nombre
    esp.descripcion = descripcion
    esp.duracion_min = duracion_min
    esp.precio_base = precio_base
    esp.estado = estado

    db.session.add(esp)
    db.session.commit()

    return jsonify({"mensaje": "Guardado correctamente"})

@bp.route("/api/especialidades/obtener/<int:id>")
def api_especialidades_obtener(id):
    esp = Especialidad.query.get(id)
    if not esp:
        return jsonify({"error": "No encontrado"}), 404

    return jsonify({
        "id": esp.id,
        "nombre": esp.nombre,
        "descripcion": esp.descripcion,
        "duracion_min": esp.duracion_min,
        "precio_base": esp.precio_base,
        "estado": esp.estado,
        "fecha_registro": esp.fecha_registro.strftime("%Y-%m-%d %H:%M") if esp.fecha_registro else "Sin fecha"
    })

@bp.route("/api/especialidades/eliminar/<int:id>", methods=["DELETE"])
def api_especialidades_eliminar(id):
    esp = Especialidad.query.get(id)
    if not esp:
        return jsonify({"error": "No existe"}), 404

    db.session.delete(esp)
    db.session.commit()

    return jsonify({"mensaje": "Eliminado"})

# =====================================================
# CRUD PACIENTES
# =====================================================


@bp.route("/api/pacientes")
def api_listar_pacientes():
    pacientes = Paciente.query.all()
    return jsonify([
        {
            "id": p.id,
            "nombre": p.nombre,
            "apellido": p.apellido,   
            "dui": p.dui,
            "telefono": p.telefono,
            "correo": p.correo,
            "genero": p.genero,
            "estado": p.estado,
            "direccion": p.direccion,
            "observaciones": p.observaciones,
            "fecha_nac": p.fecha_nac.strftime('%Y-%m-%d') if p.fecha_nac else ""
        } for p in pacientes
    ])


@bp.route("/api/pacientes/<int:id>", methods=['GET'])
def api_detalle_paciente(id):
    p = Paciente.query.get_or_404(id)
    return jsonify({
        "id": p.id,
        "nombre": p.nombre,
        "apellido": p.apellido,  
        "dui": p.dui,
        "telefono": p.telefono,
        "correo": p.correo,
        "genero": p.genero,
        "estado": p.estado,
        "direccion": p.direccion,
        "observaciones": p.observaciones,
        "fecha_nac": p.fecha_nac.strftime('%Y-%m-%d') if p.fecha_nac else ""
    })


@bp.route("/api/pacientes", methods=['POST'])
def api_crear_paciente():
    data = request.json
    try:
        p = Paciente(
            nombre=data['nombre'],
            apellido=data['apellido'],   
            dui=data['dui'],
            telefono=data['telefono'],
            correo=data['correo'],
            genero=data['genero'],
            direccion=data['direccion'],
            estado=data['estado'],
            observaciones=data['observaciones'],
            fecha_nac=datetime.strptime(data['fecha_nac'], '%Y-%m-%d')
        )
        db.session.add(p)
        db.session.commit()
        return jsonify({"status": "success", "message": "Paciente registrado correctamente."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400


@bp.route("/api/pacientes/<int:id>", methods=['PUT'])
def api_editar_paciente(id):
    data = request.json
    try:
        p = Paciente.query.get_or_404(id)

        p.nombre = data['nombre']
        p.apellido = data['apellido']     
        p.dui = data['dui']
        p.telefono = data['telefono']
        p.correo = data['correo']
        p.genero = data['genero']
        p.direccion = data['direccion']
        p.estado = data['estado']
        p.observaciones = data['observaciones']
        p.fecha_nac = datetime.strptime(data['fecha_nac'], '%Y-%m-%d')

        db.session.commit()
        return jsonify({"status": "success", "message": "Paciente actualizado correctamente."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400


@bp.route("/api/pacientes/<int:id>", methods=['DELETE'])
def api_eliminar_paciente(id):
    try:
        p = Paciente.query.get_or_404(id)
        db.session.delete(p)
        db.session.commit()
        return jsonify({"status": "success", "message": "Paciente eliminado correctamente."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400

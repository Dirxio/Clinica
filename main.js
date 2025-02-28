document.addEventListener("DOMContentLoaded", () => {
    cargarPacientes();
    cargarPacientesParaMedico();
    cargarPacientesParaSecretario();
    cargarCitas();
});

// **PACIENTE - Registro de Datos Médicos**
if (document.getElementById("formPaciente")) {
    document.getElementById("formPaciente").addEventListener("submit", function (event) {
        event.preventDefault();

        // Obtener valores del formulario
        const nombre = document.getElementById("nombrePaciente").value.trim();
        const enfermedad = document.getElementById("enfermedadPaciente").value.trim();
        const tipoSangre = document.getElementById("tipoSangre").value;
        const edad = parseInt(document.getElementById("edadPaciente").value);
        const altura = parseInt(document.getElementById("alturaPaciente").value);
        const sexo = document.getElementById("sexoPaciente").value;

        // Validar datos
        if (!validarFormularioPaciente(nombre, enfermedad, tipoSangre, edad, altura, sexo)) {
            return;
        }

        // Guardar en localStorage
        let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
        pacientes.push({ nombre, enfermedad, tipoSangre, edad, altura, sexo });
        localStorage.setItem("pacientes", JSON.stringify(pacientes));

        alert("Paciente registrado correctamente.");
        this.reset();
        cargarPacientes();
    });
}

// Función para validar el formulario de paciente
function validarFormularioPaciente(nombre, enfermedad, tipoSangre, edad, altura, sexo) {
    if (!nombre || !enfermedad || !tipoSangre || !edad || !altura || !sexo) {
        alert("Todos los campos son obligatorios.");
        return false;
    }

    if (edad < 0 || edad > 120) {
        alert("La edad debe estar entre 0 y 120 años.");
        return false;
    }

    if (altura < 50 || altura > 250) {
        alert("La altura debe estar entre 50 y 250 cm.");
        return false;
    }

    return true;
}

// Cargar pacientes en la lista
function cargarPacientes() {
    if (document.getElementById("listaPacientes")) {
        const lista = document.getElementById("listaPacientes");
        lista.innerHTML = "";
        let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

        pacientes.forEach((paciente, index) => {
            let div = document.createElement("div");
            div.innerHTML = `
                <p><strong>Nombre:</strong> ${paciente.nombre}</p>
                <p><strong>Enfermedad:</strong> ${paciente.enfermedad}</p>
                <p><strong>Tipo de Sangre:</strong> ${paciente.tipoSangre}</p>
                <p><strong>Edad:</strong> ${paciente.edad} años</p>
                <p><strong>Altura:</strong> ${paciente.altura} cm</p>
                <p><strong>Sexo:</strong> ${paciente.sexo}</p>
                <button onclick="eliminarPaciente(${index})">Eliminar</button>
            `;
            lista.appendChild(div);
        });
    }
}

// Eliminar paciente
function eliminarPaciente(index) {
    let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    pacientes.splice(index, 1);
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    cargarPacientes();
}

// **MÉDICO - Visualización y Asignación de Medicamentos**
function cargarPacientesParaMedico() {
    if (document.getElementById("listaPacientesMedico")) {
        const lista = document.getElementById("listaPacientesMedico");
        lista.innerHTML = "";
        let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

        pacientes.forEach((paciente) => {
            let div = document.createElement("div");
            div.textContent = `${paciente.nombre} - ${paciente.enfermedad}`;
            div.onclick = () => mostrarDetallePaciente(paciente);
            lista.appendChild(div);
        });
    }
}

function mostrarDetallePaciente(paciente) {
    if (document.getElementById("detallePaciente")) {
        const detalle = document.getElementById("detallePaciente");
        detalle.innerHTML = `
            <h3>${paciente.nombre}</h3>
            <p><strong>Enfermedad:</strong> ${paciente.enfermedad}</p>
            <p><strong>Tipo de Sangre:</strong> ${paciente.tipoSangre}</p>
            <p><strong>Edad:</strong> ${paciente.edad} años</p>
            <p><strong>Altura:</strong> ${paciente.altura} cm</p>
            <p><strong>Sexo:</strong> ${paciente.sexo}</p>
            <label>Medicamento: </label>
            <input type='text' id='medicamento'>
            <button onclick='imprimirConstancia("${paciente.nombre}")'>Imprimir Constancia</button>
        `;
    }
}

function imprimirConstancia(nombre) {
    const contenido = document.getElementById("detallePaciente").innerHTML;
    let ventana = window.open('', '', 'width=600,height=400');
    ventana.document.write(`<html><head><title>Constancia Médica</title></head><body>${contenido}</body></html>`);
    ventana.document.close();
    ventana.print();
}

// **SECRETARIO - Asignación de Citas**
function cargarPacientesParaSecretario() {
    if (document.getElementById("seleccionarPaciente")) {
        let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
        const seleccionarPaciente = document.getElementById("seleccionarPaciente");
        seleccionarPaciente.innerHTML = "<option value=''>Selecciona un paciente</option>";

        pacientes.forEach(paciente => {
            let option = document.createElement("option");
            option.value = paciente.nombre;
            option.textContent = paciente.nombre;
            seleccionarPaciente.appendChild(option);
        });
    }
}

if (document.getElementById("formCita")) {
    document.getElementById("formCita").addEventListener("submit", function (event) {
        event.preventDefault();

        // Obtener valores del formulario
        const pacienteSeleccionado = document.getElementById("seleccionarPaciente").value;
        const doctor = document.getElementById("doctorAsignado").value.trim();
        const fecha = document.getElementById("fechaCita").value;
        const hora = document.getElementById("horaCita").value;

        // Validar datos
        if (!pacienteSeleccionado || !doctor || !fecha || !hora) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        // Guardar en localStorage
        let citas = JSON.parse(localStorage.getItem("citas")) || [];
        citas.push({ paciente: pacienteSeleccionado, doctor, fecha, hora });
        localStorage.setItem("citas", JSON.stringify(citas));

        alert("Cita asignada correctamente.");
        this.reset();
        cargarCitas();
    });
}

// Cargar citas en la lista
function cargarCitas() {
    if (document.getElementById("listaCitas")) {
        const lista = document.getElementById("listaCitas");
        lista.innerHTML = "";
        let citas = JSON.parse(localStorage.getItem("citas")) || [];

        citas.forEach((cita, index) => {
            let div = document.createElement("div");
            div.innerHTML = `
                <p><strong>Paciente:</strong> ${cita.paciente}</p>
                <p><strong>Doctor:</strong> ${cita.doctor}</p>
                <p><strong>Fecha:</strong> ${cita.fecha}</p>
                <p><strong>Hora:</strong> ${cita.hora}</p>
                <button onclick="eliminarCita(${index})">Eliminar</button>
            `;
            lista.appendChild(div);
        });
    }
}

// Eliminar cita
function eliminarCita(index) {
    let citas = JSON.parse(localStorage.getItem("citas")) || [];
    citas.splice(index, 1);
    localStorage.setItem("citas", JSON.stringify(citas));
    cargarCitas();      
}
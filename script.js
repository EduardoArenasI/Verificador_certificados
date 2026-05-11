// ===================================================
// ITSE - VALIDACIÓN DE CERTIFICADOS
// ===================================================

// ===============================
// CARGAR JSON
// ===============================

let certificados = [];

fetch("data/certificados.json")
  .then(response => response.json())
  .then(data => {

    certificados = data;

    console.log(
      "Certificados cargados correctamente:",
      certificados
    );

  })
  .catch(error => {

    console.error(
      "Error cargando certificados:",
      error
    );

  });

// ===============================
// ELEMENTOS DOM
// ===============================

const input = document.getElementById("searchInput");

const suggestions = document.getElementById("suggestions");

const result = document.getElementById("result");

const searchButton = document.querySelector(".search-btn");

// ===============================
// PROTECCIÓN BÁSICA
// ===============================

// Deshabilitar clic derecho
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Bloquear teclas comunes
document.addEventListener("keydown", (e) => {

  // F12
  if (e.key === "F12") {
    e.preventDefault();
  }

  // CTRL + SHIFT + I
  if (
    e.ctrlKey &&
    e.shiftKey &&
    e.key.toLowerCase() === "i"
  ) {
    e.preventDefault();
  }

  // CTRL + SHIFT + J
  if (
    e.ctrlKey &&
    e.shiftKey &&
    e.key.toLowerCase() === "j"
  ) {
    e.preventDefault();
  }

  // CTRL + U
  if (
    e.ctrlKey &&
    e.key.toLowerCase() === "u"
  ) {
    e.preventDefault();
  }

});

// ===============================
// SANITIZAR TEXTO
// ===============================

function sanitizarTexto(texto) {

  const div = document.createElement("div");

  div.innerText = texto;

  return div.innerHTML;

}

// ===============================
// BUSCADOR EN TIEMPO REAL
// ===============================

input.addEventListener("input", buscarCertificados);

searchButton.addEventListener("click", buscarCertificados);

// ===============================
// FUNCIÓN BUSCAR
// ===============================

function buscarCertificados() {

  // Verificar carga JSON
  if (certificados.length === 0) {
    return;
  }

  const valor = sanitizarTexto(
    input.value.trim().toLowerCase()
  );

  suggestions.innerHTML = "";

  result.innerHTML = "";

  // Evitar vacío
  if (valor.length < 2) {

    result.innerHTML = `

      <div class="result-card">

        <div class="result-title">
          Resultados
        </div>

        <div class="result-info">
          Escribe al menos 2 caracteres para buscar
        </div>

      </div>

    `;

    return;
  }

  // Validar caracteres
  if (
    /[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-]/g.test(valor)
  ) {

    mostrarError(
      "Entrada inválida detectada."
    );

    return;
  }

  // Limitar longitud
  if (valor.length > 60) {

    mostrarError(
      "Consulta demasiado larga."
    );

    return;
  }

  // ===============================
  // FILTRAR RESULTADOS
  // ===============================

  const filtrados = certificados.filter(cert =>

    cert.nombre.toLowerCase().includes(valor) ||

    cert.id.toLowerCase().includes(valor)

  );

  // ===============================
  // SIN RESULTADOS
  // ===============================

  if (filtrados.length === 0) {

    result.innerHTML = `

      <div class="result-card invalid">

        <div class="result-title">
          No se encontraron resultados
        </div>

        <div class="result-info">
          No existe ningún certificado registrado.
        </div>

      </div>

    `;

    return;
  }

  // ===============================
  // MOSTRAR SUGERENCIAS
  // ===============================

  filtrados.slice(0, 5).forEach(cert => {

    const div = document.createElement("div");

    div.classList.add("suggestion-item");

    // Nombre
    const nombre = document.createElement("div");

    nombre.classList.add("suggestion-name");

    nombre.textContent = cert.nombre;

    // ID
    const id = document.createElement("div");

    id.classList.add("suggestion-id");

    id.textContent = cert.id;

    // Agregar
    div.appendChild(nombre);

    div.appendChild(id);

    // Click
    div.addEventListener("click", () => {

      mostrarCertificado(cert);

      suggestions.innerHTML = "";

      input.value = cert.nombre;

    });

    suggestions.appendChild(div);

  });

}

// ===============================
// MOSTRAR CERTIFICADO
// ===============================

function mostrarCertificado(cert) {

  result.innerHTML = "";

  const card = document.createElement("div");

  card.classList.add(
    "result-card",
    "valid"
  );

  // TÍTULO
  const title = document.createElement("div");

  title.classList.add("result-title");

  title.innerHTML =
    "Certificado Validado";

  // INFO
  const info = document.createElement("div");

  info.classList.add("result-info");

  info.innerHTML = `

    <strong>Nombre:</strong><br>
    <span>${sanitizarTexto(cert.nombre)}</span>

    <br><br>

    <strong>ID del Certificado:</strong><br>
    <span>${sanitizarTexto(cert.id)}</span>

    <br><br>

    <strong>Programa Académico:</strong><br>
    <span>${sanitizarTexto(cert.curso)}</span>

    <br><br>

    <strong>Estado:</strong><br>
    <span>${sanitizarTexto(cert.estado)}</span>

  `;

  card.appendChild(title);

  card.appendChild(info);

  result.appendChild(card);

}

// ===============================
// MOSTRAR ERROR
// ===============================

function mostrarError(mensaje) {

  result.innerHTML = `

    <div class="result-card invalid">

      <div class="result-title">
        ⚠ Error de Seguridad
      </div>

      <div class="result-info">
        ${sanitizarTexto(mensaje)}
      </div>

    </div>

  `;

}

// ===============================
// DETECTAR DEVTOOLS
// SOLO CUANDO LA PÁGINA ESTÁ ACTIVA
// ===============================

let devtoolsOpen = false;

let paginaActiva = true;

// Detectar si la pestaña está activa
document.addEventListener("visibilitychange", () => {

  paginaActiva = !document.hidden;

});

// Detectar DevTools
setInterval(() => {

  // NO ejecutar si la pestaña está inactiva
  if (!paginaActiva) {
    return;
  }

  const widthThreshold =
    window.outerWidth -
    window.innerWidth > 160;

  const heightThreshold =
    window.outerHeight -
    window.innerHeight > 160;

  if (
    widthThreshold ||
    heightThreshold
  ) {

    if (!devtoolsOpen) {

      devtoolsOpen = true;

      document.body.innerHTML = `

        <div style="
          background:#f4f4f4;
          color:#8b1028;
          width:100vw;
          height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          flex-direction:column;
          font-family:Montserrat;
          text-align:center;
          padding:20px;
        ">

          <h1 style="
            font-size:2rem;
            margin-bottom:15px;
            font-weight:700;
          ">
            Acceso Restringido
          </h1>

          <p style="
            color:#6b7280;
            font-size:1rem;
            max-width:400px;
            line-height:1.7;
          ">
            La inspección del sistema
            ha sido bloqueada por seguridad.
          </p>

        </div>

      `;

    }

  }

}, 100000);
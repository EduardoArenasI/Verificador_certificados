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

  if (!texto) return "";

  const div = document.createElement("div");

  div.innerText = texto;

  return div.innerHTML;

}

// ===============================
// EVENTOS
// ===============================

input.addEventListener(
  "input",
  buscarCertificados
);

searchButton.addEventListener(
  "click",
  buscarCertificados
);

// ===============================
// FUNCIÓN BUSCAR
// ===============================

function buscarCertificados() {

  // Verificar JSON cargado
  if (certificados.length === 0) {
    return;
  }

  const valor = sanitizarTexto(
    input.value.trim().toLowerCase()
  );

  suggestions.innerHTML = "";

  result.innerHTML = "";

  // ===============================
  // INPUT VACÍO
  // ===============================

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

  // ===============================
  // VALIDAR ENTRADA
  // ===============================

  if (
    /[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-]/g.test(valor)
  ) {

    mostrarError(
      "Entrada inválida detectada."
    );

    return;
  }

  // ===============================
  // LIMITAR LONGITUD
  // ===============================

  if (valor.length > 60) {

    mostrarError(
      "Consulta demasiado larga."
    );

    return;
  }

  // ===============================
  // FILTRAR RESULTADOS
  // SOPORTA CAMPOS VACÍOS
  // ===============================

  const filtrados = certificados.filter(cert =>

    (cert.nombre || "")
      .toLowerCase()
      .includes(valor)

    ||

    (cert.Perfil || "")
      .toLowerCase()
      .includes(valor)

    ||

    (cert.Proyecto || "")
      .toLowerCase()
      .includes(valor)

    ||

    (cert.Categoria || "")
      .toLowerCase()
      .includes(valor)

    ||

    (cert.estado || "")
      .toLowerCase()
      .includes(valor)

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

  filtrados
    .slice(0, 5)
    .forEach(cert => {

      const div =
        document.createElement("div");

      div.classList.add(
        "suggestion-item"
      );

      // ===============================
      // NOMBRE
      // ===============================

      const nombre =
        document.createElement("div");

      nombre.classList.add(
        "suggestion-name"
      );

      nombre.textContent =
        cert.nombre || "Sin nombre";

      // ===============================
      // PROYECTO / PERFIL
      // ===============================

      const proyecto =
        document.createElement("div");

      proyecto.classList.add(
        "suggestion-id"
      );

      proyecto.textContent =
        cert.Proyecto ||
        cert.Perfil ||
        "Sin información";

      // ===============================
      // AGREGAR
      // ===============================

      div.appendChild(nombre);

      div.appendChild(proyecto);

      // ===============================
      // CLICK
      // ===============================

      div.addEventListener(
        "click",
        () => {

          mostrarCertificado(cert);

          suggestions.innerHTML = "";

          input.value =
            cert.nombre || "";

        }
      );

      suggestions.appendChild(div);

    });

}

// ===============================
// MOSTRAR CERTIFICADO
// ===============================

function mostrarCertificado(cert) {

  result.innerHTML = "";

  const card =
    document.createElement("div");

  card.classList.add(
    "result-card",
    "valid"
  );

  // ===============================
  // TÍTULO
  // ===============================

  const title =
    document.createElement("div");

  title.classList.add(
    "result-title"
  );

  title.innerHTML =
    "Certificado Validado";

  // ===============================
  // INFORMACIÓN
  // ===============================

  const info =
    document.createElement("div");

  info.classList.add(
    "result-info"
  );

  info.innerHTML = `

    <strong>Nombre:</strong><br>
    <span>
      ${sanitizarTexto(
        cert.nombre ||
        "No especificado"
      )}
    </span>

    <br><br>

    <strong>Perfil:</strong><br>
    <span>
      ${sanitizarTexto(
        cert.Perfil ||
        "No especificado"
      )}
    </span>

    <br><br>

    <strong>Proyecto:</strong><br>
    <span>
      ${sanitizarTexto(
        cert.Proyecto ||
        "No especificado"
      )}
    </span>

    <br><br>

    <strong>Categoría:</strong><br>
    <span>
      ${sanitizarTexto(
        cert.Categoria ||
        "No especificado"
      )}
    </span>

    <br><br>

    <strong>Estado:</strong><br>
    <span>
      ${sanitizarTexto(
        cert.estado ||
        "No especificado"
      )}
    </span>

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
// SOLO SI LA PÁGINA ESTÁ ACTIVA
// ===============================

let devtoolsOpen = false;

let paginaActiva = true;

// Detectar pestaña activa
document.addEventListener(
  "visibilitychange",
  () => {

    paginaActiva =
      !document.hidden;

  }
);

// Detectar DevTools
setInterval(() => {

  // No ejecutar si pestaña inactiva
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

}, 2000);
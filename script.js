
const certificados = [

    {
      nombre: "Eduardo Arenas Interian",
      id: "CERT-2026-001",
      curso: "Inteligencia Artificial",
      estado: "VALIDO"
    },
  
    {
      nombre: "Ana Cristina Alpuche ",
      id: "CERT-2026-002",
      curso: "Enfermeria Avanzada",
      estado: "VALIDO"
    },
  
    {
      nombre: "Carlos Ruiz López",
      id: "CERT-2026-003",
      curso: "Ciberseguridad",
      estado: "VALIDO"
    },
  
    {
      nombre: "Fernanda Castillo Méndez",
      id: "CERT-2026-004",
      curso: "Big Data",
      estado: "VALIDO"
    }
  
  ];
  
  // ===============================
  // ELEMENTOS DOM
  // ===============================
  
  const input = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");
  const result = document.getElementById("result");
  
  // ===============================
  // PROTECCIÓN BÁSICA
  // ===============================
  
  // Deshabilitar clic derecho
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  
  // Bloquear teclas comunes de inspección
  document.addEventListener("keydown", (e) => {
  
    // F12
    if (e.key === "F12") {
      e.preventDefault();
    }
  
    // CTRL + SHIFT + I
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
      e.preventDefault();
    }
  
    // CTRL + SHIFT + J
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
      e.preventDefault();
    }
  
    // CTRL + U
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
    }
  
  });
  
  // ===============================
  // SANITIZAR TEXTO
  // Previene XSS
  // ===============================
  
  function sanitizarTexto(texto) {
  
    const div = document.createElement("div");
  
    div.innerText = texto;
  
    return div.innerHTML;
  
  }
  
  // ===============================
  // BUSCADOR EN TIEMPO REAL
  // ===============================
  
  input.addEventListener("input", () => {
  
    const valor = sanitizarTexto(
      input.value.trim().toLowerCase()
    );
  
    suggestions.innerHTML = "";
    result.innerHTML = "";
  
    // Limitar caracteres sospechosos
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-]/g.test(valor)) {
  
      mostrarError(
        "Entrada inválida detectada."
      );
  
      return;
    }
  
    // Evitar consultas vacías
    if (valor.length < 2) {
      return;
    }
  
    // Limitar longitud
    if (valor.length > 60) {
  
      mostrarError(
        "Consulta demasiado larga."
      );
  
      return;
    }
  
    // Filtrar resultados
    const filtrados = certificados.filter(cert =>
  
      cert.nombre.toLowerCase().includes(valor) ||
      cert.id.toLowerCase().includes(valor)
  
    );
  
    // Sin resultados
    if (filtrados.length === 0) {
  
      suggestions.innerHTML = `
        <div class="suggestion-item">
          <div class="suggestion-name">
            No se encontraron resultados
          </div>
        </div>
      `;
  
      return;
    }
  
    // Limitar cantidad mostrada
    filtrados.slice(0, 5).forEach(cert => {
  
      const div = document.createElement("div");
  
      div.classList.add("suggestion-item");
  
      // Crear elementos seguros
      const nombre = document.createElement("div");
      nombre.classList.add("suggestion-name");
      nombre.textContent = cert.nombre;
  
      const id = document.createElement("div");
      id.classList.add("suggestion-id");
      id.textContent = cert.id;
  
      div.appendChild(nombre);
      div.appendChild(id);
  
      // Evento seguro
      div.addEventListener("click", () => {
  
        mostrarCertificado(cert);
  
        suggestions.innerHTML = "";
  
        input.value = cert.nombre;
  
      });
  
      suggestions.appendChild(div);
  
    });
  
  });
  
  // ===============================
  // MOSTRAR CERTIFICADO
  // ===============================
  
  function mostrarCertificado(cert) {
  
    result.innerHTML = "";
  
    const card = document.createElement("div");
    card.classList.add("result-card", "valid");
  
    const title = document.createElement("div");
    title.classList.add("result-title");
    title.textContent = "Certificado Validado";
  
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
  // ===============================
  
  let devtoolsOpen = false;
  
  setInterval(() => {
  
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
  
    if (widthThreshold || heightThreshold) {
  
      if (!devtoolsOpen) {
  
        devtoolsOpen = true;
  
        document.body.innerHTML = `
  
          <div style="
            background:#050816;
            color:white;
            width:100vw;
            height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            font-family:Arial;
            flex-direction:column;
            text-align:center;
            padding:20px;
          ">
  
            <h1>
              Acceso Restringido
            </h1>
  
            <p style="margin-top:15px;color:#94a3b8;">
              La inspección del sistema ha sido bloqueada.
            </p>
  
          </div>
  
        `;
  
      }
  
    }
  
  }, 1000);
  
  // ===============================
  // LIMPIEZA AUTOMÁTICA
  // ===============================
  
  setInterval(() => {
  
    if (input.value.trim() === "") {
  
      suggestions.innerHTML = "";
      result.innerHTML = "";
  
    }
  
  }, 500);
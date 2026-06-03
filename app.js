let myChartInstance = null;

// Base de datos de Usuarios iniciales (Se guardan en el navegador)
let usuariosDB = JSON.parse(localStorage.getItem('usuarios_spa')) || [
  { nombre: "Ramiro Vasquez", rol: "dueño", email: "ramiro@spa.com", password: "ramiro123" },
  { nombre: "Valentina Donoso", rol: "masajista", email: "valentina@spa.com", password: "vale2026" },
  { nombre: "Marta del Carmen", rol: "cliente", email: "marta@spa.com", password: "marta77" },
  { nombre: "Juan Riquelme", rol: "recepcionista", email: "juan@spa.com", password: "juanrecep" }
];

// Base de datos de Citas / Reservas
let reservasDB = JSON.parse(localStorage.getItem('reservas_spa')) || [
  { id: 1, servicio: "Masaje Relajante Piedras Volcánicas", cliente: "Marta del Carmen", especialista: "Valentina Donoso", fechaHora: "2026-06-15T10:00" }
];

// Catálogo de servicios disponibles para la venta
const catalogoVentas = [
  { id: 'm1', titulo: "Masaje Piedras Volcánicas", desc: "Alineación de chakras usando piedras volcánicas calientes y aceites orgánicos.", precio: "$45.000" },
  { id: 'm2', titulo: "Terapia Descontracturante", desc: "Masaje intenso enfocado en aliviar tensiones profundas y nudos musculares.", precio: "$55.000" },
  { id: 'm3', titulo: "Facial Hidratante Orgánico", desc: "Limpieza profunda con extractos botánicos naturales para refrescar tu piel.", precio: "$35.000" },
  { id: 'm4', titulo: "Circuito Sauna y Jacuzzi", desc: "Acceso completo a saunas secos y de vapor, más jacuzzi con hidromasaje.", precio: "$60.000" }
];

// Tareas predeterminadas para el Tablero Scrum
let scrumTareas = JSON.parse(localStorage.getItem('scrum_spa')) || [
  { id: 1, titulo: "Crear Login", desc: "Diseñar interfaz con roles seguros.", col: "backlog", prio: "high" },
  { id: 2, titulo: "Catálogo de Ventas", desc: "Implementar flujo de compras virtuales.", col: "progress", prio: "high" },
  { id: 3, titulo: "Dashboard Modular", desc: "Gráficas dinámicas por Chart.js.", col: "done", prio: "high" }
];

// Configuración general del Administrador
let configuracionGlobal = JSON.parse(localStorage.getItem('config_global_spa')) || {
  tituloSpa: "TRANQUILIDAD SPA",
  ingresos: "$2.500.000",
  ubicacion: "Av. Vitacura 4500, Santiago"
};

let usuarioActual = null;

// Ejecutar automáticamente cuando la página termine de cargar
document.addEventListener("DOMContentLoaded", () => {
  // Aseguramos que LocalStorage tenga los datos guardados
  if(!localStorage.getItem('usuarios_spa')) {
    localStorage.setItem('usuarios_spa', JSON.stringify(usuariosDB));
  }
  
  applyLiveSettings();
  actualizarTablaUsuarios();
  renderScrumBoard();
  renderCatalogo();
  renderReservas();
});

// Actualiza los textos dinámicos según el Panel de Configuración
function applyLiveSettings() {
  if(document.getElementById('siteTitleLogin')) document.getElementById('siteTitleLogin').innerText = configuracionGlobal.tituloSpa;
  if(document.getElementById('siteTitleSidebar')) document.getElementById('siteTitleSidebar').innerText = configuracionGlobal.tituloSpa;
  if(document.getElementById('cfgTitle')) document.getElementById('cfgTitle').value = configuracionGlobal.tituloSpa;
  
  if(document.getElementById('statsIngresos')) document.getElementById('statsIngresos').innerText = configuracionGlobal.ingresos;
  if(document.getElementById('cfgIngresos')) document.getElementById('cfgIngresos').value = configuracionGlobal.ingresos;
  
  if(document.getElementById('sidebarLocationText')) document.getElementById('sidebarLocationText').innerText = configuracionGlobal.ubicacion;
  if(document.getElementById('cfgUbicacion')) document.getElementById('cfgUbicacion').value = configuracionGlobal.ubicacion;

  if(document.getElementById('statsClientes')) document.getElementById('statsClientes').innerText = usuariosDB.filter(u => u.rol === 'cliente').length + 115;
  if(document.getElementById('statsReservas')) document.getElementById('statsReservas').innerText = reservasDB.length + 23;
}

// Renderiza los masajes en la interfaz del cliente
function renderCatalogo() {
  const container = document.getElementById('catalogGrid');
  if (!container) return;
  container.innerHTML = "";

  catalogoVentas.forEach(p => {
    const card = document.createElement('div');
    card.className = "product-card";
    card.innerHTML = `
      <div>
        <h3>${p.titulo}</h3>
        <p>${p.desc}</p>
      </div>
      <div>
        <div class="product-price">${p.precio}</div>
        <button class="btn btn-primary" onclick="simularCompra('${p.titulo}')">Comprar Tratamiento</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function simularCompra(nombreServicio) {
  alert(`🛒 ¡Tratamiento "${nombreServicio}" adquirido con éxito!\nAhora puedes seleccionarlo en el formulario de abajo para agendar tu cita.`);
}

// Permite a los clientes agendar citas reales hacia el panel de control
function crearReservaCliente() {
  const servicio = document.getElementById('reservaServicio').value;
  const fechaHora = document.getElementById('reservaFechaHora').value;
  const especialista = document.getElementById('reservaEspecialista').value;

  if (!fechaHora) {
    alert("❌ Por favor, selecciona una fecha y hora válidas para tu cita.");
    return;
  }

  const nuevaCita = {
    id: Date.now(),
    servicio: servicio,
    cliente: usuarioActual ? usuarioActual.nombre : "Cliente Nuevo",
    especialista: especialista,
    fechaHora: fechaHora
  };

  reservasDB.push(nuevaCita);
  localStorage.setItem('reservas_spa', JSON.stringify(reservasDB));
  
  renderReservas();
  applyLiveSettings();

  alert("📅 ¡Tu cita ha sido agendada con éxito! Ya fue registrada en el sistema del SPA.");
}

// Muestra las citas en el panel
function renderReservas() {
  const container = document.getElementById('bookingsGrid');
  if (!container) return;
  container.innerHTML = "";

  if(reservasDB.length === 0) {
    container.innerHTML = "<p style='color: var(--text-muted);'>No hay citas programadas.</p>";
    return;
  }

  reservasDB.forEach(res => {
    const dateParsed = new Date(res.fechaHora).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' });
    const div = document.createElement('div');
    div.className = "booking-card";
    div.innerHTML = `
      <div class="booking-time">⏰ ${dateParsed}</div>
      <div class="booking-body">
        <h3>${res.servicio}</h3>
        <p><strong>Cliente:</strong> ${res.cliente}</p>
        <p><strong>Especialista:</strong> ${res.especialista}</p>
      </div>
      <span class="booking-status">Confirmado</span>
    `;
    container.appendChild(div);
  });
}

// Sistema de Inicio de Sesión
function login() {
  const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
  const passwordInput = document.getElementById('loginPassword').value.trim();

  if(!emailInput || !passwordInput) {
    alert("Por favor, ingresa tu correo y contraseña.");
    return;
  }

  // Buscar en la lista actualizada
  const usuario = usuariosDB.find(u => u.email === emailInput && u.password === passwordInput);
  
  if(!usuario) {
    alert("❌ Error: Correo o contraseña incorrectos.");
    return;
  }

  usuarioActual = usuario;
  document.getElementById('userDisplay').innerText = usuario.nombre;
  document.getElementById('roleDisplay').innerText = usuario.rol.toUpperCase();

  construirMenuLateral(usuario.rol);
  document.getElementById('authWrapper').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');

  if(usuario.rol === 'cliente') {
    if(document.getElementById('welcomeCliente')) {
      document.getElementById('welcomeCliente').innerText = `¡Bienvenido, ${usuario.nombre}!`;
    }
    showSection('vista-cliente');
  } else {
    showSection('inicio');
  }
}

// Generador de Menú Dinámico según Permisos
function construirMenuLateral(rol) {
  const menuContainer = document.getElementById('sidebarMenu');
  if(!menuContainer) return;
  menuContainer.innerHTML = "";

  const opciones = [
    { id: 'inicio', texto: '📊 Inicio Dashboard', roles: ['dueño', 'recepcionista', 'masajista'] },
    { id: 'vista-cliente', texto: '🌸 Portal & Ventas', roles: ['cliente'] },
    { id: 'usuarios', texto: '👥 Ver Usuarios', roles: ['dueño', 'recepcionista'] },
    { id: 'reservas', texto: '📅 Próximas Citas', roles: ['dueño', 'recepcionista', 'masajista'] },
    { id: 'scrum', texto: '📋 Scrum Board', roles: ['dueño'] },
    { id: 'configuracion', texto: '⚙️ Admin Master', roles: ['dueño'] }
  ];

  opciones.forEach(opc => {
    if(opc.roles.includes(rol)) {
      const li = document.createElement('li');
      li.className = "nav-item";
      li.innerText = opc.texto;
      li.onclick = function() { showSection(opc.id, this); };
      menuContainer.appendChild(li);
    }
  });

  const logoutLi = document.createElement('li');
  logoutLi.className = "nav-item logout-item";
  logoutLi.innerText = "🚪 Cerrar Sesión";
  logoutLi.onclick = logout;
  menuContainer.appendChild(logoutLi);
}

// Enrutador de Secciones Seguras
function showSection(sectionId, element) {
  if(!usuarioActual) return;

  const reglasAcceso = {
    'inicio': ['dueño', 'recepcionista', 'masajista'],
    'vista-cliente': ['cliente'],
    'usuarios': ['dueño', 'recepcionista'],
    'reservas': ['dueño', 'recepcionista', 'masajista'],
    'scrum': ['dueño'],
    'configuracion': ['dueño']
  };

  if(!reglasAcceso[sectionId].includes(usuarioActual.rol)) {
    alert("⛔ Acceso denegado. Tu rol no tiene permisos para esta vista.");
    return;
  }

  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  const targetSec = document.getElementById(sectionId);
  if(targetSec) targetSec.classList.add('active');
  if (element) element.classList.add('active');

  if(sectionId === 'inicio') {
    document.querySelectorAll('.perm-financial').forEach(c => {
      usuarioActual.rol === 'masajista' ? c.classList.add('hidden') : c.classList.remove('hidden');
    });
    initChart();
  }
}

// Guardar Configuración del Admin
function saveLiveConfig() {
  configuracionGlobal.tituloSpa = document.getElementById('cfgTitle').value.trim();
  configuracionGlobal.ingresos = document.getElementById('cfgIngresos').value.trim();
  configuracionGlobal.ubicacion = document.getElementById('cfgUbicacion').value.trim();

  localStorage.setItem('config_global_spa', JSON.stringify(configuracionGlobal));
  applyLiveSettings();
  alert("✨ ¡Ubicación, métricas y nombre actualizados globalmente!");
}

// Registro de Nuevos Usuarios en LocalStorage
function register() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value.trim();
  const role = document.getElementById('registerRole').value;

  if (!name || !email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if(usuariosDB.some(u => u.email === email)) {
    alert("❌ Este correo ya está registrado en el sistema.");
    return;
  }

  usuariosDB.push({ nombre: name, rol: role, email: email, password: password });
  localStorage.setItem('usuarios_spa', JSON.stringify(usuariosDB));
  
  actualizarTablaUsuarios();
  applyLiveSettings();

  alert(`✅ ¡Cuenta creada exitosamente!\nYa puedes iniciar sesión como ${role.toUpperCase()}.`);
  backLogin();
}

function actualizarTablaUsuarios() {
  const tbody = document.getElementById('usuariosTableBody');
  if(!tbody) return;
  tbody.innerHTML = "";

  usuariosDB.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><strong>${user.nombre}</strong></td><td>${user.email}</td><td><span class="badge role-${user.rol}">${user.rol}</span></td><td><span class="status-dot"></span> Activo</td>`;
    tbody.appendChild(tr);
  });
}

function addLiveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const desc = document.getElementById('taskDesc').value.trim();
  const col = document.getElementById('taskCol').value;
  if(!title || !desc) return alert("Por favor completa los campos de la tarea.");
  
  scrumTareas.push({ id: Date.now(), titulo: title, desc: desc, col: col, prio: "medium" });
  localStorage.setItem('scrum_spa', JSON.stringify(scrumTareas));
  renderScrumBoard();
  
  document.getElementById('taskTitle').value = ""; 
  document.getElementById('taskDesc').value = "";
}

function renderScrumBoard() {
  const container = document.getElementById('scrumBoardContainer');
  if(!container) return;
  container.innerHTML = `
    <div class="scrum-column"><div class="column-header column-backlog">Backlog</div><div class="scrum-tasks" id="col-backlog"></div></div>
    <div class="scrum-column"><div class="column-header column-progress">En Progreso</div><div class="scrum-tasks" id="col-progress"></div></div>
    <div class="scrum-column"><div class="column-header column-done">Finalizado</div><div class="scrum-tasks" id="col-done"></div></div>
  `;
  scrumTareas.forEach(t => {
    const div = document.createElement('div'); div.className = "task-card";
    div.innerHTML = `<h4>${t.titulo}</h4><p>${t.desc}</p><span class="task-priority ${t.prio}">${t.prio}</span>`;
    const colEl = document.getElementById(`col-${t.col}`); if(colEl) colEl.appendChild(div);
  });
}

function showRegister() { document.getElementById('loginContainer').classList.add('hidden'); document.getElementById('registerContainer').classList.remove('hidden'); }
function backLogin() { document.getElementById('registerContainer').classList.add('hidden'); document.getElementById('loginContainer').classList.remove('hidden'); }
function logout() { usuarioActual = null; document.getElementById('dashboard').classList.add('hidden'); document.getElementById('authWrapper').classList.remove('hidden'); }

function initChart() {
  const ctx = document.getElementById('myChart'); if (!ctx) return;
  if (myChartInstance !== null) myChartInstance.destroy();
  myChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], datasets: [{ label: 'Citas', data: [14, 20, 18, 29, 36, 42, reservasDB.length + 21], backgroundColor: 'rgba(74, 107, 93, 0.05)', borderColor: '#4a6b5d', borderWidth: 3, tension: 0.35 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });
}

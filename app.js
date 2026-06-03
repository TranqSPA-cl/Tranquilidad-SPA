let myChartInstance = null;

// Base de datos local persistente con contraseñas reales configuradas
let usuariosDB = JSON.parse(localStorage.getItem('usuarios_spa')) || [
  { nombre: "Ramiro Vasquez", rol: "dueño", email: "ramiro@spa.com", password: "ramiro123" },
  { nombre: "Valentina Donoso", rol: "masajista", email: "valentina@spa.com", password: "vale2026" },
  { nombre: "Marta del Carmen", rol: "cliente", email: "marta@spa.com", password: "marta77" },
  { nombre: "Juan Riquelme", rol: "recepcionista", email: "juan@spa.com", password: "juanrecep" }
];

// Listado de tareas Scrum mutables desde la UI
let scrumTareas = JSON.parse(localStorage.getItem('scrum_spa')) || [
  { id: 1, titulo: "Crear Login", desc: "Diseñar interfaz con roles seguros.", col: "backlog", prio: "high" },
  { id: 2, titulo: "Gestión de Roles", desc: "Permisos restringidos para clientes.", col: "backlog", prio: "medium" },
  { id: 3, titulo: "Dashboard Modular", desc: "Gráficas dinámicas por Chart.js.", col: "progress", prio: "high" },
  { id: 4, titulo: "Diseño UI Ambiente", desc: "Colores orgánicos relajantes.", col: "done", prio: "low" }
];

// Opciones globales editables sin tocar código
let configuracionGlobal = JSON.parse(localStorage.getItem('config_global_spa')) || {
  tituloSpa: "TRANQUILIDAD SPA",
  ingresos: "$2.500.000",
  reservas: 24
};

let usuarioActual = null;

document.addEventListener("DOMContentLoaded", () => {
  applyLiveSettings();
  actualizarTablaUsuarios();
  renderScrumBoard();
});

// APLICA PARAMETROS CAMBIADOS EN VIVO
function applyLiveSettings() {
  document.getElementById('siteTitleLogin').innerText = configuracionGlobal.tituloSpa;
  document.getElementById('siteTitleSidebar').innerText = configuracionGlobal.tituloSpa;
  document.getElementById('cfgTitle').value = configuracionGlobal.tituloSpa;
  
  document.getElementById('statsIngresos').innerText = configuracionGlobal.ingresos;
  document.getElementById('cfgIngresos').value = configuracionGlobal.ingresos;
  
  document.getElementById('statsReservas').innerText = configuracionGlobal.reservas;
  document.getElementById('cfgReservas').value = configuracionGlobal.reservas;
}

// LOGIN EVALUADO POR ROL Y CONTRASEÑA
function login() {
  const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
  const passwordInput = document.getElementById('loginPassword').value.trim();

  if(!emailInput || !passwordInput) {
    alert("Ingresa tus credenciales por favor.");
    return;
  }

  const usuario = usuariosDB.find(u => u.email === emailInput && u.password === passwordInput);
  
  if(!usuario) {
    alert("❌ Error: Correo o contraseña incorrectos.");
    return;
  }

  usuarioActual = usuario;

  document.getElementById('userDisplay').innerText = usuario.nombre;
  document.getElementById('roleDisplay').innerText = usuario.rol.toUpperCase();

  // Construir barras de opciones basadas en jerarquías
  construirMenuLateral(usuario.rol);

  document.getElementById('authWrapper').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');

  if(usuario.rol === 'cliente') {
    document.getElementById('welcomeCliente').innerText = `¡Bienvenida, ${usuario.nombre}!`;
    showSection('vista-cliente');
  } else {
    showSection('inicio');
  }
}

// ARMAR MENU RESTRINGIDO
function construirMenuLateral(rol) {
  const menuContainer = document.getElementById('sidebarMenu');
  menuContainer.innerHTML = "";

  const opciones = [
    { id: 'inicio', texto: '📊 Inicio', roles: ['dueño', 'recepcionista', 'masajista'] },
    { id: 'vista-cliente', texto: '🌸 Mi Portal', roles: ['cliente'] },
    { id: 'usuarios', texto: '👥 Usuarios', roles: ['dueño', 'recepcionista'] },
    { id: 'reservas', texto: '📅 Reservas', roles: ['dueño', 'recepcionista', 'masajista'] },
    { id: 'scrum', texto: '📋 Scrum Board', roles: ['dueño'] },
    { id: 'configuracion', texto: '⚙️ Admin Master', roles: ['dueño'] }
  ];

  opciones.forEach(opc => {
    if(opc.roles.includes(rol)) {
      const li = document.createElement('li');
      li.className = "nav-item";
      li.innerHTML = opc.texto;
      li.onclick = function() { showSection(opc.id, this); };
      menuContainer.appendChild(li);
    }
  });

  const logoutLi = document.createElement('li');
  logoutLi.className = "nav-item logout-item";
  logoutLi.innerHTML = "🚪 Cerrar Sesión";
  logoutLi.onclick = logout;
  menuContainer.appendChild(logoutLi);
}

// CONTROL SEGURO DE PESTAÑAS
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
    alert("⛔ Acceso denegado.");
    return;
  }

  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.classList.remove('active'));

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  document.getElementById(sectionId).classList.add('active');
  if (element) {
    element.classList.add('active');
  }

  if(sectionId === 'inicio') {
    const finCards = document.querySelectorAll('.perm-financial');
    finCards.forEach(c => {
      usuarioActual.rol === 'masajista' ? c.classList.add('hidden') : c.classList.remove('hidden');
    });
    initChart();
  }
}

// PARAMETRIZACIÓN SIN CÓDIGO (EN VIVO)
function saveLiveConfig() {
  configuracionGlobal.tituloSpa = document.getElementById('cfgTitle').value.trim();
  configuracionGlobal.ingresos = document.getElementById('cfgIngresos').value.trim();
  configuracionGlobal.reservas = parseInt(document.getElementById('cfgReservas').value) || 0;

  localStorage.setItem('config_global_spa', JSON.stringify(configuracionGlobal));
  applyLiveSettings();
  alert("✨ ¡Configuraciones cambiadas en vivo sin tocar código!");
}

// INYECTAR TAREAS SCRUM EN VIVO
function addLiveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const desc = document.getElementById('taskDesc').value.trim();
  const col = document.getElementById('taskCol').value;

  if(!title || !desc) {
    alert("Completa campos de tarea.");
    return;
  }

  scrumTareas.push({ id: Date.now(), titulo: title, desc: desc, col: col, prio: "medium" });
  localStorage.setItem('scrum_spa', JSON.stringify(scrumTareas));
  renderScrumBoard();
  
  document.getElementById('taskTitle').value = "";
  document.getElementById('taskDesc').value = "";
  alert("📋 Tarea añadida al tablero.");
}

// RENDER SCRUM
function renderScrumBoard() {
  const container = document.getElementById('scrumBoardContainer');
  if(!container) return;

  container.innerHTML = `
    <div class="scrum-column"><div class="column-header column-backlog">Backlog</div><div class="scrum-tasks" id="col-backlog"></div></div>
    <div class="scrum-column"><div class="column-header column-progress">En Progreso</div><div class="scrum-tasks" id="col-progress"></div></div>
    <div class="scrum-column"><div class="column-header column-done">Finalizado</div><div class="scrum-tasks" id="col-done"></div></div>
  `;

  scrumTareas.forEach(t => {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-card ${t.col === 'done' ? 'done' : ''}`;
    taskDiv.innerHTML = `<h4>${t.titulo}</h4><p>${t.desc}</p><span class="task-priority ${t.prio}">${t.prio}</span>`;
    const targetCol = document.getElementById(`col-${t.col}`);
    if(targetCol) targetCol.appendChild(taskDiv);
  });
}

// REGISTROS PERSISTENTES
function register() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value.trim();
  const role = document.getElementById('registerRole').value;

  if (!name || !email || !password) {
    alert("Completa todos los datos.");
    return;
  }

  usuariosDB.push({ nombre: name, rol: role, email: email, password: password });
  localStorage.setItem('usuarios_spa', JSON.stringify(usuariosDB));
  actualizarTablaUsuarios();

  alert(`Cuenta creada con éxito.`);
  backLogin();
}

function actualizarTablaUsuarios() {
  const tbody = document.getElementById('usuariosTableBody');
  if(!tbody) return;
  tbody.innerHTML = "";

  usuariosDB.forEach(user => {
    const tr = document.createElement('tr');
    let textoRol = user.rol === 'dueño' ? 'Dueño / Admin' : user.rol;
    tr.innerHTML = `<td><strong>${user.nombre}</strong></td><td><span class="badge role-${user.rol}">${textoRol}</span></td><td><span class="status-dot online"></span> Activo</td>`;
    tbody.appendChild(tr);
  });
}

function showRegister() { document.getElementById('loginContainer').classList.add('hidden'); document.getElementById('registerContainer').classList.remove('hidden'); }
function backLogin() { document.getElementById('registerContainer').classList.add('hidden'); document.getElementById('loginContainer').classList.remove('hidden'); }

function logout() {
  usuarioActual = null;
  document.getElementById('loginEmail').value = "";
  document.getElementById('loginPassword').value = "";
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('authWrapper').classList.remove('hidden');
}

// CONTROL CHART
function initChart() {
  const ctx = document.getElementById('myChart');
  if (!ctx) return;
  if (myChartInstance !== null) myChartInstance.destroy();

  myChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Citas',
        data: [14, 20, 18, 29, 36, 42, 22],
        backgroundColor: 'rgba(74, 107, 93, 0.05)',
        borderColor: '#4a6b5d',
        borderWidth: 3,
        tension: 0.35,
        pointBackgroundColor: '#c5a059',
        pointBorderColor: '#fff',
        pointRadius: 5
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#e3ede8' } }, x: { grid: { display: false } } } }
  });
}
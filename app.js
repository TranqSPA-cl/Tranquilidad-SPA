<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TRANQUILIDAD SPA - Sistema Scrum</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

  <div class="auth-wrapper" id="authWrapper">
    
    <div class="login-card" id="loginContainer">
      <div class="spa-logo">🍃</div>
      <h1 id="siteTitleLogin">TRANQUILIDAD SPA</h1>
      <p class="subtitle">Sistema Scrum</p>
      
      <div class="input-group">
        <input type="email" id="loginEmail" placeholder="Correo electrónico (ej: ramiro@spa.com)" required>
      </div>
      <div class="input-group">
        <input type="password" id="loginPassword" placeholder="Contraseña" required>
      </div>
      
      <button class="btn btn-primary" onclick="login()">Iniciar Sesión</button>
      <button class="btn btn-secondary" onclick="showRegister()">Registrarse como Cliente</button>
    </div>

    <div class="login-card hidden" id="registerContainer">
      <div class="spa-logo">🌸</div>
      <h1>Crear Cuenta</h1>
      <p class="subtitle">Únete al equipo</p>
      
      <div class="input-group">
        <input type="text" id="registerName" placeholder="Nombre completo">
      </div>
      <div class="input-group">
        <input type="email" id="registerEmail" placeholder="Correo electrónico">
      </div>
      <div class="input-group">
        <input type="password" id="registerPassword" placeholder="Contraseña">
      </div>
      <div class="input-group">
        <select id="registerRole">
          <option value="cliente">Cliente</option>
          <option value="recepcionista">Recepcionista</option>
          <option value="masajista">Masajista</option>
        </select>
      </div>
      
      <button class="btn btn-primary" onclick="register()">Crear Cuenta</button>
      <button class="btn btn-secondary" onclick="backLogin()">Volver al Login</button>
    </div>
  </div>

  <div class="dashboard hidden" id="dashboard">
    
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span>🍃</span> <span id="siteTitleSidebar">Tranquilidad</span>
      </div>
      <div class="user-profile-status">
        <p id="userDisplay">Usuario</p>
        <span class="badge" id="roleDisplay">Rol</span>
      </div>
      
      <ul id="sidebarMenu">
        </ul>
      
      <div class="sidebar-location-box">
        📍 <strong>Ubicación:</strong>
        <p id="sidebarLocationText">Cargando dirección...</p>
      </div>
    </aside>

    <main class="main-content">
      
      <section id="inicio" class="section">
        <div class="section-header">
          <h1>Panel de Control</h1>
          <p>Resumen general de actividad</p>
        </div>
        
        <div class="cards-grid">
          <div class="card card-accent">
            <div class="card-icon">📅</div>
            <div>
              <h3>Reservas Totales</h3>
              <p class="card-value" id="statsReservas">24</p>
            </div>
          </div>
          <div class="card card-accent perm-financial">
            <div class="card-icon">👥</div>
            <div>
              <h3>Clientes Registrados</h3>
              <p class="card-value" id="statsClientes">120</p>
            </div>
          </div>
          <div class="card card-accent perm-financial">
            <div class="card-icon">💰</div>
            <div>
              <h3>Ingresos Estimados</h3>
              <p class="card-value" id="statsIngresos">$2.500.000</p>
            </div>
          </div>
        </div>

        <div class="chart-wrapper">
          <h3>Flujo de Clientes Semanal</h3>
          <div class="chart-container">
            <canvas id="myChart"></canvas>
          </div>
        </div>
      </section>

      <section id="vista-cliente" class="section">
        <div class="section-header">
          <h1 id="welcomeCliente">¡Bienvenido a Tu Portal!</h1>
          <p>Gestiona tus terapias de bienestar, compra masajes y agenda citas.</p>
        </div>
        
        <h2>🌿 Nuestro Catálogo de Bienestar</h2>
        <div class="catalog-grid" id="catalogGrid">
          </div>

        <div class="booking-form-box">
          <h3>📅 Agendar una Cita Nueva</h3>
          <p class="subtitle-box">Selecciona el tratamiento que compraste o deseas tomar:</p>
          
          <div class="form-row">
            <div class="form-group">
              <label>Selecciona el Servicio:</label>
              <select id="reservaServicio">
                <option value="Masaje Relajante Piedras Volcánicas">Masaje Relajante Piedras Volcánicas - $45.000</option>
                <option value="Terapia Descontracturante Profunda">Terapia Descontracturante Profunda - $55.000</option>
                <option value="Facial Hidratante Orgánico">Facial Hidratante Orgánico - $35.000</option>
                <option value="Circuito de Sauna y Jacuzzi Extremo">Circuito de Sauna y Jacuzzi Extremo - $60.000</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha y Hora:</label>
              <input type="datetime-local" id="reservaFechaHora">
            </div>
            <div class="form-group">
              <label>Especialista sugerido:</label>
              <select id="reservaEspecialista">
                <option value="Valentina Donoso">Valentina Donoso (Masajista)</option>
                <option value="Cualquier especialista disponible">Cualquier especialista disponible</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary" style="width: auto; padding: 12px 30px; margin-top: 15px;" onclick="crearReservaCliente()">Confirmar y Agendar Cita</button>
        </div>
      </section>

      <section id="usuarios" class="section">
        <div class="section-header">
          <h1>Gestión de Personal y Clientes</h1>
          <p>Control de acceso de usuarios registrados (Sincronizado en tiempo real)</p>
        </div>
        <div class="table-container">
          <table class="spa-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol Asignado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody id="usuariosTableBody">
              </tbody>
          </table>
        </div>
      </section>

      <section id="reservas" class="section">
        <div class="section-header">
          <h1>Próximas Reservas</h1>
          <p>Tratamientos programados en la jornada por los clientes</p>
        </div>
        <div class="bookings-grid" id="bookingsGrid">
          </div>
      </section>

      <section id="scrum" class="section">
        <div class="section-header">
          <h1>Scrum Board Técnico</h1>
          <p>Sprint del sistema operativo interno</p>
        </div>
        <div class="scrum-board" id="scrumBoardContainer">
          </div>
      </section>

      <section id="configuracion" class="section">
        <div class="section-header">
          <h1>⚙️ Panel Admin Master</h1>
          <p>Modifica parámetros globales del SPA directamente desde la pantalla.</p>
        </div>
        
        <div class="config-container">
          <div class="config-card-form">
            <h3>Personalización Visual y Datos</h3>
            <div class="form-group">
              <label>Nombre Comercial del SPA:</label>
              <input type="text" id="cfgTitle" value="TRANQUILIDAD SPA">
            </div>
            <div class="form-group">
              <label>📍 Dirección Física del SPA (Ubicación):</label>
              <input type="text" id="cfgUbicacion" value="Av. Vitacura 4500, Santiago">
            </div>
            <button class="btn btn-primary" onclick="saveLiveConfig()">Aplicar Cambios Globales</button>
          </div>

          <div class="config-card-form">
            <h3>Control Operativo Dinámico</h3>
            <div class="form-group">
              <label>Simular Ingresos Mensuales ($):</label>
              <input type="text" id="cfgIngresos" value="$2.500.000">
            </div>
            <button class="btn btn-primary" onclick="saveLiveConfig()">Actualizar Métricas financieros</button>
          </div>

          <div class="config-card-form">
            <h3>Añadir Tarea al Scrum Board</h3>
            <div class="form-group">
              <label>Título de la Tarea:</label>
              <input type="text" id="taskTitle" placeholder="Ej: Pasarela de pagos">
            </div>
            <div class="form-group">
              <label>Descripción:</label>
              <input type="text" id="taskDesc" placeholder="Detalles...">
            </div>
            <div class="form-group">
              <label>Columna Scrum:</label>
              <select id="taskCol">
                <option value="backlog">Backlog</option>
                <option value="progress">En Progreso</option>
                <option value="done">Finalizado</option>
              </select>
            </div>
            <button class="btn btn-secondary" onclick="addLiveTask()">Insertar al Tablero</button>
          </div>
        </div>
      </section>

    </main>
  </div>

  <script src="app.js"></script>
</body>
</html>

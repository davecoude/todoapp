// Estado de la aplicación: Intentar cargar de localStorage, si no hay nada, iniciar vacío
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// HU-01: Soporte para la tecla Enter
function handleInputKey(event) {
  if (event.key === "Enter") {
    addTask();
  }
}

// HU-01: Agregar tarea y validación de longitud mínima
function addTask() {
  const input = document.getElementById('taskInput');
  const errorMsg = document.getElementById('inputError');
  const text = input.value.trim();

  // Validación: no vacío y mínimo 3 caracteres
  if (!text || text.length < 3) {
    errorMsg.textContent = text.length === 0
      ? 'Escribe una tarea antes de agregar.'
      : 'La tarea debe tener al menos 3 caracteres.';
    input.focus();
    return;
  }

  errorMsg.textContent = ''; // Limpiar error previo
  tasks.push({ id: Date.now(), text, done: false });
  input.value = '';
  input.focus(); // Mantener foco para agregar rápido
  render();
}

// HU-02: toggle con timestamp de completado
function toggleTask(id) {
  tasks = tasks.map((t) => {
    if (t.id !== id) return t;
    return {
      ...t,
      done: !t.done,
      completedAt: !t.done
        ? new Date().toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
    };
  });
  render();
}

// HU-03: Eliminar tarea
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

// HU-05: Filtrar tareas
function filterTasks(filter) {
  currentFilter = filter;
  render();
}

// HU-04: Actualizar contador, guardar en localStorage y renderizar lista
function render() {
  const list = document.getElementById("taskList");
  const counter = document.getElementById("counter");

  // Guardar el estado actual en localStorage antes de pintar
  localStorage.setItem("tasks", JSON.stringify(tasks));

  const filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  list.innerHTML = filtered
  .map(
    (t) => `
  <li class="${t.done ? "done" : ""}">
    <label class="task-label">
      <input 
        type="checkbox" 
        ${t.done ? "checked" : ""} 
        onchange="toggleTask(${t.id})"
        aria-label="Marcar tarea: ${t.text}">
      <span>${t.text}</span>
      ${
        t.done && t.completedAt
          ? `<small class="completed-time">✓ ${t.completedAt}</small>`
          : ""
      }
    </label>
    <button class="delete-btn" onclick="deleteTask(${t.id})">Eliminar</button>
  </li>
`,
  )
  .join("");

  const pending = tasks.filter((t) => !t.done).length;
  counter.textContent = `Tareas pendientes: \${pending}`;
}

// Ejecutar el render inicial para mostrar las tareas guardadas al abrir la app
render();
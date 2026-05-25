// Estado de la aplicación
let tasks = [];
let currentFilter = "all";

// HU-01: Agregar tarea y soporte Enter + validación de longitud mínima
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

// Soporte para tecla Enter
function handleInputKey(event) {
  if (event.key === 'Enter') addTask();
}

// HU-02: Marcar como completada
function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
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

// HU-04: Actualizar contador y renderizar lista
function render() {
  const list = document.getElementById("taskList");
  const counter = document.getElementById("counter");

  const filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  list.innerHTML = filtered
    .map(
      (t) => `
    <li class="${t.done ? "done" : ""}">
      <span onclick="toggleTask(${t.id})" style="cursor:pointer">${t.text}</span>
      <button class="delete-btn" onclick="deleteTask(${t.id})">Eliminar</button>
    </li>
  `,
    )
    .join("");

  const pending = tasks.filter((t) => !t.done).length;
  counter.textContent = `Tareas pendientes: ${pending}`;
}

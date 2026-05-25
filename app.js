// Estado de la aplicación encapsulado
const state = {
  tasks: JSON.parse(localStorage.getItem("tasks")) || [],
  currentFilter: "all"
};

// Selectores del DOM cacheados
const DOM = {
  input: document.getElementById('taskInput'),
  errorMsg: document.getElementById('inputError'),
  addBtn: document.getElementById('addTaskBtn'),
  list: document.getElementById("taskList"),
  counter: document.getElementById("counter"),
  filtersGroup: document.getElementById("filtersGroup")
};

// HU-01: Agregar tarea con validación robusta
function addTask() {
  const text = DOM.input.value.trim();

  if (!text || text.length < 3) {
    DOM.errorMsg.textContent = text.length === 0
      ? 'Escribe una tarea antes de agregar.'
      : 'La tarea debe tener al menos 3 caracteres.';
    DOM.input.focus();
    return;
  }

  DOM.errorMsg.textContent = ''; 
  state.tasks.push({ 
    id: Date.now(), 
    text, 
    done: false,
    completedAt: null 
  });
  
  DOM.input.value = '';
  DOM.input.focus();
  render();
}

// HU-02: Alternar estado con timestamp localizado
function toggleTask(id) {
  state.tasks = state.tasks.map((task) => {
    if (task.id !== id) return task;
    const nextDone = !task.done;
    return {
      ...task,
      done: nextDone,
      completedAt: nextDone
        ? new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
        : null
    };
  });
  render();
}

// HU-03: Eliminar tarea
function deleteTask(id) {
  state.tasks = state.tasks.filter((task) => task.id !== id);
  render();
}

// HU-04: Gestión de filtros de visualización
function setFilter(filter) {
  state.currentFilter = filter;
  render();
}

// Generador seguro de plantillas HTML para prevenir inyecciones XSS
function createTaskDOMElement(task) {
  const li = document.createElement("li");
  if (task.done) li.classList.add("done");

  const label = document.createElement("label");
  label.className = "task-label";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", `Marcar tarea: ${task.text}`);
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const textSpan = document.createElement("span");
  textSpan.textContent = task.text; // Seguro contra XSS

  label.appendChild(checkbox);
  label.appendChild(textSpan);

  if (task.done && task.completedAt) {
    const timeSmall = document.createElement("small");
    timeSmall.className = "completed-time";
    timeSmall.textContent = `✓ ${task.completedAt}`;
    label.appendChild(timeSmall);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Eliminar";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  li.appendChild(label);
  li.appendChild(deleteBtn);
  return li;
}

// Motor de Renderizado
function render() {
  // Sincronización con almacenamiento local
  localStorage.setItem("tasks", JSON.stringify(state.tasks));

  // Renderizador de filtros activos
  Array.from(DOM.filtersGroup.children).forEach((btn) => {
    const isCurrent = btn.dataset.filter === state.currentFilter;
    btn.classList.toggle("active", isCurrent);
  });

  // Filtrado lógico
  const filteredTasks = state.tasks.filter((task) => {
    if (state.currentFilter === "active") return !task.done;
    if (state.currentFilter === "done") return task.done;
    return true;
  });

  // Reconstrucción del contenedor de lista de forma limpia y segura
  DOM.list.innerHTML = "";
  filteredTasks.forEach(task => {
    DOM.list.appendChild(createTaskDOMElement(task));
  });

  // Actualización del contador
  const pendingCount = state.tasks.filter((task) => !task.done).length;
  DOM.counter.textContent = `Tareas pendientes: ${pendingCount}`;
}

// Inicializador de Event Listeners modernos (Cero código JS en HTML)
function initEventListeners() {
  DOM.addBtn.addEventListener("click", addTask);
  
  DOM.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });

  DOM.filtersGroup.addEventListener("click", (e) => {
    const filterBtn = e.target.closest("button");
    if (filterBtn) {
      setFilter(filterBtn.dataset.filter);
    }
  });
}

// Inicialización de la aplicación
initEventListeners();
render();

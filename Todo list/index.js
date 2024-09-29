// Classes for Todo and Project
class Todo {
    constructor(title, dueDate) {
      this.title = title;
      this.dueDate = dueDate;
      this.completed = false;
    }
  }
  
  class Project {
    constructor(name) {
      this.name = name;
      this.todos = [];
    }
  
    addTodo(todo) {
      this.todos.push(todo);
    }
  }
  
  // Local storage functions
  function saveProjectsToLocalStorage(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }
  
  function loadProjectsFromLocalStorage() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    return projects.map(projectData => {
      const project = new Project(projectData.name);
      project.todos = projectData.todos.map(todo => new Todo(todo.title, todo.dueDate));
      return project;
    });
  }
  
  // App logic
  const projects = loadProjectsFromLocalStorage();
  let activeProjectIndex = 0;
  
  function renderProjects() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';
    projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.textContent = project.name;
      li.addEventListener('click', () => {
        activeProjectIndex = index;
        renderTodos();
      });
      projectList.appendChild(li);
    });
  }
  
  function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
  
    const activeProject = projects[activeProjectIndex];
    document.getElementById('project-title').textContent = activeProject.name;
  
    activeProject.todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.textContent = `${todo.title} (Due: ${todo.dueDate})`;
      li.addEventListener('click', () => {
        showTodoDetails(todo);
      });
      todoList.appendChild(li);
    });
  }
  
  function showTodoDetails(todo) {
    const details = document.getElementById('todo-details-content');
    details.innerHTML = `
      <p>Title: ${todo.title}</p>
      <p>Due Date: ${todo.dueDate}</p>
      <p>Completed: ${todo.completed}</p>
    `;
  }
  
  // Add project event listener
  document.getElementById('add-project').addEventListener('click', () => {
    const projectName = document.getElementById('new-project').value;
    if (projectName) {
      const project = new Project(projectName);
      projects.push(project);
      document.getElementById('new-project').value = '';
      saveProjectsToLocalStorage(projects);
      renderProjects();
    }
  });
  
  // Add todo event listener
  document.getElementById('add-todo').addEventListener('click', () => {
    const todoTitle = document.getElementById('new-todo-title').value;
    const dueDate = document.getElementById('new-todo-date').value;
    if (todoTitle && dueDate) {
      const todo = new Todo(todoTitle, dueDate);
      projects[activeProjectIndex].addTodo(todo);
      document.getElementById('new-todo-title').value = '';
      document.getElementById('new-todo-date').value = '';
      saveProjectsToLocalStorage(projects);
      renderTodos();
    }
  });
  
  // Initial render
  renderProjects();
  renderTodos();
  
import './assets/scss/style.scss';

// switch theme
const body = document.body;
const themeToggle = document.querySelector('#theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

body.classList.add(`${currentTheme}-theme`);

document.addEventListener('DOMContentLoaded',() => {
  if (currentTheme === "dark") {
    themeToggle.src = './images/icon-sun.svg';
  } else if (currentTheme === "light") {
    themeToggle.src = './images/icon-moon.svg';
  }
});

themeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('light-theme')) {
      document.body.classList.replace('light-theme', 'dark-theme');
      themeToggle.src = './images/icon-sun.svg'
      localStorage.setItem('theme', 'dark');
  } else {
      document.body.classList.replace('dark-theme', 'light-theme');
      themeToggle.src = './images/icon-moon.svg'
      localStorage.setItem('theme', 'light');
  }
});


// add task
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.querySelector('#list-items');
const itemLeft = document.getElementById('item-left');

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTaskText = taskInput.value.trim();
  if (newTaskText === '') return;
  
  addTask(newTaskText, false)
  taskInput.value = '';

  saveTasks();
  countItems();
})

function addTask(text, completed){
  taskList.innerHTML += `
  <div class="list-item" id="list-item" draggable="true">
    <div class="input-container">
      <input type="checkbox" ${completed ? 'checked' : ''} id="checkbox">
        <p>${text}</p>
    </div>
    <div class="delete-btn-container">
      <img class="delete-btn" id="delete-btn" src="./images/icon-cross.svg" alt="">
    </div>
  </div>
  `
}

// count left items
function countItems() {
  itemLeft.textContent = taskList.querySelectorAll('#list-item').length;
}


// store tasks to local storage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('#list-item').forEach(item => {
    const taskText = item.querySelector('p').textContent;
    const taskCompleted = item.querySelector('input[type="checkbox"]').checked;
    tasks.push({ text: taskText, completed: taskCompleted });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    addTask(task.text, task.completed);
  });
  countItems();
}

loadTasks();

// delete task
const deleteBtns = document.querySelectorAll('#delete-btn');

deleteBtns.forEach( btn => {
  btn.addEventListener('click', () => {
    btn.closest('#list-item').remove();
    saveTasks();
    countItems();
  })
})

// toggle task
const toggleChecks = document.querySelectorAll('#checkbox');

toggleChecks.forEach ( toggle => {
  toggle.addEventListener('click', () => {
  toggle.toggleAttribute('checked');
  saveTasks();
  countItems();
  })
})


// filter category
const allFilters = document.querySelectorAll('#filter-all');
const activeFilters = document.querySelectorAll('#filter-active');
const completedFilters = document.querySelectorAll('#filter-completed');

allFilters.forEach((allFilter) => {
  allFilter.addEventListener('click', function() {
    setFilter('all');
    allFilter.classList.add('selected');
  });
})

activeFilters.forEach((activeFilter) => {
  activeFilter.addEventListener('click', function() {
    setFilter('active');
    activeFilter.classList.add('selected');
  });
})

completedFilters.forEach((completedFilter) => {
  completedFilter.addEventListener('click', function() {
    setFilter('completed');
    completedFilter.classList.add('selected');
  });
})

function setFilter(filter) {
  resetStyle();
  taskList.querySelectorAll('#list-item').forEach(item => {
    if (filter === 'all') {
      item.style.display = 'flex';
      
    } else if (filter === 'active') {
      if (item.querySelector('input[type="checkbox"]').checked) {
        item.style.display = 'none';
      } else {
        item.style.display = 'flex';
      }
    } else if (filter === 'completed') {
      if (item.querySelector('input[type="checkbox"]').checked) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    }
  });

  function resetStyle() {
    document.querySelectorAll('.filter ul li').forEach(li => {
      li.classList.remove('selected');
    });
    document.querySelectorAll('.mobile-filter ul li').forEach(li => {
      li.classList.remove('selected');
    });
  }
}

setFilter('all');   // Initialize with all filter

// clear completed
const clearBtn = document.querySelector('#clear-completed');

clearBtn.addEventListener('click', () => {
  taskList.querySelectorAll('.list-item').forEach(item => {
    if (item.querySelector('input[type="checkbox"]').checked) {
      item.remove();
    }
  })
  saveTasks();
})


// drag n drop
let draggedItem = null;
let placeholder = document.createElement('div');
placeholder.classList.add('list-item', 'placeholder');

taskList.querySelectorAll('#list-item').forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
    item.addEventListener('drop', drop);
});

function allowDrop(e) {
  e.preventDefault();
}

function dragStart(e) {
    draggedItem = this;
    setTimeout(() => {
        this.classList.add('dragging');
        this.style.display = 'none'; // Hide the dragged item
    }, 0);
}

function dragEnd(e) {
    this.classList.remove('dragging');
    this.style.display = 'flex'; // Show the dragged item
    placeholder.remove();
    draggedItem = null;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    if (this !== draggedItem) {
      const rect = this.getBoundingClientRect();
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
      taskList.insertBefore(placeholder, this.nextSibling);
      taskList.insertBefore(placeholder, next && this.nextSibling || this);
    }
}

function dragLeave(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    if (draggedItem) {
      taskList.insertBefore(draggedItem, placeholder);
        placeholder.remove();
    }
}
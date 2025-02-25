import { useState, useEffect, useRef } from 'react';
import Filter from './components/Filter';

// FIXME: Drag n Drop fail
// FIXME: Cannot delete the last item from localStorage
// FIXME: Initial window is over 100vh

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [tempData, setTempData] = useState({
    task: '',
    isCompleted: false,
    id: 0,
  });

  // switch theme

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.classList.add(`${theme}-theme`);

    return () => {
      document.body.classList.remove(`${theme}-theme`);
    };
  }, [theme]);

  const toggleTheme = () => {
    let newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);

    localStorage.setItem('theme', newTheme);
  };

  // add task

  let num = tasks.length;

  function handleAddTask(e) {
    e.preventDefault();

    num++;

    setTasks([...tasks, { task: tempData.task, isCompleted: false, id: num }]);

    setTempData('');
  }

  // count left items

  // store tasks to local storage

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, filter]);

  // loadTasks;

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // delete task

  function deleteTask(id) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  // toggle task

  // filter category

  // clear completed

  function deleteCompletedTasks() {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.isCompleted !== true)
    );
  }

  // drag n drop

  // const draggedItem = useRef(null);
  // const [dragOverIndex, setDragOverIndex] = useState(null);

  // const handleDragStart = (e, index) => {
  //   draggedItem.current = index;
  //   setTimeout(() => {
  //     e.target.classList.add('dragging');
  //     e.target.style.display = 'none';
  //   }, 0);
  // };

  // const handleDragEnd = (e) => {
  //   e.target.classList.remove('dragging');
  //   e.target.style.display = 'flex';
  //   setDragOverIndex(null);
  //   draggedItem.current = null;
  // };

  // const handleDragOver = (e, index) => {
  //   e.preventDefault();
  //   if (draggedItem.current !== index) {
  //     setDragOverIndex(index);
  //   }
  // };

  // const handleDrop = (e, index) => {
  //   e.preventDefault();
  //   if (draggedItem.current !== null && draggedItem.current !== index) {
  //     const newTasks = [...tasks];
  //     const draggedTask = newTasks.splice(draggedItem.current, 1)[0];
  //     newTasks.splice(index, 0, draggedTask);
  //     setTasks(newTasks);
  //   }
  //   setDragOverIndex(null);
  // };

  return (
    <div className="container wrapper">
      <header>
        <h1>Todo</h1>
        <div>
          <img
            className="theme-toggle"
            id="theme-toggle"
            src={`./images/icon-${theme === 'light' ? 'sun' : 'moon'}.svg`}
            onClick={toggleTheme}
            alt="theme-toggle"
          />
        </div>
      </header>
      <main>
        <form
          onSubmit={handleAddTask}
          className="input-field list-item"
          id="task-form"
        >
          <div className="input-container">
            <input type="checkbox" readOnly />
            <input
              type="text"
              placeholder="Create a new todo..."
              id="task-input"
              value={tempData.task || ''}
              onChange={(e) =>
                setTempData({
                  ...tempData,
                  task: e.target.value,
                })
              }
            />
          </div>
        </form>
        <div className="list">
          <div className="list-items" id="list-items">
            {tasks.length > 0 &&
              tasks
                .filter(
                  (task) =>
                    filter === 'all' || task.isCompleted === (filter === 'true')
                )
                .map((task, index) => (
                  <div key={index}>
                    {/* {dragOverIndex === index && (
                      <li
                        className="placeholder"
                        style={{
                          height: '80px',
                          background: '#ddd',
                          margin: '5px 0',
                        }}
                      ></li>
                    )} */}
                    <div
                      className="list-item"
                      id="list-item"
                      // draggable="true"
                      // onDragStart={(e) => handleDragStart(e, index)}
                      // onDragEnd={handleDragEnd}
                      // onDragOver={(e) => handleDragOver(e, index)}
                      // onDrop={(e) => handleDrop(e, index)}
                    >
                      <div className="input-container">
                        <input
                          type="checkbox"
                          id="checkbox"
                          checked={task.isCompleted}
                          onChange={(e) =>
                            setTasks(
                              tasks.map((item) =>
                                item.id === task.id
                                  ? { ...task, isCompleted: e.target.checked }
                                  : item
                              )
                            )
                          }
                        />
                        <p>{task.task}</p>
                      </div>
                      <div
                        className="delete-btn-container"
                        onClick={() => {
                          deleteTask(task.id);
                        }}
                      >
                        <img
                          className="delete-btn"
                          id="delete-btn"
                          src="./images/icon-cross.svg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                ))}
            {/* {dragOverIndex === tasks.length && (
              <li
                className="placeholder"
                style={{ height: '80px', background: '#ddd', margin: '5px 0' }}
              ></li>
            )} */}
          </div>
          <div className="list-total">
            <div>
              <span id="item-left">{tasks.filter((task) => task.isCompleted === false).length}</span> items left
            </div>
            <div className="filter">
              <Filter filter={filter} setFilter={setFilter} />
              {/* <ul>
                <li
                  id="filter-all"
                  className={`${filter === 'all' ? 'selected' : ''}`}
                  onClick={() => {
                    setFilter('all');
                  }}
                >
                  All
                </li>
                <li
                  id="filter-active"
                  className={`${filter === 'false' ? 'selected' : ''}`}
                  onClick={() => {
                    setFilter('false');
                  }}
                >
                  Active
                </li>
                <li
                  id="filter-completed"
                  className={`${filter === 'true' ? 'selected' : ''}`}
                  onClick={() => {
                    setFilter('true');
                  }}
                >
                  Completed
                </li>
              </ul> */}
            </div>
            <div
              id="clear-completed"
              className="clear-completed"
              onClick={deleteCompletedTasks}
            >
              Clear Completed
            </div>
          </div>
        </div>
        {/* TODO: 元件化 */}
        <div className="mobile-filter">
        <Filter filter={filter} setFilter={setFilter} />
          {/* <ul>
            <li
              id="filter-all"
              className="selected"
              onClick={() => {
                setFilter('all');
              }}
            >
              All
            </li>
            <li
              id="filter-active"
              onClick={() => {
                setFilter('false');
              }}
            >
              Active
            </li>
            <li
              id="filter-completed"
              onClick={() => {
                setFilter('true');
              }}
            >
              Completed
            </li>
          </ul> */}
        </div>
      </main>
      {/* <div className="drag-n-drop">
        <p>Drag and drop to reorder list</p>
      </div> */}

      <footer>
        <div className="attribution">
          Challenge by{' '}
          <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
            Frontend Mentor
          </a>
          . Coded by <a href="https://github.com/angela-tylee">angelalee</a>.
        </div>
      </footer>
    </div>
  );
};

export default App;

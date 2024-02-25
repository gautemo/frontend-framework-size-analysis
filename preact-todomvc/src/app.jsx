import { signal, computed, effect } from '@preact/signals'

const STORAGE_KEY = 'todos-preact'

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed)
}

const visibility = signal('all')

function onHashChange() {
  const route = window.location.hash.replace(/#\/?/, '')
  if (filters[route]) {
    visibility.value = route
  } else {
    window.location.hash = ''
    visibility.value = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

const editedTodo = signal(null);
const todos = signal(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const filteredTodos = computed(() => filters[visibility.value](todos.value))
const remaining = computed(() => filters.active(todos.value).length)

export function App() {
  const addTodo = (event) => {
    if (event.key === 'Enter') {
      const value = event.target.value.trim()
      if (value) {
        todos.value = [...todos.value,
          {
            id: Date.now(),
            title: value,
            completed: false,
          }
        ]
        event.target.value = ''
      }
    }
  }

  const removeTodo = (index) => {
    const array = [...todos.value]
    array.splice(index, 1)
    todos.value = array
  }

  const toggleAll = (e) => {
    todos.value = todos.value.map(v => ({...v, completed: e.target.checked}))
  }

  const editTodo = (index) => {
    editedTodo.value = index
    setTimeout(() => {
      document.querySelector('.todo-edit').focus()
    }, 10);
  }
  
  const doneEdit = (value, index) => {
    if (editedTodo.value !== null) {
      editedTodo.value = null
      if(value) {
        todos.value = todos.value.map((t,i) => i === index ? {...t, title: value} : t)
      } else {
        removeTodo(index)
      }
    }
  }

  const removeCompleted = () => {
    todos.value = filters.active(todos.value)
  }

  effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
  })

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          autoFocus
          placeholder="What needs to be done?"
          onKeyDown={addTodo}
        />
      </header>
      <section className="main" style={{ display: todos.value.length ? '' : 'none' }}>
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={remaining.value === 0}
          onChange={toggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {
            filteredTodos.value.map((todo, index) => (
              <li
                className={`todo ${todo.completed ? 'completed' : ''} ${index === editedTodo.value ? 'editing' : ''}`}
                key={todo.id}
              >
                <div className="view">
                  <input 
                    className="toggle" 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={e => todos.value = todos.value.map(v => v.id === todo.id ? {...v, completed: e.target.checked} : v)} 
                  />
                  <label onDblClick={() => editTodo(index)}>{todo.title}</label>
                  <button className="destroy" onClick={() => removeTodo(index)}>x</button>
                </div>
                {
                  index === editedTodo.value && 
                  <input
                    className="edit"
                    type="text"
                    v-model="todo.title"
                    class="todo-edit"
                    value={todo.title}
                    onBlur={(e) => doneEdit(e.target.value.trim(), index)}
                    onKeyUp={e => {
                      if(e.key === 'Enter'){
                        doneEdit(e.target.value.trim(), index)
                      }
                      if(e.key === 'Escape'){
                        editedTodo.value = null
                      }
                    }}
                  />
                }
              </li>
            ))
          }
        </ul>
      </section>
      <footer className="footer" style={{ display: todos.value.length ? '' : 'none' }}>
        <span className="todo-count">
          <strong>{ remaining }</strong>
          <span>{ remaining === 1 ? 'item' : 'items' } left</span>
        </span>
        <ul className="filters">
        <li>
          <a href="#/all" className={ visibility === 'all' ? 'selected' : '' }>All</a>
        </li>
        <li>
          <a href="#/active" className={ visibility === 'active' ? 'selected' : '' }>Active</a>
        </li>
        <li>
          <a href="#/completed" className={ visibility === 'completed' ? 'selected' : '' }>Completed</a>
        </li>
      </ul>
      <button className="clear-completed" onClick={removeCompleted} style={{ display: todos.value.length > remaining ? '' : 'none' }}>
        Clear completed
      </button>
      </footer>
    </section >
  )
}

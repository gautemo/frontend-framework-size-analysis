import { createSignal, createMemo, createEffect, onCleanup } from 'solid-js'
import { createStore } from "solid-js/store";
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'

const STORAGE_KEY = 'storage-solid'

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

const setFocus = (el) => setTimeout(() => el.focus());

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed)
}

let beforeEditCache = ''

function App() {
  const [todos, setTodos] = createSignal(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  const [visibility, setVisibility] = createSignal('all')
  const filteredTodos = () => {
    return filters[visibility()](todos())
  }
  const remaining = () => {
    return filters.active(todos()).length
  }

  const [editedTodo, setEditedTodo] = createSignal(null);

  const addTodo = (event) => {
    if (event.key === 'Enter') {
      const value = event.target.value.trim()
      if (value) {
        setTodos([...todos(), {
          id: Date.now(),
          title: value,
          completed: false,
        }])
        event.target.value = ''
      }
    }
  }

  const removeTodo = (todo) => {
    const array = [...todos()]
    array.splice(array.indexOf(todo), 1)
    setTodos(array)
  }

  const toggleCompleted = (changeTodo) => {
    setTodos(todos().map(todo => todo.id === changeTodo.id ? { ...todo, completed: !changeTodo.completed } : todo))
  }

  const toggleAll = (checked) => {
    setTodos(todos().map(todo => ({ ...todo, completed: checked })))
  }

  const editTodo = (todo) => {
    beforeEditCache = todo.title
    setEditedTodo(todo)
  }

  const editTodoTitle = (changeTodo, title) => {
    setTodos(todos().map(todo => todo.id === changeTodo.id ? { ...todo, title } : todo))
  }

  const cancelEdit = (todo) => {
    setEditedTodo(null)
    setTodos(todos().map(t => t.id === todo.id ? { ...todo, title: beforeEditCache } : t))
  }
  
  const doneEdit = (todo) => {
    if(editedTodo){
      setEditedTodo(null)
      const trimmedTitle = todo.title.trim()
      setTodos(list => list.map(t => t.id === todo.id ? { ...todo, title: trimmedTitle } : t))
      if (!trimmedTitle) removeTodo(todo)
    }
  }

  const removeCompleted = () => {
    setTodos(filters.active(todos()))
  }

  createEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos()))
  })

  function onHashChange() {
    const route = window.location.hash.replace(/#\/?/, '')
    if (filters[route]) {
      setVisibility(route)
    } else {
      window.location.hash = ''
      setVisibility('all')
    }
  }
  
  window.addEventListener('hashchange', onHashChange)
  onHashChange()

return (
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" onKeyDown={addTodo} />
    </header>

    <Show when={todos().length > 0}>
      <section class="main">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          checked={!remaining()}
          onInput={({ target: { checked } }) => toggleAll(checked)}
        />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <For each={filteredTodos()}>
            {(todo) => (
              <li
                class="todo"
                classList={{ editing: editedTodo()?.id === todo.id, completed: todo.completed }}
              >
                <div class="view">
                  <input class="toggle" type="checkbox" checked={todo.completed} onInput={() => toggleCompleted(todo)}/>
                  <label onDblClick={() => editTodo(todo)}>{todo.title}</label>
                  <button class="destroy" onClick={[removeTodo, todo.id]}>x</button>
                </div>
                <Show when={editedTodo()?.id === todo.id}>
                  <input
                    class="edit"
                    value={todo.title}
                    onInput={e => todo.title = e.target.value}
                    onFocusOut={() => doneEdit(todo)}
                    onKeyUp={(e) => {
                      if (e.keyCode === ENTER_KEY) {
                        doneEdit(todo)
                      } else if (e.keyCode === ESCAPE_KEY) {
                        cancelEdit(todo)
                      }
                    }}
                    use:setFocus
                  />
                </Show>
              </li>
            )}
          </For>
        </ul>
      </section>

      <footer class="footer">
        <span class="todo-count">
          <strong>{remaining()}</strong>{" "}
          {remaining() === 1 ? " item " : " items "} left
        </span>
        <ul class="filters">
          <li><a href="#/" classList={{selected: visibility() === "all"}}>All</a></li>
          <li><a href="#/active" classList={{selected: visibility() === "active"}}>Active</a></li>
          <li><a href="#/completed" classList={{selected: visibility() === "completed"}}>Completed</a></li>
        </ul>
        <Show when={remaining() !== todos().length}>
          <button class="clear-completed" onClick={removeCompleted}>
            Clear completed
          </button>
        </Show>
      </footer>
    </Show>
  </section>
  )
}

export default App

/* Inspiration: https://gist.github.com/ryansolid/aa5bd12ed4e2f9d592c4b23e58d6fa85#file-solid-todo-jsx */
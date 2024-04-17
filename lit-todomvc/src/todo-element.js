import { LitElement, html } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed)
}
let beforeEditCache = ''
const STORAGE_KEY = 'todos-lit'

export class TodoElement extends LitElement {
  static get properties() {
    return {
      todos: { type: Array },
      visibility: { type: String },
    }
  }

  constructor() {
    super()
    const onhashchange = () => {
      const route = window.location.hash.replace(/#\/?/, '')
      if (['all', 'active', 'completed'].includes(route)) {
        this.visibility = route
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
    }
    window.addEventListener('hashchange', onhashchange)
    onhashchange()
    this.todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  }

  addTodo(event) {
    if(event.key === 'Enter') {
      const value = event.target.value.trim()
      if (value) {
        this.todos = [...this.todos, {
          id: Date.now(),
          title: value,
          completed: false,
        }]
        event.target.value = ''
      }
    }
  }

  get remaining() {
    return filters.active(this.todos).length;
  }

  get allDone() {
    return this.remaining === 0
  }

  get filteredTodos() {
    return filters[this.visibility](this.todos)
  }

  toggleAll(e) {
    this.todos = this.todos.map(v => ({...v, completed: e.target.checked}))
  }

  toggleTodo(item, checked) {
    this.todos = this.todos.map(todo => todo.id === item.id ? { ...todo, completed: checked } : todo)
  }

  editTodo(todo){
    beforeEditCache = todo.title
    this.todos = this.todos.map(v => (v.id === todo.id ? {...v, edit: true} : v))
    setTimeout(() => {
      this.shadowRoot.querySelector('.edit-input').focus()
    }, 20)
  }

  removeTodo(todo){
    this.todos = this.todos.filter(v => v.id !== todo.id)
  }

  changeTitle(id, value) {
    this.todos = this.todos.map(v => (v.id === id ? {...v, title: value} : v))
  }

  doneEdit(todo){
    if(this.todos.some(t => t.edit)) {
      const title = todo.title.trim()
      if(title) {
        this.todos = this.todos.map(v => (v.id === todo.id ? {...v, title, edit: false} : v))
      } else {
        this.todos = this.todos.filter(l => l.id !== todo.id)
      }
    }
  }

  inputKeyUp(event, todo) {
    if(event.key === 'Enter') {
      this.doneEdit(todo)
    }
    if(event.key === 'Escape') {
      this.todos = this.todos.map(v => (v.id === todo.id ? {...v, title: beforeEditCache, edit: false} : v))
    }
  }

  removeCompleted() {
    this.todos = this.todos.filter(t => !t.completed)
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('todos')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    }
  }

  render() {
    return html`
      <main>
        <header class="header">
          <h1>todos</h1>
          <input
            class="new-todo"
            autofocus
            placeholder="What needs to be done?"
            @keydown=${this.addTodo}
          />
        </header>
        ${this.todos.length ? html`
          <section class="main">
            <input
              id="toggle-all"
              class="toggle-all"
              type="checkbox"
              ?checked=${this.allDone}
              @change=${this.toggleAll}
            />
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
              ${this.filteredTodos.map((item) => html`
                <li class=${classMap({'todo': true, 'comlpeted': item.completed, 'editig': item.edit })}>
                  <div class="view">
                    <input
                      class="toggle"
                      type="checkbox"
                      .checked=${item.completed}
                      @change=${(event) => this.toggleTodo(item, event.target.checked)}
                    />
                    <label @dblclick=${() => this.editTodo(item)}>${ item.title }</label>
                    <button class="destroy" @click=${() => this.removeTodo(item)}>x</button>
                  </div>
                  ${item.edit ? html`
                  <input
                    class="edit-input"
                    type="text"
                    .value=${item.title}
                    @input=${(event) => this.changeTitle(item.id, event.target.value)}
                    @blur=${() => this.doneEdit(item)}
                    @keyup=${(event) => this.inputKeyUp(event, item)}
                    autofocus
                  />
                  ` : ''}
                </li>
              `)}
            </ul>
          </section>
        ` : ''}
        ${this.todos.length ? html`
          <footer class="footer">
            <span class="todo-count">
              <strong>${this.remaining}</strong>
              <span>${this.remaining === 1 ? 'item' : 'items' } left</span>
            </span>
            <ul class="filters">
              <li>
                <a href="#/all" class=${classMap({'selected': this.visibility === 'all' })}>All</a>
              </li>
              <li>
                <a href="#/active" class=${classMap({'selected': this.visibility === 'active' })}>Active</a>
              </li>
              <li>
                <a href="#/completed" class=${classMap({'selected': this.visibility === 'completed' })}>Completed</a>
              </li>              
            </ul>
            ${this.todos.length > this.remaining ? html`
            <button class="clear-completed" @click=${this.removeCompleted}>
              Clear completed
            </button>
            ` : ''}
          </footer>
        ` : ''}
      </main>
    `
  }
}

window.customElements.define('todo-element', TodoElement)

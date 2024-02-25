import { Component, effect, signal, computed } from '@angular/core';

const STORAGE_KEY = 'todos-angular'

interface Todo{
  id: number;
  title: string;
  completed: boolean;
  edit: boolean;
}

const filters = {
  all: (todos: Todo[]) => todos,
  active: (todos: Todo[]) => todos.filter((todo) => !todo.completed),
  completed: (todos: Todo[]) => todos.filter((todo) => todo.completed)
}

@Component({
  selector: 'todo-root',
  standalone: true,
  templateUrl: './todo.component.html',
})
export class TodoComponent {
  input = signal('')
  todos = signal<Todo[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  visibility = signal('all')
  beforeEditCache = ''
  filteredTodos = computed(() => filters[this.visibility() as keyof typeof filters](this.todos()))
  remaining = computed(() => filters.active(this.todos()).length)

  constructor(){
    const onhashchange = () => {
      const route = window.location.hash.replace(/#\/?/, '')
      if (['all', 'active', 'completed'].includes(route)) {
        this.visibility.set(route)
      } else {
        window.location.hash = ''
        this.visibility.set('all')
      }
    }
    window.addEventListener('hashchange', onhashchange)
    onhashchange()

    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos()))
    })
  }

  addTodo(){
    const todo = this.input().trim()
    if (todo) {
      this.todos.update(value => [
        ...value,
        {
          id: Date.now(),
          title: todo,
          completed: false,
          edit: false,
        }
      ])
      this.input.set('')
    }
  }

  toggleAll(e: any) {
    this.todos.update(value => value.map(v => ({...v, completed: e.target.checked})))
  }

  editTodo(todo: Todo){
    this.beforeEditCache = todo.title
    this.todos.update(value => value.map(v => (v.id === todo.id ? {...v, edit: true} : v)))
    setTimeout(() => {
      (document.querySelector('.edit-input') as any).focus()
    }, 10)
  }

  removeTodo(todo: Todo){
    this.todos.update(value => value.filter(v => v.id !== todo.id))
  }

  toggleTodo(id: number) {
    this.todos.update(value => value.map(v => (v.id === id ? {...v, completed: !v.completed} : v)))
  }
  
  changeTitle(id: number, value: string) {
    this.todos.update(list => list.map(v => (v.id === id ? {...v, title: value} : v)))
  }
  
  doneEdit(todo: Todo){
    const title = todo.title.trim()
    if(title) {
      this.todos.update(list => list.map(v => (v.id === todo.id ? {...v, title, edit: false} : v)))
    } else {
      this.todos.update(list => list.filter(l => l.id !== todo.id))
    }
  }

  cancelEdit(todo: Todo) {
    this.todos.update(list => list.map(v => (v.id === todo.id ? {...v, title: this.beforeEditCache, edit: false} : v)))
  }

  removeCompleted() {
    this.todos.update(value => value.filter(t => !t.completed))
  }
}

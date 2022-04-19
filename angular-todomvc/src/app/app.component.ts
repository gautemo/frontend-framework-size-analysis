import { Component } from '@angular/core';

const STORAGE_KEY = 'todos-angular'

interface Todo{
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  input = ''
  todos: Todo[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  visibility = 'all'
  editedTodo: Todo | undefined
  beforeEditCache = ''

  constructor(){
    window.addEventListener('hashchange', () => {
      const route = window.location.hash.replace(/#\/?/, '')
      if (['all', 'active', 'completed'].includes(route)) {
        this.visibility = route
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
    })
  }

  addTodo(){
    const todo = this.input.trim()
    if (todo) {
      this.todos.push({
        id: Date.now(),
        title: todo,
        completed: false
      })
      this.input = ''
      this.storeTodos()
    }
  }

  remaining(){
    return this.todos.filter(todo => !todo.completed).length
  }

  toggleAll(event: any){
    this.todos.forEach(todo => todo.completed = event.checked)
  }

  filteredTodos(){
    if(this.visibility === 'all'){
      return this.todos
    }else if(this.visibility === 'active'){
      return this.todos.filter(todo => !todo.completed)
    }
    return this.todos.filter(todo => todo.completed)
  }

  trackByFn(index: number, item: Todo) {
    return item.id
  }

  editTodo(todo: Todo){
    this.beforeEditCache = todo.title
    this.editedTodo = todo
  }

  removeTodo(todo: Todo){
    this.todos = this.todos.filter(t => t.id !== todo.id)
    this.storeTodos()
  }

  doneEdit(todo: Todo){
    if (this.editedTodo) {
      this.editedTodo = undefined
      todo.title = todo.title.trim()
      if (!todo.title) this.removeTodo(todo)
    }
    this.storeTodos()
  }

  cancelEdit(todo: Todo) {
    this.editedTodo = undefined
    todo.title = this.beforeEditCache
  }

  removeCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed)
    this.storeTodos()
  }

  storeTodos(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
  }
}

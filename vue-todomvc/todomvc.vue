<script setup>
import { ref, computed, watchEffect } from 'vue'

const STORAGE_KEY = 'todos-vue'

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed)
}

const todos = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const visibility = ref('all')
const editedTodo = ref(null)

const filteredTodos = computed(() => filters[visibility.value](todos.value))
const remaining = computed(() => filters.active(todos.value).length)

function toggleAll(e) {
  todos.value.forEach((todo) => (todo.completed = e.target.checked))
}

function addTodo(e) {
  const value = e.target.value.trim()
  if (value) {
    todos.value.push({
      id: Date.now(),
      title: value,
      completed: false
    })
    e.target.value = ''
  }
}

function removeTodo(index) {
  todos.value.splice(index, 1)
}

function doneEdit(value, index) {
  if(editedTodo.value !== null) {
    if (value) {
      editedTodo.value = null
      todos.value[index].title = value
    } else {
      removeTodo(index)
    }
  }
}

function removeCompleted() {
  todos.value = filters.active(todos.value)
}

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
})

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
</script>

<template>
  <header class="header">
    <h1>todos</h1>
    <input class="new-todo" autofocus placeholder="What needs to be done?" @keyup.enter="addTodo" />
  </header>
  <section class="main" v-show="todos.length">
    <input id="toggle-all" class="toggle-all" type="checkbox" :checked="remaining === 0" @change="toggleAll" />
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <li v-for="(todo, i) in filteredTodos" class="todo" :key="todo.id"
        :class="{ completed: todo.completed, editing: i === editedTodo }">
        <div class="view">
          <input class="toggle" type="checkbox" v-model="todo.completed" />
          <label @dblclick="editedTodo = i">{{ todo.title }}</label>
          <button class="destroy" @click="removeTodo(i)">x</button>
        </div>
        <input v-if="i === editedTodo" class="edit" type="text"
          @vue:mounted="({ el }) => el.focus()"
          :value="todo.title"
          @blur="e => doneEdit(e.target.value.trim(), i)"
          @keyup.enter="e => doneEdit(e.target.value.trim(), i)"
          @keyup.escape="editedTodo = null" />
      </li>
    </ul>
  </section>
  <footer class="footer" v-show="todos.length">
    <span class="todo-count">
      <strong>{{ remaining }}</strong>
      <span>{{ remaining === 1 ? 'item' : 'items' }} left</span>
    </span>
    <ul class="filters">
      <li>
        <a href="#/all" :class="{ selected: visibility === 'all' }">All</a>
      </li>
      <li>
        <a href="#/active" :class="{ selected: visibility === 'active' }">Active</a>
      </li>
      <li>
        <a href="#/completed" :class="{ selected: visibility === 'completed' }">Completed</a>
      </li>
    </ul>
    <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
      Clear completed
    </button>
  </footer>
</template>

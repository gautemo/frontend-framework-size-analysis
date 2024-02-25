import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'todos-react'

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed)
}

const TodoMVC = () => {

  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  const [visibility, setVisibility] = useState('all')
  const filteredTodos = useMemo(() => {
    return filters[visibility](todos)
  }, [todos, visibility])
  const remaining = useMemo(() => {
    return filters.active(todos).length
  }, [todos])

  const [editedTodo, setEditedTodo] = useState(null);

  const addTodo = (event) => {
    if (event.key === 'Enter') {
      const value = event.target.value.trim()
      if (value) {
        setTodos([...todos, {
          id: Date.now(),
          title: value,
          completed: false,
        }])
        event.target.value = ''
      }
    }
  }

  const removeTodo = (todo) => {
    const array = [...todos]
    array.splice(array.indexOf(todo), 1)
    setTodos(array)
  }

  const toggleCompleted = (changeTodo, checked) => {
    setTodos(todos.map(todo => todo.id === changeTodo.id ? { ...todo, completed: checked } : todo))
  }

  const toggleAll = (event) => {
    setTodos(todos.map(todo => ({ ...todo, completed: event.target.checked })))
  }

  const [beforeEditCache, setBeforeEditCache] = useState('')
  const editTodo = (todo) => {
    setBeforeEditCache(todo.title)
    setEditedTodo(todo)
  }

  const editTodoTitle = (changeTodo, title) => {
    setTodos(todos.map(todo => todo.id === changeTodo.id ? { ...todo, title } : todo))
  }

  const cancelEdit = (todo) => {
    setEditedTodo(null)
    setTodos(todos.map(t => t.id === todo.id ? { ...todo, title: beforeEditCache } : t))
  }
  
  const doneEdit = (todo) => {
    if(editedTodo){
      setEditedTodo(null)
      const trimmedTitle = todo.title.trim()
      setTodos(todos.map(t => t.id === todo.id ? { ...todo, title: trimmedTitle } : t))
      if (!trimmedTitle) removeTodo(todo)
    }
  }

  const removeCompleted = () => {
    setTodos(filters.active(todos))
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function onHashChange() {
    const route = window.location.hash.replace(/#\/?/, '')
    if (filters[route]) {
      setVisibility(route)
    } else {
      window.location.hash = ''
      setVisibility('all')
    }
  }
  
  useEffect(() => {
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
  }, [])

  return (
    <div id="app">
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
        <section className="main" style={{ display: todos.length ? '' : 'none' }}>
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={remaining === 0}
            onChange={toggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {
              filteredTodos.map(todo => (
                <li
                  className={`todo ${todo.completed ? 'completed' : ''} ${todo === editedTodo ? 'editing' : ''}`}
                  key={todo.id}
                >
                  <div className="view">
                    <input 
                      className="toggle" 
                      type="checkbox" 
                      checked={todo.completed} 
                      onChange={e => toggleCompleted(todo, e.target.checked)} 
                    />
                    <label onDoubleClick={() => editTodo(todo)}>{todo.title}</label>
                    <button className="destroy" onClick={() => removeTodo(todo)}>x</button>
                  </div>
                  {
                    todo.id === editedTodo?.id && 
                    <input
                      className="edit"
                      type="text"
                      v-model="todo.title"
                      autoFocus
                      value={todo.title}
                      onBlur={() => doneEdit(todo)}
                      onInput={e => editTodoTitle(todo, e.target.value)}
                      onKeyUp={e => {
                        if(e.key === 'Enter'){
                          doneEdit(todo)
                        }
                        if(e.key === 'Escape'){
                          cancelEdit(todo)
                        }
                      }}
                    />
                  }
                </li>
              ))
            }
          </ul>
        </section>
        <footer className="footer" style={{ display: todos.length ? '' : 'none' }}>
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
        <button className="clear-completed" onClick={removeCompleted} style={{ display: todos.length > remaining ? '' : 'none' }}>
          Clear completed
        </button>
        </footer>
      </section >
    </div >
  )
}

export { TodoMVC }
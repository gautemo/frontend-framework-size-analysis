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

  const removeTodo = (index) => {
    const array = [...todos]
    array.splice(index, 1)
    setTodos(array)
  }

  const toggleCompleted = (changeTodo, checked) => {
    setTodos(todos.map(todo => todo.id === changeTodo.id ? { ...todo, completed: checked } : todo))
  }

  const toggleAll = (event) => {
    setTodos(todos.map(todo => ({ ...todo, completed: event.target.checked })))
  }
  
  const doneEdit = (value, index) => {
    if(editedTodo !== null){
      setEditedTodo(null)
      if(value) {
        setTodos(todos.map((t, i) => i === index ? { ...t, title: value } : t))
      } else {
        removeTodo(index)
      }
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
              filteredTodos.map((todo, index) => (
                <li
                  className={`todo ${todo.completed ? 'completed' : ''} ${index === editedTodo ? 'editing' : ''}`}
                  key={todo.id}
                >
                  <div className="view">
                    <input 
                      className="toggle" 
                      type="checkbox" 
                      checked={todo.completed} 
                      onChange={e => toggleCompleted(todo, e.target.checked)} 
                    />
                    <label onDoubleClick={() => setEditedTodo(index)}>{todo.title}</label>
                    <button className="destroy" onClick={() => removeTodo(index)}>x</button>
                  </div>
                  {
                    index === editedTodo && 
                    <input
                      className="edit"
                      type="text"
                      autoFocus
                      defaultValue={todo.title}
                      onBlur={(e) => doneEdit(e.target.value.trim(), index)}
                      onKeyUp={e => {
                        if(e.key === 'Enter'){
                          doneEdit(e.target.value.trim(), index)
                        }
                        if(e.key === 'Escape'){
                          setEditedTodo(null)
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
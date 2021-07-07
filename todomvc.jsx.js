"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TodoMVC = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const STORAGE_KEY = 'todos-react';
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.completed),
  completed: todos => todos.filter(todo => todo.completed)
};

const TodoMVC = () => {
  const [todos, setTodos] = (0, _react.useState)(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  const [visibility, setVisibility] = (0, _react.useState)('all');
  const filteredTodos = (0, _react.useMemo)(() => {
    return filters[visibility](todos);
  }, [todos, visibility]);
  const remaining = (0, _react.useMemo)(() => {
    return filters.active(todos).length;
  }, [todos]);
  const [editedTodo, setEditedTodo] = (0, _react.useState)(null);

  const addTodo = event => {
    if (event.key === 'Enter') {
      const value = event.target.value.trim();

      if (value) {
        setTodos([...todos, {
          id: Date.now(),
          title: value,
          completed: false
        }]);
        event.target.value = '';
      }
    }
  };

  const removeTodo = todo => {
    const array = [...todos];
    array.splice(array.indexOf(todo), 1);
    setTodos(array);
  };

  const toggleCompleted = (changeTodo, checked) => {
    setTodos(todos.map(todo => todo.id === changeTodo.id ? { ...todo,
      completed: checked
    } : todo));
  };

  const toggleAll = event => {
    setTodos(todos.map(todo => ({ ...todo,
      completed: event.target.checked
    })));
  };

  const [beforeEditCache, setBeforeEditCache] = (0, _react.useState)('');

  const editTodo = todo => {
    setBeforeEditCache(todo.title);
    setEditedTodo(todo);
  };

  const editTodoTitle = (changeTodo, title) => {
    setTodos(todos.map(todo => todo.id === changeTodo.id ? { ...todo,
      title
    } : todo));
  };

  const cancelEdit = todo => {
    setEditedTodo(null);
    setTodos(todos.map(t => t.id === todo.id ? { ...todo,
      title: beforeEditCache
    } : t));
  };

  const doneEdit = todo => {
    if (editedTodo) {
      setEditedTodo(null);
      const trimmedTitle = todo.title.trim();
      setTodos(todos.map(t => t.id === todo.id ? { ...todo,
        title: trimmedTitle
      } : t));
      if (!trimmedTitle) removeTodo(todo);
    }
  };

  const removeCompleted = () => {
    setTodos(filters.active(todos));
  };

  (0, _react.useEffect)(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function onHashChange() {
    const route = window.location.hash.replace(/#\/?/, '');

    if (filters[route]) {
      setVisibility(route);
    } else {
      window.location.hash = '';
      setVisibility('all');
    }
  }

  (0, _react.useEffect)(() => {
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "app"
  }, /*#__PURE__*/_react.default.createElement("section", {
    className: "todoapp"
  }, /*#__PURE__*/_react.default.createElement("header", {
    className: "header"
  }, /*#__PURE__*/_react.default.createElement("h1", null, "todos"), /*#__PURE__*/_react.default.createElement("input", {
    className: "new-todo",
    autoFocus: true,
    placeholder: "What needs to be done?",
    onKeyDown: addTodo
  })), /*#__PURE__*/_react.default.createElement("section", {
    className: "main",
    style: {
      display: todos.length ? '' : 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("input", {
    id: "toggle-all",
    className: "toggle-all",
    type: "checkbox",
    checked: remaining === 0,
    onChange: toggleAll
  }), /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: "toggle-all"
  }, "Mark all as complete"), /*#__PURE__*/_react.default.createElement("ul", {
    className: "todo-list"
  }, filteredTodos.map(todo => /*#__PURE__*/_react.default.createElement("li", {
    className: `todo ${todo.completed ? 'completed' : ''} ${todo === editedTodo ? 'editing' : ''}`,
    key: todo.id
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "view"
  }, /*#__PURE__*/_react.default.createElement("input", {
    className: "toggle",
    type: "checkbox",
    checked: todo.completed,
    onChange: e => toggleCompleted(todo, e.target.checked)
  }), /*#__PURE__*/_react.default.createElement("label", {
    onClick: () => editTodo(todo)
  }, todo.title), /*#__PURE__*/_react.default.createElement("button", {
    className: "destroy",
    onClick: () => removeTodo(todo)
  }, "x")), todo.id === (editedTodo === null || editedTodo === void 0 ? void 0 : editedTodo.id) && /*#__PURE__*/_react.default.createElement("input", {
    className: "edit",
    type: "text",
    "v-model": "todo.title",
    autoFocus: true,
    value: todo.title,
    onBlur: () => doneEdit(todo),
    onInput: e => editTodoTitle(todo, e.target.value),
    onKeyUp: e => {
      if (e.key === 'Enter') {
        doneEdit(todo);
      }

      if (e.key === 'Escape') {
        cancelEdit(todo);
      }
    }
  }))))), /*#__PURE__*/_react.default.createElement("footer", {
    className: "footer",
    style: {
      display: todos.length ? '' : 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "todo-count"
  }, /*#__PURE__*/_react.default.createElement("strong", null, remaining), /*#__PURE__*/_react.default.createElement("span", null, remaining === 1 ? 'item' : 'items', " left")), /*#__PURE__*/_react.default.createElement("ul", {
    className: "filters"
  }, /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement("a", {
    href: "#/all",
    className: visibility === 'all' ? 'selected' : ''
  }, "All")), /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement("a", {
    href: "#/active",
    className: visibility === 'active' ? 'selected' : ''
  }, "Active")), /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement("a", {
    href: "#/completed",
    className: visibility === 'completed' ? 'selected' : ''
  }, "Completed"))), /*#__PURE__*/_react.default.createElement("button", {
    className: "clear-completed",
    onClick: removeCompleted,
    style: {
      display: todos.length > remaining ? '' : 'none'
    }
  }, "Clear completed"))));
};

exports.TodoMVC = TodoMVC;
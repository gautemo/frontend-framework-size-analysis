import React from 'react'
import { TodoMVC } from '/todomvc'
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <TodoMVC />
  </React.StrictMode>
);

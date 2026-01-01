import { App } from './App.js';

window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    const app = new App(root);
    app.init();
  }
});
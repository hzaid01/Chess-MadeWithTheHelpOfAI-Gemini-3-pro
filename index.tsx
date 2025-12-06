import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Debug helper: Capture and display errors on screen for mobile/deployment debugging
window.onerror = function (message, source, lineno, colno, error) {
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100%';
  errorDiv.style.backgroundColor = 'red';
  errorDiv.style.color = 'white';
  errorDiv.style.zIndex = '9999';
  errorDiv.style.padding = '20px';
  errorDiv.textContent = `Error: ${message} at ${source}:${lineno}:${colno}`;
  document.body.appendChild(errorDiv);
  console.error(error);
};



try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <App />
  );
} catch (e) {
  console.error("Render error:", e);
  document.body.innerHTML = `<div style="color:red; padding:20px;">Render Error: ${e}</div>`;
}
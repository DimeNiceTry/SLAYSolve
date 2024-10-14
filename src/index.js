import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SysFun from './UI/SysFun/SysFun.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default root
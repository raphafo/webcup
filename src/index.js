import React from 'react';
import ReactDOM from 'react-dom/client';
import CartePersonnalisee from './App';  // Import direct du composant
import './css/tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartePersonnalisee />  {/* Utilisation directe du composant */}
  </React.StrictMode>
);
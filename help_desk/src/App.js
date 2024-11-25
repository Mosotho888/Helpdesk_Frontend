// src/App.js
import React from 'react';
import './App.css';
import TicketList from './components/TicketList';
import './styles/TicketList.css'
import './styles/NewTicket.css';
import './styles/DropdownMenu.css';

function App() {
  return (
    <div className="App">
      <TicketList />
    </div>
  );
}

export default App;
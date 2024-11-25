// src/TicketList.js
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TicketCard from './TicketCard'; 
import NewTicket from "./NewTicket";
import { fetchTickets } from '../apis/TicketAPI';
import { faFilter,  faPlus } from "@fortawesome/free-solid-svg-icons";


const TicketList = () => {
  const token = process.env.REACT_APP_API_TOKEN;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTickets = async () => {
        setLoading(true);
        try {
            console.info("Token Used: " + token);
            const data = await fetchTickets(token);
            setTickets(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    if (token) {
        getTickets();
    }
}, [token]);

  // Open modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Add a new ticket to the list
  const addTicket = (newTicket) => {
    setTickets((prevTickets) => [
      ...prevTickets,
      { id: Date.now(), ...newTicket, status: "OPEN" },
    ]);
  };

  

  if (loading) return <div className="loading-message">Fetching tickets, please wait...</div>;
  if (error) return (
    <div className="error-message">
      <p>Error: {error.message}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="ticket-list-container">
        <header className="ticket-list-header">
            <h1>All Tickets</h1>
            <div className="ticket-list-actions">
                <input
                    type="text"
                    placeholder="Search Tickets ..."
                    className="search-input"
                />
                <button className="filter-button">
                  <FontAwesomeIcon icon={faFilter} />
                </button>
                <button className="new-ticket-button" onClick={handleOpenModal}>
                    <FontAwesomeIcon icon={faPlus} />
                        New Ticket
                </button>
            </div> 
        </header>

        <ul className="ticket-list">
            {tickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
            ))}
        </ul>
        
        {/* <div className="notification-box">
          <h3>Ticket Assigned</h3>
          <p>Ticket has been successfully assigned to a technician.</p>
      </div> */}
      {/* Modal for creating a new ticket */}
      {isModalOpen && (
        <NewTicket 
          onAddTicket={addTicket} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default TicketList;
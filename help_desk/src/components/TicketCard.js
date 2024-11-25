import React, { useState, useEffect }  from 'react';
//import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import DropdownMenu from './DropdownMenu';

const TicketCard = ({ ticket }) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (ticketId) => {
        setOpenDropdown((prev) => (prev === ticketId ? null : ticketId));
    };
  
    const handleDocumentClick = (event) => {
      if (!event.target.closest('.button-container')) {
          setOpenDropdown(false);
      }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
          document.removeEventListener('click', handleDocumentClick);   
       
        };
    }, []);

    return (
        <li key={ticket.id} className="ticket-card">
            <FontAwesomeIcon icon={faClock} className="icons" />
            <div className="ticket-info">
                <p className="ticket-title">
                     <strong>{ticket.description}</strong>
                </p>
                <p className="ticket-meta">
                    {ticket.category.name} • Created on {format(new Date(ticket.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </p>
                <p className="ticket-assigned">
                    <span className="technician-name">
                        Assigned to: {ticket.ownerEmail}
                    </span>
                </p>
            </div>
            <div className="ticket-status-actions">
                <div className={`ticket-status ${ticket.status === "IN_PROGRESS" ? "inprogress" : "new"}`}>
                    {ticket.status}
                </div>
                <div className="button-container">
                    <button className="dropdown-toggle" onClick={() => toggleDropdown(ticket.id)}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    {openDropdown === ticket.id && (
                        <DropdownMenu />
                    )}
                    
                </div>
            </div>
            
        </li>
    )
}

export default TicketCard;
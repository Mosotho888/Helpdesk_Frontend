import React, { useState } from "react";

const NewTicket = ({ onAddTicket, onClose }) => {
  const [ticketDetails, setTicketDetails] = useState({
    employee: "",
    title: "",
    description: "",
    category: "",
    priority: "",
    technician: "",
    status: ""
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTicket(ticketDetails);
    onClose(); // Close modal after submitting
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create a New Ticket</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="employee" className="form-label">Employee</label>
            <input
              type="text"
              id="employee"
              name="employee"
              placeholder = "Enter Employee email"
              value={ticketDetails.employee}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder = "Brief description of the issue"
              value={ticketDetails.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Detailed description of the issue"
              value={ticketDetails.description}
              onChange={handleChange}
              className="form-input-description"
              required
            />
          </div>
          <div className="form-group-category">
            <div className="form-row">
              <label htmlFor="category" className="form-label-category">Category</label>
              <label htmlFor="technician" className="form-label-category">Assigned To</label>
            </div>
            <div className="form-row">
              <select
                id="category"
                name="category"
                value={ticketDetails.category}
                onChange={handleChange}
                className="form-input-category"
                required
              >
                <option value="">Select Category</option>
                <option value="IT">Hardware</option>
                <option value="HR">Software</option>
                <option value="Finance">Account Management</option>
                {/* Add more categories as needed */}
              </select>
              <select
                id="technician"
                name="technician"
                value={ticketDetails.technician}
                onChange={handleChange}
                className="form-input-category"
                required
              >
                <option value="">Select Technician</option>
                <option value="TM">Tebogo Mofokeng</option>
                <option value="M">Mark</option>
                <option value="N">Ronny</option>
                {/* Add more technicians as needed */}
              </select>
            </div>
          </div>

          <div className="form-group-category">
            <div className="form-row">
              <label htmlFor="priority" className="form-label-category">Priority</label>
              <label htmlFor="status" className="form-label-category">Status</label>
            </div>
            <div className="form-row">
              <select
                id="priority"
                name="priority"
                value={ticketDetails.priority}
                onChange={handleChange}
                className="form-input-category"
                required
              >
                <option value="">Select Priority</option>
                <option value="IT">Easy</option>
                <option value="HR">Medium</option>
                <option value="Finance">Hard</option>
              </select>
              <select
                id="status"
                name="status"
                value={ticketDetails.status}
                onChange={handleChange}
                className="form-input-category"
                required
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button">Create Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;

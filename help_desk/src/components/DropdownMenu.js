import React,{ useEffect, useState } from 'react';
import { fetchStatuses } from '../apis/StatusAPI';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function DropdownMenu() {
    const token = process.env.REACT_APP_API_TOKEN;
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getStatuses = async () => {
            setLoading(true);
            try {
                console.info("Token Used: " + token);
                const data = await fetchStatuses(token);
                setStatuses(data);
                console.info("data", data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            getStatuses();
        }
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
        <ol className="dropdown-menu">
            {statuses.map((status, index) => (
                <li key={status.id}>
                    <button className="dropdown-item">
                        {index === 0 && `Set as ${status.status_name}`}
                        {index === 1 && `Set ${status.status_name}`}
                        {index === 2 && `Mark as ${status.status_name}`}
                        {index === 3 && `${status.status_name} Ticket`}
                    </button>
                </li>
            ))}
            <li>
                <hr />
            </li>
            <li>
                <button className="dropdown-item">
                    <FontAwesomeIcon icon={faUserPlus} className="fa-user-plus" />
                        Assign to John Doe
                </button>
            </li>
            <li>
                <button className="dropdown-item">
                    <FontAwesomeIcon icon={faUserPlus} className="fa-user-plus" />
                        Assign to Ronny Badirwang
                </button>
            </li>
            <li>
                <button className="dropdown-item">
                    <FontAwesomeIcon icon={faUserPlus} className="fa-user-plus" />
                    Assign to Mike Johnson
                </button>
            </li>
        </ol>
    </div>
  );
}

export default DropdownMenu;
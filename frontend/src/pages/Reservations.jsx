import { useEffect, useState } from "react";
import axiosInstance from "../axios/instanse";
import './Reservations.css'; 

const Reservations = () => {
    const [reservs, setReservs] = useState([]);
    
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const resp = await axiosInstance.get("books/reserv-information/my");
                setReservs(resp.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReservations();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this reservation?")) {
            try {
                await axiosInstance.post(`/books/reserv/invalidate?action=invalid&reservationId=${id}`);
                setReservs(reservs.filter(reserv => reserv.id !== id));
            } catch (err) {
                console.error("Error cancelling reservation:", err);
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    return (
        <div className="reservations-container">
            <h1 className="reservations-title">My Reservations</h1>
            <div className="reservations-grid">
                {reservs.map((reserv) => (
                    <div key={reserv._id} className="reservations-item" style={{zIndex: "1000"}}>
                        <div className="reservations-tags">
                            <span 
                                className={`reservations-tag ${reserv.status === 'invalid' ? 'invalid-tag' : reserv.status === 'invalid' ? 'ref-tag' : 'status-tag'}`}
                            >
                                {reserv.status}
                            </span>
                            <span className="reservations-tag queue-tag">Queue Position: {reserv.queue_position}</span>
                        </div>
                        <img 
                            src={reserv.book_id.media_urls[0]} 
                            alt={reserv.book_id.title}
                            className="reservations-image"
                        />
                        <div className="reservations-info">
                            <h3 className="h3">{reserv.book_id.title}</h3>
                            <h4>{reserv.book_id.author}</h4> <br/>
                            <div className="description">
                                {console.log(reserv.book_id)}
                                <p className="p">{reserv.book_id.description}</p>
                            </div> <br/>
                            <div>
                                <br/>
                                {reserv.queue_position === 1 ? (
                                    <p className="p">You are the next reader!</p>
                                ) : (
                                    <p className="p">You are at position {reserv.queue_position}, it's time to be patient</p>
                                )}
                                <br/>
                                <span className="span" style={{marginTop: "20px"}}>Reservation time: {formatDate(reserv.book_id.createdAt)}</span>
                            </div>
                            <button className="button" onClick={() => handleCancel(reserv._id)}>Cancel Reservation</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reservations;

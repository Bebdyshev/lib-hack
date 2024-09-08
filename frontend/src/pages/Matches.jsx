import { useEffect, useState } from "react";
import axiosInstance from "../axios/instanse";
import './Matches.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Matches = () => {
    const [matches, setMatches] = useState({
        acceptedMatches: [],
        waitingForOtherToAccept: [],
        waitingForUserToAccept: [],
    });
    const [activeTab, setActiveTab] = useState("acceptedMatches");

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const resp = await axiosInstance.get("/books/matches/my");
                setMatches(resp.data);

                if (resp.data && Array.isArray(resp.data.waitingForUserToAccept) && resp.data.waitingForUserToAccept.length > 0) {
                    setActiveTab("waitingForUserToAccept");
                } else if (resp.data && Array.isArray(resp.data.acceptedMatches) && resp.data.acceptedMatches.length > 0) {
                    setActiveTab("acceptedMatches");
                } else if (resp.data && Array.isArray(resp.data.waitingForOtherToAccept) && resp.data.waitingForOtherToAccept.length > 0) {
                    setActiveTab("waitingForOtherToAccept");
                } else {
                    setActiveTab("acceptedMatches"); 
                }
                
            } catch (err) {
                console.error(err);
            }
        };
        fetchMatches();
    }, []);

    const answerToMatch = async (action, matchId) => {
        try {
            await axiosInstance.post(`/books/matches/${action}?matchId=${matchId}`);
            const resp = await axiosInstance.get("/books/matches/my");
            setMatches(resp.data);
            
            if (resp.data.waitingForUserToAccept.length > 0) {
                setActiveTab("waitingForUserToAccept");
            } else if (resp.data.acceptedMatches.length > 0) {
                setActiveTab("acceptedMatches");
            } else if (resp.data.waitingForOtherToAccept.length > 0) {
                setActiveTab("waitingForOtherToAccept");
            } else {
                setActiveTab("acceptedMatches"); 
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    const renderMatches = () => {
        if (matches[activeTab].length === 0) {
            return <p>No matches available</p>;
        }
    
        return matches[activeTab].map((match, index) => {
            const {
                first_book_id = {},
                first_user_id = {},
                second_user_id = {},
                second_book_id = {},
                id
            } = match;

            if (!first_book_id || !first_user_id || !second_user_id || !second_book_id){
                return;
            }
    
            return (
                <div key={index} className="match-item">
                    <div className="books-container">
                        <div className="book-cover-container">
                            <img className="book-cover-matches" src={first_book_id.media_urls?.[0] || ""} alt="Book cover"/>
                            <div className="contact-info">
                                <h3 className="h3-matches">{first_book_id.title}</h3>
                                <h4 className="h4-matches">{first_book_id.author}</h4> 
                                <br/>
                                <p className="p-matches">{first_user_id.full_name || "Unknown User"}</p>
                                <div className="contact-icons">
                                    <a href={`mailto:${first_user_id.email || ""}`} className="contact-icon">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </a>
                                    <a href={`tel:${first_user_id.phone_number || ""}`} className="contact-icon">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="icon-overlay">
                            <i className="fa-solid fa-arrows-rotate" style={{color: "black", fontSize: "35px", padding: "10px", backgroundColor: "white", borderRadius: "50%"}}></i>
                        </div>
                        <div className="book-cover-container">
                            <img className="book-cover-matches" src={second_book_id.media_urls?.[0] || ""} alt="Book cover"/>
                            <div className="contact-info">
                                <h3 className="h3-matches">{second_book_id.title}</h3>
                                <h4 className="h4-matches">{second_book_id.author}</h4>   
                                <br/>
                                <p className="p-matches">{second_user_id.full_name || "Unknown User"}</p>
                                <div className="contact-icons">
                                    <a href={`mailto:${second_user_id.email || ""}`} className="contact-icon">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </a>
                                    <a href={`tel:${second_user_id.phone_number || ""}`} className="contact-icon">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {activeTab === "waitingForUserToAccept" && (
                        <div className="buttons">
                            <button
                                onClick={() => answerToMatch("accept", match._id)}
                                className="accept-btn"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => answerToMatch("decline", match._id)}
                                className="decline-btn"
                            >
                                Decline
                            </button>
                        </div>
                    )}
                </div>
            );
        });
    };
    
    return (
        <div>
            <div className="tabs">
                <button
                    className={`tab ${activeTab === "acceptedMatches" ? "active" : ""}`}
                    onClick={() => setActiveTab("acceptedMatches")}
                >
                    Accepted Matches
                </button>
                <button
                    className={`tab ${activeTab === "waitingForOtherToAccept" ? "active" : ""}`}
                    onClick={() => setActiveTab("waitingForOtherToAccept")}
                >
                    Waiting for Other to Accept
                </button>
                <button
                    className={`tab ${activeTab === "waitingForUserToAccept" ? "active" : ""}`}
                    onClick={() => setActiveTab("waitingForUserToAccept")}
                >
                    Waiting for You to Accept
                </button>
            </div>

            <div className="matches-list">
                {renderMatches()}
            </div>
        </div>
    );
};

export default Matches;

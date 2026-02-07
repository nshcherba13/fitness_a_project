import React, { useState, useContext } from "react";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";

function SendMessage() {
    const [selectedGroups, setSelectedGroups] = useState({
        admins: false,
        users: false,
        trainers: false,
    });
    const { auth } = useContext(AuthContext);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleCheckboxChange = (group) => {
        setSelectedGroups((prevState) => ({
            ...prevState,
            [group]: !prevState[group],
        }));
    };

    const handleSendMessage = async () => {
        const selected = Object.keys(selectedGroups).filter(
            (group) => selectedGroups[group]
        );

        if (selected.length === 0) {
            alert("Please select at least one group.");
            return;
        }

        if (subject.trim() === "") {
            alert("Please enter a subject.");
            return;
        }

        if (message.trim() === "") {
            alert("Please enter a message.");
            return;
        }

        try {
            const response = await axios.post(
                "/admin/send-email",
                {
                    groups: selected.map((group) =>
                        group.charAt(0).toUpperCase() + group.slice(1)
                    ),
                    subject,
                    message,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );

            alert(response.data.message);

            setMessage("");
            setSubject("");
            setSelectedGroups({
                admins: false,
                users: false,
                trainers: false,
            });
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage =
                error.response?.data?.message || "An error occurred while sending the message.";
            alert(errorMessage);
        }
    }

    return (
        <div className="container mt-2">
            <h1>Send Message</h1>
            <div className="form-group">
            <label className="btn-font">Choose groups:</label>
                <div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="admins"
                            className="form-check-input"
                            checked={selectedGroups.admins}
                            onChange={() => handleCheckboxChange("admins")}
                        />
                        <label htmlFor="admins" className="form-check-label">
                            Admins
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="users"
                            className="form-check-input"
                            checked={selectedGroups.users}
                            onChange={() => handleCheckboxChange("users")}
                        />
                        <label htmlFor="users" className="form-check-label">
                            Users
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="trainers"
                            className="form-check-input"
                            checked={selectedGroups.trainers}
                            onChange={() => handleCheckboxChange("trainers")}
                        />
                        <label htmlFor="trainers" className="form-check-label">
                            Trainers
                        </label>
                    </div>
                </div>
            </div>

            <div className="form-group mt-3">
                <label htmlFor="subject" className="btn-font">Message subject:</label>
                <textarea
                    id="subject"
                    className="form-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    rows="1"
                ></textarea>

                <label htmlFor="message" className="btn-font">Message:</label>
                <textarea
                    id="message"
                    className="form-control"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="4"
                ></textarea>
            </div>

            <button
                className="btn btn-primary btn-font btn-utility mt-3"
                onClick={handleSendMessage}
            >
                Send Message
            </button>
        </div>
    );
}

export default SendMessage;

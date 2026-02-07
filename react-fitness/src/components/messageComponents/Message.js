import "../../css/messageSidebar.css";
import {useLocation, useNavigate} from 'react-router-dom';
import React, {useState, useEffect, useContext,} from 'react';
import {Container, Form, Button, ListGroup, Col, Row} from 'react-bootstrap';
import AuthContext from "../../context/AuthProvider";
import axios from "../../axiosConfig";


function Message() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(useLocation().search);
    const { auth } = useContext(AuthContext);

    const [accountId, setAccountId] = useState('');
    const [trainerId, setTrainerId] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [user, setUser] = useState({});

    useEffect(() => {
        const newAccountId = queryParams.get("accountId");
        const newTrainerId = queryParams.get("trainer_id");

        if (newAccountId) setAccountId(newAccountId);
        if (newTrainerId) setTrainerId(newTrainerId);
    }, [location.search]);


    useEffect(() => {
        if (accountId && trainerId) {
            console.log("Account ID und Trainer ID aktualisiert, Nachrichten werden geladen...");
            fetchData();
        }
    }, [accountId, trainerId]);

    const fetchData = async () => {
        getMessage();
        try {
            axios.defaults.headers = {'Authorization': `Bearer ${auth.token}`}
            const response = await axios.get(`/userIDWithMessageLast`);
            const user_idsArray = Object.values(response.data.account_ids);
            const selected = user_idsArray.find(user_id => user_id.account_id === parseInt(accountId));
            setUser(selected || {});
            getMessage();
        } catch (error) {
            console.log("Get UserName error" + error);
        }
    };
    const sendMessage = async () => {
        if (newMessage.trim()) {
            const newMsg = {
                sender_id: trainerId,
                sender_type: "Trainer",
                receiver_id: selectedAccount,
                receiver_type: "Account",
                content: newMessage,
                timestamp: new Date().toISOString(),
            };
            try {
                axios.defaults.headers = { 'Authorization': `Bearer ${auth.token}` };
                await axios.post(`/messages`, newMsg, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setMessages(prev => [...prev, newMsg]);
                setNewMessage("");
            } catch (error) {
                console.error('Fehler beim Speichern der Nachricht:', error);
            }
        }
    };

    const getMessage = async () => {
        try {
            setSelectedAccount(accountId);
            axios.defaults.headers = {'Authorization': `Bearer ${auth.token}`}
            const response = await axios.get(
                `/between/user/${accountId}/trainer/${trainerId}`
            );
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const handleBack = () => {
        navigate('/trainer');
    };
    return (
        <Container className="chat-container border rounded p-3 mt-3" style={{maxWidth: '98%', margin: '0 auto'}}>
            <Row>
                <Col md={12}>
                    {selectedAccount ? (
                        <>
                            <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                                <div className="d-flex align-items-center col">
                                    <i
                                        className="fas fa-solid fa-circle-arrow-left fa-2x me-3 icon-hover"
                                        style={{cursor: "pointer"}}
                                        onClick={handleBack}
                                    ></i>
                                    <span className="username" style={{
                                        fontSize: '16px',
                                        whiteSpace: 'nowrap'
                                    }}>{user?.user_name || "Unknown User"}</span>
                                </div>
                            </div>
                            <ListGroup className="chat-box">
                                {messages.map((msg, index) => (
                                    <ListGroup.Item key={index}
                                                    className={`my-2 border rounded p-2 ${msg.sender_type === 'Trainer' ? 'text-end bg-lightgray' : 'text-start bg-lightgray'}`}
                                                    style={{
                                                        alignSelf: msg.sender_type === 'Trainer' ? 'flex-end' : 'flex-start',
                                                        maxWidth: '70%'
                                                    }}>
                                        <p className="mb-1">{msg.content}</p>
                                        <small className="text-muted">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </small>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Form className="mt-3 d-flex" onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Write a message..."
                                    value={newMessage}
                                    onChange={(event) => setNewMessage(event.target.value)}/>
                                <Button variant="danger" onClick={sendMessage} className="ms-2"> ➤ </Button>
                            </Form>
                        </>
                    ) : (<p>Please select a trainer from the list</p>)}
                </Col>
            </Row>
        </Container>
    );
}

export default Message;

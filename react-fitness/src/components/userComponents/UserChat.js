import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, ListGroup, Col, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "../../axiosConfig";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../css/UserChat.css";
import AuthContext from "../../context/AuthProvider";

const UserChat = () => {
    const { trainerId } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [account_id, setAccountID] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [NewTrainer, setNewTrainer] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [canWrite, setCanWrite] = useState(false); // Для проверки подписки
    const [loading, setLoading] = useState(true); // Для отображения загрузки

    const loadMessages = async (trainerIdToLoad) => {
        try {
            const response = await axios.get(
                `/between/user/${account_id}/trainer/${trainerIdToLoad}`,
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setMessages(response.data.messages || []);
        } catch (err) {
            console.error('Fehler beim Laden der Nachrichten:', err);
        }
    };

    const setDefaultTrainer = async (trainers) => {
        if (trainers.length > 0) {
            const defaultTrainer = trainers[0];
            setSelectedTrainer(defaultTrainer);
            await loadMessages(defaultTrainer.id);
            navigate(`/user/chat/${defaultTrainer.id}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountResponse = await axios.get(`/account/info`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                const userId = accountResponse.data.account.account_id;
                setAccountID(userId);

                const subscriptionResponse = await axios.get(`/account/can-write-to-trainer`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setCanWrite(subscriptionResponse.data.is_able_to_write);

                const trainerResponse = await axios.get(`/trainerIds`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                const trainers = trainerResponse.data.trainers;
                setNewTrainer(trainers);

                if (trainerId) {
                    const foundTrainer = trainers.find(trainer => trainer.id === parseInt(trainerId));
                    if (foundTrainer) {
                        setSelectedTrainer(foundTrainer);
                        await loadMessages(foundTrainer.id);
                    } else {
                        console.error('Trainer not found.');
                    }
                } else {
                    await setDefaultTrainer(trainers);
                }
            } catch (err) {
                console.error('Fehler beim Laden der Daten:', err);
            } finally {
                setLoading(false); // Окончание загрузки
            }
        };

        fetchData();
    }, [trainerId, auth.token]);

    const sendMessage = async () => {
        if (newMessage.trim()) {
            const newMsg = {
                sender_id: account_id,
                sender_type: 'Account',
                receiver_id: selectedTrainer.id,
                receiver_type: 'Trainer',
                content: newMessage,
                timestamp: new Date().toISOString(),
            };

            try {
                await axios.post(`/messages`, newMsg, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setMessages([...messages, newMsg]);
                setNewMessage('');
            } catch (err) {
                console.error('Fehler beim Senden der Nachricht:', err);
            }
        }
    };

    const handleNavigateToAllPlans = () => {
        navigate("/user/subscription");
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!canWrite) {
        return (

            <>
                <h2 className="text-center m-3">To be able to write to trainers please upgrade to Gold-Subscription </h2>
                <div className="d-flex justify-content-center">
                    <button
                        className="btn-font card-button-training-plans py-2 m-4"
                        style={{width: '50%'}}
                        type="button"
                        onClick={handleNavigateToAllPlans}
                    >
                        View our Subscriptions
                    </button>
                </div>
            </>
        );
    }

    return (
        <Container className="chat-container border rounded p-3 mt-3" style={{maxWidth: '98%', margin: '0 auto'}}>
            <Row>
                <Col md={3} className="border-end trainer-list">
                    <h5>Trainers</h5>
                    <ListGroup>
                        {NewTrainer.map(trainer => (
                            <ListGroup.Item
                                key={trainer.id}
                                action
                                active={selectedTrainer?.id === trainer.id}
                                onClick={async () => {
                                    setSelectedTrainer(trainer);
                                    await loadMessages(trainer.id);
                                }}
                            >
                                {trainer.first_name} {trainer.last_name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={9}>
                    {selectedTrainer ? (
                        <>
                            <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                                <div className="ms-2 username" style={{ fontSize: '16px' }}>
                                    {selectedTrainer?.first_name || "Unknown"} {selectedTrainer?.last_name || "Trainer"}
                                </div>
                            </div>
                            <ListGroup className="chat-box">
                                {messages.map((msg, index) => (
                                    <ListGroup.Item
                                        key={index}
                                        className={`my-2 border rounded p-2 bg-lightgray ${
                                            msg.sender_type === 'Account' ? 'text-end'
                                                : 'text-start'
                                        }`}
                                        style={{
                                            alignSelf: msg.sender_type === 'Account' ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                        }}
                                    >
                                        <p className="mb-1">{msg.content}</p>
                                        <small className="text-muted">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
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
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button variant="danger" onClick={sendMessage} className="ms-2"> ➤ </Button>
                            </Form>
                        </>
                    ) : (<p>Please select a trainer</p>)}
                </Col>
            </Row>
        </Container>
    );
};

export default UserChat;

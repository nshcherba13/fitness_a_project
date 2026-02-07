import React, {useState, useEffect, useContext} from 'react';
import {Container, Button, ListGroup, Image, Col, Row} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../css/UserChat.css";


const NewTrainer = () => {
    const { auth } = useContext(AuthContext);

    const [chattedTrainer, setChattedTrainer] = useState([]);
    const [AllTrainer, setAllTrainer] = useState([]);
    const [account_id, setAccountID] = useState();
    const navigate = useNavigate();

    const handleTrainerClick = async trainerId => {
        try {
            const response = await axios.get(
                `/account/can-write-to-trainer`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                    },
                }
            );

            if (!response.data.is_able_to_write) {
                console.log('User is not allowed to write to trainer. Redirecting...');
                navigate('/user/chat');
                return;
            }

            const isChatted = chattedTrainer.some(trainer => trainer.id === trainerId);

            if (!isChatted) {
                const newMsg = {
                    sender_id: account_id,
                    sender_type: 'Account',
                    receiver_id: trainerId,
                    receiver_type: 'Trainer',
                    content: 'Hello! I need help!',
                    timestamp: new Date().toLocaleTimeString(),
                };
                console.log(newMsg);
                console.log(`${process.env.REACT_APP_API_URL}/messages`);

                axios.defaults.headers = { 'Authorization': `Bearer ${auth.token}` };
                await axios.post(
                    `/messages`,
                    newMsg,
                    {
                        headers: {
                            'Authorization': `Bearer ${auth.token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                console.log('Empty message was sent.');
            }
            navigate(`/user/chat/${trainerId}`);
        } catch (error) {
            console.error('Error checking write permission:', error);
        }
    };


    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const trainerResponse = await axios.get(`/trainers-to-users`, {
                    headers: {'Authorization': `Bearer ${auth.token}`},
                });
                setAllTrainer(trainerResponse.data.trainers);
                console.log(trainerResponse.data.trainers);

                const accountResponse = await axios.get(`/account/info`, {
                    headers: {'Authorization': `Bearer ${auth.token}`},
                });
                setAccountID(accountResponse.data.account.account_id);

                const newTrainerResponse = await axios.get(`/trainerIds`, {
                    headers: {'Authorization': `Bearer ${auth.token}`},
                });
                setChattedTrainer(newTrainerResponse.data.trainers);
            } catch (err) {
                console.error('fetchTrainers error:', err);
            }
        };
        fetchTrainers();
    }, [auth.token]);
    useEffect(() => {
        if (AllTrainer.length > 0) {
            console.log('Trainer-Daten:', AllTrainer);
        }
    }, [AllTrainer]);

    return (

        <Container fluid>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-3 header-font-size-small">Trainers</h1>
                </div>
            </div>
            <Row id="trainers" className="menu-container">
                {AllTrainer.map((trainer, index) => (
                    <Col key={index} md={12} xl={6} className="mb-4">
                        <div
                            className={`trainer-container p-3 border rounded h-100 bg-lightgray d-flex flex-column ${
                                index % 2 === 0 ? "text-end" : ""
                            }`}
                        >
                            <div className={`d-flex align-items-center mb-3 ${
                                index % 2 === 0 ? "flex-row-reverse" : "flex-row"
                            }`}>
                                <div
                                    className="user-photo"
                                    style={{
                                        flex: "0 0 200px",
                                        borderRadius: "15px",
                                        marginBottom: "0",
                                    }}
                                >
                                    <img
                                        src={
                                            trainer.profile_picture &&
                                            trainer.profile_picture !==
                                            "images/trainer/default_trainer.png"
                                                ? `${process.env.REACT_APP_API_URL}/storage/${trainer.profile_picture.replace(
                                                    "public/",
                                                    ""
                                                )}`
                                                : `${process.env.REACT_APP_API_URL}/images/trainer/default_trainer.png`
                                        }
                                        alt={`${trainer.first_name} ${trainer.last_name}`}
                                        className="img-fluid"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                                <div
                                    className="mx-3"
                                    style={{
                                        flex: "1",
                                    }}
                                >
                                    <h4 className="username">
                                        {trainer.first_name} {trainer.last_name}
                                    </h4>
                                    <p className="mb-1 subheader-trainer">
                                        <strong>Expertise</strong>
                                    </p>
                                    <p className="mb-3">{trainer.expertise || "N/A"}</p>
                                    <p className="mb-1 subheader-trainer">
                                        <strong>Bio</strong>
                                    </p>
                                    <p>{trainer.bio || "No bio available."}</p>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleTrainerClick(trainer.id)}
                                className="btn w-100 write-to-btn btn-font mt-auto"
                            >
                                Write to trainer
                            </Button>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default NewTrainer;

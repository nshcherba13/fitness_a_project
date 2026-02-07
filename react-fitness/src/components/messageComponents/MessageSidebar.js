import "../../css/messageSidebar.css";
import MessageSidebarItem from "./MessageSidebarItem";
import {NavLink, useNavigate} from "react-router-dom";
import React, {useState, useEffect, useContext} from 'react';
import {Container, Form, Button, ListGroup, Image, Col, Row} from 'react-bootstrap';
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";

function MessagesSidebar() {
    const {auth} = useContext(AuthContext);
    const { setAuth } = useContext(AuthContext);
    const [id, setID] = useState(0);
    const navigate = useNavigate();
    const [trainer_id, setTrainerID] = useState();
    const [account_id, setAccountID] = useState([]);
    const [notChattedUsersID, setNotChattedUsersID] = useState([]);
    const [LastMessagesFromUsers, setLastMessagesFromUsers] = useState([]);
    const [account_name, setAccountName] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            axios.defaults.headers = {'Authorization': `Bearer ${auth.token}`}
            const response = await axios.get(`/userIDWithMessageLast`);
            setTrainerID(response.data.TrainerID);
            const accountIdsArray = Object.values(response.data.account_ids);
            const lastMsg = Object.values(response.data.lastMessages);
            setAccountID(accountIdsArray);
        } catch (error) {
        }
    };
    const handleSignOut = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                    withCredentials: true,
                }
            );

            setAuth({});
            localStorage.removeItem("access_token");
            localStorage.removeItem("role");
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
            setAuth({});
            localStorage.removeItem("access_token");
            localStorage.removeItem("role");
            navigate("/login");
        }
    };

    const addAccountID = (newAccountID) => {
        setAccountID(prevnewAccountID => [...prevnewAccountID, newAccountID]);
    };
    const addAccountName = (newAccountName) => {
        setAccountName(prevAccountName => [...prevAccountName, newAccountName]);
    };
    const addLastMessageFromUsers = (newLastMessageFromUsers) => {
        setLastMessagesFromUsers(prevLastMessageFromUsers => [...prevLastMessageFromUsers, newLastMessageFromUsers]);
    };
    const sendMessage = (Account_id, newMessages) => {
        console.log("send message funktioniert.");
        if (newMessages.trim()) {
            console.log("send message1 funktioniert.");
            const newMsg = {
                sender_id: Account_id,
                sender_type: "Account",
                receiver_id: trainer_id,
                receiver_type: "Trainer",
                content: newMessages,
                timestamp: new Date().toLocaleTimeString()
            };
            axios.post(`/messages`, newMsg, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    console.log('Nachricht erfolgreich gespeichert:', response.data);
                })
                .catch(error => {
                    console.error('Fehler beim Speichern der Nachricht:', error);
                });

        }
    };
    const getnewUser = () => {

        axios.defaults.headers = {'Authorization': `Bearer ${auth.token}`}
        axios.get(`/account/showUsersToTrainers`)
            .then(response => {
                const attribut3 = [];
                const dropdownMenu = document.getElementsByClassName('menu-container')[0];
                while (dropdownMenu.firstChild) {
                    dropdownMenu.removeChild(dropdownMenu.firstChild);
                }
                const filtered = response.data.accountIds.filter(accountid =>
                    !account_id.some(chattedWith => chattedWith.account_id === accountid.account_id)
                );
                setNotChattedUsersID(filtered);
                const processedNumbers = notChattedUsersID.map(chat => {
                    const newItem = document.createElement('li');
                    const newLink = document.createElement('a');
                    newLink.className = 'dropdown-item';
                    newLink.href = '#';
                    newItem.id = chat.account_id;
                    newLink.textContent = `Neue Option ${chat.account_id + ": " + chat.user_name}`;
                    newItem.appendChild(newLink);
                    newItem.addEventListener('click', function (event) {
                        addAccountID(chat);
                    });
                    dropdownMenu.appendChild(newItem);
                });

            })
            .catch(err => console.error('Fehler beim Laden der Trainer:', err));
    }
    const navigation = (accountId) => {
        if (accountId !== null) {
            setSelectedAccount(accountId);
            navigate(`/trainer/chat/${id}?accountId=${accountId.account_id}&trainer_id=${trainer_id}`);
            setID(id + 1);
        }
    };

    return (
        <Container className="chat-container border rounded p-3 mt-3 ms-4 mb-4 vh-100"
                   style={{maxWidth: '20%', margin: '0 auto', minWidth: '160px'}}>
            <Row>
                <Col md={12} className="trainer-list">
                    <h5>Contacts</h5>
                    <ListGroup>
                        {(() => {
                            const items = [];
                            if (account_id && Array.isArray(account_id)) {
                                for (let i = 0; i < account_id.length; i++) {
                                    const accountId = account_id[i];
                                    items.push(
                                        <ListGroup.Item
                                            key={accountId.account_id}
                                            action
                                            active={selectedAccount?.account_id === accountId}
                                            onClick={() => {

                                                navigation(accountId);

                                                //getMessage(trainerId); // Nachrichten laden
                                                //LastMessagesFromUsers(accountId);
                                            }}
                                        >
                                            {accountId.user_name}
                                        </ListGroup.Item>
                                    );
                                }
                            }
                            return items;
                        })()}
                    </ListGroup>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={12}>
                    <a href="#" className="nav-link link-dark d-flex align-items-center"
                       style={{marginLeft: "4px"}} onClick={handleSignOut}>
                        <i className="fas fa-sign-out-alt me-2"></i> Sign out
                    </a>
                </Col>
            </Row>
        </Container>
    );
}

export default MessagesSidebar;

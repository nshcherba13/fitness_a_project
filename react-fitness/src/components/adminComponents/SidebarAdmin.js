import React, {useContext} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import axios from "../../axiosConfig";

function SidebarAdmin() {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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

    return (
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
            <ul
                className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-sm-start w-100"
                id="menu"
            >
                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/home"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-home me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Home</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/recipes"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-utensils me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Recipes</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/exercises"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-dumbbell me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Exercises</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/training-plans"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-calendar-alt me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Training Plans</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/bonuses"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fa-solid fa-medal me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Bonuses</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/trainers"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-users me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Trainers</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/find-admin"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-user-shield me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Find Admin</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/email-newsletter"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-envelope me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Email Newsletter</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/subscriptions"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-paperclip me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Subscriptions</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/admin/statistics"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fa-solid fa-chart-simple me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Statistics</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <a
                        href="/login"
                        className="nav-link link-dark d-flex align-items-center"
                        onClick={handleSignOut}
                    >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Sign out</span>
                    </a>
                </li>


            </ul>
        </div>
    );
}

export default SidebarAdmin;

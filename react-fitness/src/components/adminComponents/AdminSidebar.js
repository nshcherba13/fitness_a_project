<<<<<<< HEAD
import React from "react";
import { NavLink  } from "react-router-dom";

function AdminSidebar() {
=======
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";

function AdminSidebar() {
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
>>>>>>> nshcherba_react
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-lightgray sidebar">
            <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                    <NavLink
                        to="/admin/home"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-home me-2"></i> Home
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/admin/recipes"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-utensils me-2"></i> Recipes
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
<<<<<<< HEAD
                        to="/admin/trainings"
=======
                        to="/admin/exercises"
>>>>>>> nshcherba_react
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
<<<<<<< HEAD
                        <i className="fas fa-dumbbell me-2"></i> Trainings
=======
                        <i className="fas fa-dumbbell me-2"></i> Exercises
>>>>>>> nshcherba_react
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/admin/training-plans"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-calendar-alt me-2"></i> Training Plans
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/admin/trainers"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-users me-2"></i> Trainers
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/admin/find-admin"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-user-shield me-2"></i> Find Admin
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/admin/email-newsletter"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-envelope me-2"></i> Email Newsletter
                    </NavLink>
                </li>
                <li className="nav-item">
<<<<<<< HEAD
                    <NavLink
                        to="/admin/sign-out"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-sign-out-alt me-2"></i> Sign Out
                    </NavLink>
=======
                    <a
                        href="/login"
                        className="nav-link link-dark d-flex align-items-center"
                        onClick={handleSignOut}
                    >
                        <i className="fas fa-sign-out-alt me-2"></i> Sign out
                    </a>
>>>>>>> nshcherba_react
                </li>
            </ul>
        </div>
    );
}

export default AdminSidebar;

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import { getPlanById } from "../../api_admin";
import {getPlanExercises, addPlanToUser, markExerciseAsCompleted} from "../../api_user";
import axios from "../../axiosConfig";

function TrainingPlanDetailUser() {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [planData, setPlanData] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isAddedToUserPlans, setIsAddedToUserPlans] = useState(false);

    const handleVideoClick = (videoUrl) => {
        const match = videoUrl.match(
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        if (match && match[1]) {
            setSelectedVideo(match[1]);
        } else {
            console.error("Invalid YouTube URL:", videoUrl);
            alert("Invalid video URL. Please check the video link.");
        }
    };

    const closeModal = () => setSelectedVideo(null);


    const getUserTrainingPlans = async (token) => {
        try {
            const response = await axios.get("/training-plan", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user training plans:", error);
            throw error;
        }
    };

    const handleCompleteExercise = async (exerciseId) => {
        try {
            await markExerciseAsCompleted(id, exerciseId, auth.token);
            setExercises(prev =>
                prev.map(ex => ex.exercise_id === exerciseId
                    ? { ...ex, completed: true }
                    : ex
                )
            );
        } catch (error) {
            console.error("Error marking exercise as completed:", error);
            alert("Error completing exercise. Maybe already completed?");
        }
    };

    const handleFinishPlan = async () => {
        try {
            const res = await axios.post(
                `/training-plan/${id}/complete`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );
            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || 'Ошибка завершения');
        }
    };


    useEffect(() => {
        const fetchPlanData = async () => {
            try {
                const plan = await getPlanById(id, auth.token);
                setPlanData(plan);

                const userPlansResponse = await getUserTrainingPlans(auth.token);
                const userPlans = [
                    ...(userPlansResponse.activePlans || []),
                    ...(userPlansResponse.completedPlans || [])
                ];

                const isAdded = userPlans.some((userPlan) => {
                    return Number(userPlan.training_plan_id) === Number(id);
                });

                setIsAddedToUserPlans(isAdded);

                const fetchedExercises = await getPlanExercises(id, auth.token);
                setExercises(fetchedExercises || []);
            } catch (error) {
                console.error("Error loading training plan data:", error);
            }
        };

        fetchPlanData();
    }, [id, auth.token]);

    const handleAddToUserPlans = async () => {
        try {
            const { activePlans, completedPlans } = await getUserTrainingPlans(auth.token);

            const allPlans = [...activePlans, ...completedPlans]; // объединяем всё
            const alreadyAdded = allPlans.some(plan => plan.training_plan_id === id);

            if (alreadyAdded) {
                alert("This plan is already in your list.");
                return;
            }

            await addPlanToUser(id, auth.token);
            setIsAddedToUserPlans(true);
            alert("Plan was successfully added to your list");
        } catch (error) {
            console.error("Error adding plan to user plans:", error);
            alert("Error while adding, try again");
        }
    };

    const handleCancel = () => {
        navigate("/user/trainings");
    };

    return (
        <div className="trainingplan-container container-lg p-4">
            <div className="card p-3 border-0 exercise-card">
                <div className="col d-flex align-items-start">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 mt-2 icon-hover"
                        style={{ cursor: "pointer" }}
                        onClick={handleCancel}
                    ></i>
                    <h2 className="header-font-size-small mb-0 ">{planData?.title || "Training Plan"}</h2>
                </div>
                <p className="text-muted">{planData?.description}</p>

                <div className="row justify-content-center row-gap-3">
                    {exercises.length > 0 ? (
                        exercises.map((exercise) => (
                            <div
                                key={exercise.exercise_id}
                                className="card border-0"
                                style={{ width: "100%" }}
                            >
                                <div className="d-flex align-items-center">
                                    <div className="card-img-wrapper-training-plan-detail-user">
                                        <img
                                            src={
                                                exercise.picture
                                                    ? exercise.picture !== 'images/training/example1.webp'
                                                        ? `${process.env.REACT_APP_API_URL}/storage/${exercise.picture.replace('public/', '')}`
                                                        : `${process.env.REACT_APP_API_URL}/images/training/example1.webp`
                                                    : "images/training/example1.webp"
                                            }
                                            className="me-1 card-img-training-plan-detail-user"
                                            alt={exercise.name || "Exercise Image"}
                                            style={{ width: "300px", height: "300px", cursor: "pointer", }}
                                            onClick={() => handleVideoClick(exercise.video_url)}
                                        />
                                    </div>

                                    <div className="card-body text-start d-inline">
                                        <div className="col d-flex align-items-start">
                                            <h5 className="card-title">{exercise.name}</h5>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="card-text mb-0">{exercise.description}</p>
                                            {isAddedToUserPlans && (
                                                <i
                                                    className={`fa-solid fa-check exercise-check ${exercise.completed ? 'completed' : ''}`}
                                                    onClick={() => handleCompleteExercise(exercise.exercise_id)}
                                                    title="Mark as complete"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No exercises for this plan</p>
                    )}
                </div>

                <div className="d-flex justify-content-center">
                    {!isAddedToUserPlans && (
                        <button
                            className="btn-font card-button-training-plans py-2 mb-4"
                            style={{ width: "40%" }}
                            type="button"
                            onClick={handleAddToUserPlans}
                        >
                            Add to My Plans
                        </button>
                    )}
                </div>

                {isAddedToUserPlans && (
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn-font card-button-training-plans py-2 mb-4"
                            style={{ width: "40%" }}
                            type="button"
                            onClick={handleFinishPlan}
                        >
                            Finish Plan
                        </button>
                    </div>
                )}
            </div>

            {selectedVideo && (
                <div className="video-modal">
                    <div className="video-overlay" onClick={closeModal}></div>
                    <div className="video-content">
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${selectedVideo}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <button className="btn-close-modal" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TrainingPlanDetailUser;

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";

function TrainingPlansAdmin() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPlans = async (query = "") => {

    if (!auth?.token) {
        setError("You are not authenticated.");
        setLoading(false);
        return;
    }
    try {
        setLoading(true);
        const url = query
            ? `${process.env.REACT_APP_API_URL}/api/training-plans/search?query=${query}`
            : `${process.env.REACT_APP_API_URL}/api/training-plans`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        });
        setPlans(response.data.training_plans);
    } catch (err) {
        if (err.response?.status === 401) {
            setError("Unauthorized. Please log in again.");
        } else {
            setError("Failed to fetch plans. Please try again later.");
        }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
          fetchPlans();
      }, [auth]);

      if (loading) {
          return <p>Loading plans...</p>;
      }

      if (error) {
          return <p>{error}</p>;
      }

  const handleButtonClick = (trainingPlanId) => {
    navigate(`/admin/training-plans/${trainingPlanId}`);
  };

  const handleCreateTrainingPlan = () => {
    navigate("/admin/training-plans/new");
  };

  const handleSearch = () => {
    fetchPlans(searchQuery);
};

  return (
    <>
    <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-0 header-font-size-small">All Training Plans</h1>
                    <i className="fas fa-solid fa-folder-plus fa-2x mx-3 mt-2 icon-hover" style={{cursor: "pointer"}} onClick={handleCreateTrainingPlan}></i>
                </div>
                <div className="d-flex mb-4">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Find Training Plans"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-primary btn-font btn-utility bg-danger" onClick={handleSearch}>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>
      <div className="d-flex justify-content-between align-items-center p-1 mb-4">
        <div className="row justify-content-start row-gap-4">
          {plans.map((trainingPlan) => (
            <div key={trainingPlan.training_plan_id} className='col-xl-6 col-md-12'>
              <div className="card p-3">
                <div className="card-ratio-container-training-plans">
                <img src={trainingPlan.picture ? trainingPlan.picture !== 'images/training/example1.webp'
                                                ? `${process.env.REACT_APP_API_URL}/storage/${trainingPlan.picture.replace('public/', '')}`
                                                : `${process.env.REACT_APP_API_URL}/images/training/example1.webp`
                                               : "images/training/example1.webp"} className="card-img-top" alt={trainingPlan.title}/>
                </div>
                <div className="card-body text-center ">
                  <h5 className="card-title py-2">{trainingPlan.title}</h5>
                  <p className="card-text py-1">{trainingPlan.description}</p>
                  <button onClick={() => handleButtonClick(trainingPlan.training_plan_id)}
                     className="btn-font card-button-training-plans py-2 ">Edit Plan</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TrainingPlansAdmin;

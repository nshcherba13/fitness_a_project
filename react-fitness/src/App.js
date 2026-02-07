import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/utilityComponents/Header";
import Footer from "./components/utilityComponents/Footer";

import Sidebar from "./components/userComponents/Sidebar";
import UserProfile from "./components/userComponents/UserProfile";
import UserProfileEdit from "./components/userComponents/UserProfileEdit";
import UserSubscription from "./components/userComponents/UserSubscription";
import UserCheckout from "./components/userComponents/UserCheckout";

import TrainingPlansUser from "./components/userComponents/TrainingPlansUser";
import TrainingPlanDetailUser from  "./components/userComponents/TrainingPlanDetailUser";
import RecipeListUser from "./components/userComponents/RecipeListUser";
import RecipeDetailUser from "./components/userComponents/RecipeDetailUser";
import FavouriteRecipeListUser from "./components/userComponents/FavouriteRecipeListUser";

import UserChat from "./components/userComponents/UserChat";
import TrainerProfile from "./components/trainerComponents/TrainerProfile";
import MessageSidebar from "./components/messageComponents/MessageSidebar";

import AdminProfile from "./components/adminComponents/AdminProfile";
import AdminEmailNewsletter from "./components/adminComponents/AdminEmailNewsletter";
import AdminFindAdmin from "./components/adminComponents/AdminFindAdmin";
import RecipeListAdmin from "./components/adminComponents/RecipeListAdmin";
import RecipeDetailAdmin from "./components/adminComponents/RecipeDetailAdmin";
import NewRecipeAdmin from "./components/adminComponents/NewRecipeAdmin";
import AdminSubscriptions from "./components/adminComponents/AdminSubscriptions";
import SubscriptionDetailAdmin from "./components/adminComponents/SubscriptionDetailAdmin";
import TrainingPlansAdmin from "./components/adminComponents/TrainingPlansAdmin";
import NewTrainingPlanAdmin from "./components/adminComponents/NewTrainingPlanAdmin";
import TrainingPlanDetailAdmin from "./components/adminComponents/TrainingPlanDetailAdmin";
import AdminTrainersList from "./components/adminComponents/AdminTrainersList";
import AdminTrainersEdit from "./components/adminComponents/AdminTrainersEdit";
import AdminTrainersAdd from "./components/adminComponents/AdminTrainersAdd";
import AdminExercisesList from "./components/adminComponents/AdminExercisesList";
import AdminExercisesEdit from "./components/adminComponents/AdminExercisesEdit";
import AdminExercisesAdd from "./components/adminComponents/AdminExercisesAdd";

import Login from "./pages/Login";
import Register from "./pages/Register";

//import NotFoundPage from "./components/utilityComponents/NotFoundPage";
import RequireAuth from './context/RequireAuth';
import SidebarAdmin from "./components/adminComponents/SidebarAdmin";

import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import NotFoundPage from "./pages/NotFoundPage";
import MainPage from "./components/MainPage";

import AllTrainingPlansUser from "./components/userComponents/AllTrainingPlansUser";
import Message from "./components/messageComponents/Message";
import NewTrainer from "./components/userComponents/NewTrainer";
import AdminStatistics from "./components/adminComponents/AdminStatistics";
import BonusesListAdmin from "./components/adminComponents/BonusesListAdmin";
import NewBonusAdmin from "./components/adminComponents/NewBonusAdmin";
import BonusDetailAdmin from "./components/adminComponents/BonusDetailAdmin";
import BonusListUser from "./components/userComponents/BonusListUser";
import { ToastContainer, toast } from 'react-toastify';


function AdminLayout() {
    return (
        <>
            <Header/>
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-3 px-sm-2 px-0 bg-lightgray">
                        <SidebarAdmin/>
                    </div>
                    <div className="col pt-3">
                        <Routes>
                            <Route index element={<Navigate to="home" replace/>}/>
                            <Route path="home" element={<AdminProfile/>}/>
                            <Route path="email-newsletter" element={<AdminEmailNewsletter/>}/>
                            <Route path="find-admin" element={<AdminFindAdmin/>}/>
                            <Route path="trainers" element={<AdminTrainersList/>}/>
                            <Route path="trainers/edit/:trainerId" element={<AdminTrainersEdit/>}/>
                            <Route path="trainers/create_trainer" element={<AdminTrainersAdd/>}/>
                            <Route path="exercises" element={<AdminExercisesList/>}/>
                            <Route path="exercises/edit/:exerciseId" element={<AdminExercisesEdit/>}/> //MAYBE exerciseId !!!
                            <Route path="exercises/create_exercise" element={<AdminExercisesAdd/>}/>
                            <Route path="subscriptions" element={<AdminSubscriptions/>}/>
                            <Route path="subscriptions/:id" element={<SubscriptionDetailAdmin/>}/>
                            <Route path="statistics" element={<AdminStatistics/>}/>
                            <Route path="bonuses" element={<BonusesListAdmin/>}/>
                            <Route path="bonuses/new" element={<NewBonusAdmin/>}/>
                            <Route path="bonuses/:id" element={<BonusDetailAdmin/>}/>
                            <Route path="recipes" element={<RecipeListAdmin/>}/>
                            <Route path="recipes/:id" element={<RecipeDetailAdmin/>}/>
                            <Route path="recipes/new" element={<NewRecipeAdmin/>}/>
                            <Route path="training-plans" element={<TrainingPlansAdmin/>}/>
                            <Route path="training-plans/:id" element={<TrainingPlanDetailAdmin />} />
                            <Route path="training-plans/new" element={<NewTrainingPlanAdmin/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}


function TrainerLayout() {
    return (
        <>
            <Header/>
            <div className="d-flex flex-grow-1">
                <MessageSidebar/>
                <div className="flex-grow-1 p-4">
                    <Routes>
                        <Route index element={<TrainerProfile/>}/>
                        <Route index element={<TrainerProfile />} />
                        {/*<Route path="chat" element={<Message />} />*/}
                        <Route path="chat/:id" element={<Message key={window.location.pathname} />} />
                        {/*TODO here must be added new routes dor TRAINERS*/}
                    </Routes>
                </div>
            </div>
            <Footer />
        </>
    );
}


function UserLayout() {
    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-3 px-sm-2 px-0 bg-lightgray">
                        <Sidebar/>
                    </div>
                    <div className="col pt-3">
                        <Routes>
                            <Route index element={<Navigate to="home" replace />} />
                            <Route path="home" element={<UserProfile />} />
                            <Route path="home/edit_profile" element={<UserProfileEdit />} />
                            <Route path="trainings" element={<TrainingPlansUser/>}/>
                            <Route path="trainings/:id" element={<TrainingPlanDetailUser/>}/>
                            <Route path="/all-training-plans" element={<AllTrainingPlansUser />} />
                            <Route path="recipes/favorites" element={<FavouriteRecipeListUser/>}/>
                            <Route path="recipes" element={<RecipeListUser/>}/>
                            <Route path="recipes/:id" element={<RecipeDetailUser/>}/>
                            <Route path="bonuses" element={<BonusListUser/>}/>
                            <Route path="subscription" element={<UserSubscription />} />
                            <Route path="subscription/checkout" element={<UserCheckout />} />
                            <Route path="chat" element={<UserChat />} />
                            <Route path="chat/:trainerId" element={<UserChat />} />
                            <Route path="trainers" element={<NewTrainer/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}


function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/main" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/confirmed" element={<EmailConfirmationPage />} />

                <Route element={<RequireAuth allowedRoles={['admin']} />}>
                    <Route path="/admin/*" element={<AdminLayout />} />
                </Route>

                <Route element={<RequireAuth allowedRoles={['trainer']} />}>
                    <Route path="/trainer/*" element={<TrainerLayout />} />
                </Route>

                <Route element={<RequireAuth allowedRoles={['user']} />}>
                    <Route path="/user/*" element={<UserLayout />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />

                <Route path="/main" element={<MainPage />} />
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;

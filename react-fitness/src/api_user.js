import axiosInstance from './axiosConfig';

export const getUserAccountInfo = async (token) => {
    const response = await axiosInstance.get(`/account/info`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getPlanExercises = async (trainingPlanId, token) => {
    const response = await axiosInstance.get(`/training-plans/${trainingPlanId}/exercises`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.exercises;
};


export const getSubscriptionByName = async (name, token) => {
    const response = await axiosInstance.get(`/subscriptions/name/${name}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.subscription;
};

export const getSubscriptions = async (token) => {
    const response = await axiosInstance.get(`/subscriptions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


export const updateUserSubscription = async (subscriptionId, token) => {
    const response = await axiosInstance.put(
        '/account/update-subscription',
        { subscription_id: subscriptionId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const getRecommendedPlans = async (token) => {
    try {
        const response = await axiosInstance.get('/training-plans/recommended', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const getUserTrainingPlans = async (token) => {
    try {
        const response = await axiosInstance.get('/training-plan', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return {
            activePlans: response.data.activePlans || [],
            completedPlans: response.data.completedPlans || [],
        };
    } catch (error) {
        console.error('Failed to fetch user training plans:', error.response || error.message);
        throw error;
    }
};

export const addPlanToUser = async (trainingPlanId, token) => {
    const response = await axiosInstance.post('/training-plan', {
        training_plan_id: trainingPlanId,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const removePlanFromUser = async (trainingPlanId, token) => {
    const response = await axiosInstance.delete(`/training-plan/${trainingPlanId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const markExerciseAsCompleted = async (trainingPlanId, exerciseId, token) => {
    const response = await axiosInstance.post(
        `/training-plans/${trainingPlanId}/exercises/${exerciseId}/finish`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

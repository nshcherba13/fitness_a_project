import axiosInstance from './axiosConfig';


export const getRecipeById = async (id, token) => {
    const response = await axiosInstance.get(`/recipes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.recipe;
};

export const updateRecipe = async (id, data, token) => {
    const response = await axiosInstance.put(`/recipes/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const deleteRecipe = async (id, token) => {
    const response = await axiosInstance.delete(`/recipes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createRecipe = async (data, token) => {
    const response = await axiosInstance.post(`/recipes`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.recipe;
};

export const getSubscriptions = async (token) => {
    const response = await axiosInstance.get(`/subscriptions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateSubscription = async (id, data, token) => {
    const response = await axiosInstance.put(`/subscriptions/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const getSubscriptionById = async (id, token) => {
    try {
        const response = await axiosInstance.get(`/subscriptions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.subscription;
    } catch (error) {
        console.error('Error fetching subscription:', error.response || error.message);
        throw error;
    }
};

export const getPlanById = async (id, token) => {
    const response = await axiosInstance.get(`/training-plans/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.training_plan;
};

export const updatePlan = async (id, data, token) => {
    const response = await axiosInstance.put(`/training-plans/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const deletePlan = async (id, token) => {
    const response = await axiosInstance.delete(`/training-plans/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createPlan = async (data, token) => {
    const response = await axiosInstance.post(`/training-plans`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        },
    });
    return response.data.training_plan;
}

export const uploadRecipePhoto = async (id, file, token) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('photo', file);

    const response = await axiosInstance.post('/recipe/photo', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const updateRecipePhoto = async (id, file, token) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('photo', file);

    const response = await axiosInstance.post('/recipe/photo/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const uploadPlanPhoto = async (id, file, token) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('photo', file);

    const response = await axiosInstance.post('/training-plan/photo', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const updatePlanPhoto = async (id, file, token) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('photo', file);

    const response = await axiosInstance.post('/training-plan/photo/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const getPlanExercises = async (trainingPlanId, token) => {
    try {
        const response = await axiosInstance.get(`/training-plans/${trainingPlanId}/exercises`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.exercises || [];
    } catch (error) {
        console.error("Error fetching exercises for plan:", error.response || error.message);
        throw error;
    }
};

export const getAllExercises = async (token) => {
    try {
        const response = await axiosInstance.get("/exercises", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching all exercises:", error.response || error.message);
        throw error;
    }
};

export const addExerciseToPlan = async (planId, exerciseId, token) => {
    try {
        const { data } = await axiosInstance.put(
            `/training-plans/${planId}/exercises`,
            { exercise_id: exerciseId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return data;
    } catch (error) {
        console.error("Failed to add exercise to plan:", error.response || error.message);
        throw error;
    }
};

export const removeExerciseFromPlan = async (planId, exerciseId, token) => {
    try {
        const response = await axiosInstance.delete(
            `/training-plans/${planId}/exercises/${exerciseId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error removing exercise from plan:", error.response || error.message);
        throw error;
    }
};

export const createBonus = async (bonusData, token) => {
    const response = await axiosInstance.post(
        `/bonuses`,
        bonusData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    return response.data.bonus;
};

export const uploadBonusPhoto = async (bonusId, file, token) => {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("id", bonusId);

    await axiosInstance.post(
        `/bonus/photo`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
}

export const getBonusById = async (id, token) => {
    const response = await axiosInstance.get(`/bonuses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.bonus;
};

export const updateBonus = async (id, updatedData, token) => {
    const response = await axiosInstance.put(`/bonuses/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.bonus;
};

export const deleteBonus = async (id, token) => {
    await axiosInstance.delete(`/bonuses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateBonusPhoto = async (bonusId, file, token) => {
    const formData = new FormData();
    formData.append("id", bonusId);
    formData.append("photo", file);

    await axiosInstance.post(`/bonus/photo/update`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

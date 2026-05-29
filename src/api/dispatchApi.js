import apiClient from "./apiClient";

export const dispatchApi = {
    getAll: (params) => apiClient.get("/dispatches/", { params }),
    getById: (id) => apiClient.get(`/dispatches/${id}`),
    create: (data) => apiClient.post("/dispatches/", data),
    updateStatus: (id, status) =>
        apiClient.patch(`/dispatches/${id}/status`, { status }),
};

export const deliveryApi = {
    getAll: (params) => apiClient.get("/delivery-points/", { params }),
    getById: (id) => apiClient.get(`/delivery-points/${id}`),
    create: (data) => apiClient.post("/delivery-points/", data),
    update: (id, data) => apiClient.put(`/delivery-points/${id}`, data),
    delete: (id) => apiClient.delete(`/delivery-points/${id}`),
};

export const driverApi = {
    getAll: (params) => apiClient.get("/drivers/", { params }),
    getById: (id) => apiClient.get(`/drivers/${id}`),
    create: (data) => apiClient.post("/drivers/", data),
    update: (id, data) => apiClient.put(`/drivers/${id}`, data),
    delete: (id) => apiClient.delete(`/drivers/${id}`),
};

export const authApi = {
    login: (credentials) => apiClient.post("/auth/login", credentials),
    register: (data) => apiClient.post("/auth/register", data),
    forgotPassword: (data) => apiClient.post("/auth/forgot-password", data),
};

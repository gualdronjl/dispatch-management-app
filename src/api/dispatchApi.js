import apiClient from "./apiClient";

export const dispatchApi = {
    getAll: (params) => apiClient.get("/dispatches/", { params }),
    getById: (id) => apiClient.get(`/dispatches/${id}`),
    create: (data) => apiClient.post("/dispatches/", data),
    update: (id, data) => apiClient.put(`/dispatches/${id}`, data),
    delete: (id) => apiClient.delete(`/dispatches/${id}`),
    updateStatus: (id, status) =>
        apiClient.patch(`/dispatches/${id}/status`, { status }),
};

export const deliveryApi = {
    getAll: () => apiClient.get("/delivery-points/"),
    getById: (id) => apiClient.get(`/delivery-points/${id}`),
    create: (data) => apiClient.post("/delivery-points/", data),
    update: (id, data) => apiClient.put(`/delivery-points/${id}`, data),
    delete: (id) => apiClient.delete(`/delivery-points/${id}`),
};

export const authApi = {
    login: (credentials) => apiClient.post("/auth/login", credentials),
    forgotPassword: (data) => apiClient.post("/auth/forgot-password", data),
    me: () => apiClient.get("/auth/me"),
};

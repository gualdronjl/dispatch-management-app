export const getStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
};

export const getStoredRole = () => getStoredUser()?.role?.toUpperCase() || "";

export const isAdmin = () => getStoredRole() === "ADMIN";
export const isOperator = () => getStoredRole() === "OPERADOR";
export const isSupervisor = () => getStoredRole() === "SUPERVISOR";

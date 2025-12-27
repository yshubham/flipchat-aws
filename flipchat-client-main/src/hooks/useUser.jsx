import { STORAGE_NAME } from "../context/AuthContext"


export const useUser = () => {
    const user = JSON.parse(localStorage.getItem(STORAGE_NAME))

    if (user) {
        return {
            user
        };
    }

    return {
        user: false
    };
}
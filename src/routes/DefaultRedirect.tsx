import {useAuth} from "../auth/useAuth.ts";
import {Navigate} from "react-router-dom";

export const DefaultRedirect = () => {
    const {isAuthenticated} = useAuth();

    return <Navigate to={isAuthenticated ? '/traffic-stats-table' : '/login'} replace />
}
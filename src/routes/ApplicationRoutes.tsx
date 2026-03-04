import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "../pages/LoginPage.tsx";
import {ProtectedRoute} from "./ProtectedRoute.tsx";
import TrafficStatsTablePage from "../pages/TrafficStatsTablePage.tsx";

export const ApplicationRoutes = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route element={<ProtectedRoute />}>
                <Route path="/traffic-stats-table" element={<TrafficStatsTablePage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
}
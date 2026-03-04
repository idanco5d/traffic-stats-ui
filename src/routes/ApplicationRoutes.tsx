import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "../pages/LoginPage.tsx";
import {ProtectedRoute} from "./ProtectedRoute.tsx";
import TrafficStatsTablePage from "../pages/TrafficStatsTablePage.tsx";
import TrafficStatisticsChartPage from "../pages/TrafficStatsChartPage.tsx";
import TrafficStatsEditPage from "../pages/TrafficStatsEditPage.tsx";
import TrafficStatsLayout from "./TrafficStatsLayout.tsx";

export const ApplicationRoutes = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route element={<ProtectedRoute/>}>
                <Route element={<TrafficStatsLayout/>}>
                    <Route path="/traffic-stats-table" element={<TrafficStatsTablePage/>}/>
                    <Route path="/traffic-stats-chart" element={<TrafficStatisticsChartPage/>}/>
                    <Route path="/traffic-stats-edit" element={<TrafficStatsEditPage/>}/>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
}
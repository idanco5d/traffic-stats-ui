import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "../pages/LoginPage.tsx";
import {ProtectedRoute} from "./ProtectedRoute.tsx";
import TrafficStatsTablePage from "../pages/TrafficStatsTable/TrafficStatsTablePage.tsx";
import TrafficStatisticsChartPage from "../pages/TrafficStatsChart/TrafficStatsChartPage.tsx";
import TrafficStatsEditPage from "../pages/TrafficStatsEdit/TrafficStatsEditPage.tsx";
import Layout from "../pages/Layout/Layout.tsx";
import {DefaultRedirect} from "./DefaultRedirect.tsx";

export const ApplicationRoutes = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path='*' element={<DefaultRedirect/>}/>
            <Route element={<ProtectedRoute/>}>
                <Route element={<Layout/>}>
                    <Route path="/traffic-stats-table" element={<TrafficStatsTablePage/>}/>
                    <Route path="/traffic-stats-chart" element={<TrafficStatisticsChartPage/>}/>
                    <Route path="/traffic-stats-edit" element={<TrafficStatsEditPage/>}/>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
}
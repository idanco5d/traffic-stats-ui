import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LayoutAppBar from "./LayoutAppBar";
import LayoutDrawer from "./LayoutDrawer";

const Layout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <LayoutAppBar onMenuClick={() => setDrawerOpen(true)} />
            <LayoutDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onNavItemClick={() => setDrawerOpen(false)}
            />
            <Box component="main" sx={{ flex: 1, bgcolor: "#f0f4f8" }}>
                <Outlet />
            </Box>
        </Box>
    );
};
export default Layout;

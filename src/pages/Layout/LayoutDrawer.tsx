import { Box, Divider, Drawer } from "@mui/material";
import LayoutDrawerHeader from "./LayoutDrawerHeader";
import LayoutNavItems from "./LayoutNavItems";
const DRAWER_WIDTH = 260;
interface LayoutDrawerProps {
    open: boolean;
    onClose: () => void;
    onNavItemClick?: () => void;
}
const LayoutDrawer = ({ open, onClose, onNavItemClick }: LayoutDrawerProps) => {
    return (
        <Drawer
            open={open}
            onClose={onClose}
            slotProps={{ paper: { sx: { width: DRAWER_WIDTH, borderRight: "none" } } }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <LayoutDrawerHeader />
                <Divider />
                <LayoutNavItems onItemClick={onNavItemClick} />
            </Box>
        </Drawer>
    );
};
export default LayoutDrawer;

import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {
    EditOutlined,
    ShowChartOutlined,
    TableRowsOutlined,
} from "@mui/icons-material";
const navItems = [
    {
        label: "Statistics Table",
        path: "/traffic-stats-table",
        icon: <TableRowsOutlined />,
    },
    {
        label: "Statistics Chart",
        path: "/traffic-stats-chart",
        icon: <ShowChartOutlined />,
    },
    {
        label: "Edit Entries",
        path: "/traffic-stats-edit",
        icon: <EditOutlined />,
    },
];
interface LayoutNavItemsProps {
    onItemClick?: () => void;
}
const LayoutNavItems = ({ onItemClick }: LayoutNavItemsProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavigate = (path: string) => {
        navigate(path);
        onItemClick?.();
    };
    return (
        <List sx={{ pt: 1, px: 1, flex: 1 }}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <ListItemButton
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            bgcolor: isActive ? "rgba(21, 101, 192, 0.1)" : "transparent",
                            "&:hover": { bgcolor: "rgba(21, 101, 192, 0.07)" },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 38,
                                color: isActive ? "#1565c0" : "text.secondary",
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            slotProps={{
                                primary: {
                                    fontWeight: isActive ? 700 : 400,
                                    fontSize: "0.9rem",
                                    color: isActive ? "#1565c0" : "text.primary",
                                },
                            }}
                        />
                        {isActive && (
                            <Box
                                sx={{
                                    width: 4,
                                    height: 24,
                                    borderRadius: 2,
                                    bgcolor: "#1565c0",
                                    ml: 1,
                                }}
                            />
                        )}
                    </ListItemButton>
                );
            })}
        </List>
    );
};
export default LayoutNavItems;

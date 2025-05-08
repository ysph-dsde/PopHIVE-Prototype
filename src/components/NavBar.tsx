import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { theme } from "../Theme";
import MenuIcon from "@mui/icons-material/Menu";

interface NavBarProps {
  sections: { id: string; title: string; component: JSX.Element }[];

  drawerOpen: boolean;
  handleDrawerToggle: () => void;
}

export const NavigationBar = ({
  sections,
  drawerOpen,
  handleDrawerToggle,
}: NavBarProps) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Detects small screen for mobile
  const appBarHeight = 64;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - appBarHeight, // Account for AppBar height
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {/* Navigation for larger screens */}
          {!isSmallScreen ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
              }}
            >
              {sections.map((section, index) => (
                <Button
                  key={index}
                  sx={{ color: "white" }}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.title}
                </Button>
              ))}
            </Box>
          ) : (
            // Hamburger Menu for smaller screens
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for smaller screens */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <List>
          {sections.map((section, index) => (
            <ListItemButton
              key={index}
              onClick={() => scrollToSection(section.id)}
            >
              <ListItemText primary={section.title} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

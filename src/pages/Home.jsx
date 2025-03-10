//Home.jsx
import { Outlet, useLocation } from "react-router";
import Menu from "../components/Menu";
import MovieCarousel from "../components/MovieCarousel";
import Footer from "../components/Footer";
import { Box } from "@mui/material";

function Home() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Menu />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    mb: { xs: '100px', sm: '80px' }, // Más espacio en móvil
                    p: { xs: 2, sm: 3 }, // Padding general para todo el contenido
                }}
            >
                {isHomePage && <MovieCarousel />}
                <Outlet />
            </Box>
            <Footer />
        </Box>
    );
}

export default Home;
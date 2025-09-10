// DEPENDENCIES
import {useState,useEffect} from "react";
import styles from "../styles/Project.module.css";

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import SlickSlider from "../components/projectPageComponents/SlickSlider";
import VerticalSlider from "../components/projectPageComponents/VerticalSlider";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";


const Project = () => {
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );

    useEffect(() => {
        const onResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", onResize, { passive: true });
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const isMobile = viewportWidth <= 768;

    return (
        <div className={styles.projectMainContainer}>
            <Navbar />

            {isMobile ? <VerticalSlider/> : <SlickSlider/> }

            <Footer />
            <ScrollToTopButton />
        </div>
    )
}

export default Project;
// DEPENDENCIES
import { useState, useEffect, useContext } from "react";
import { Helmet } from 'react-helmet-async';
import { ProjectContext } from '../context/ProjectContext';
import seoConfig from '../config/seoConfig';
import styles from "../styles/Project.module.css";

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import SlickSlider from "../components/projectPageComponents/SlickSlider";
import VerticalSlider from "../components/projectPageComponents/VerticalSlider";
import BackButton from "../components/projectPageComponents/BackButton";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";


const Project = () => {
    const { selectedLanguage, selectedProject } = useContext(ProjectContext);
    const seoData = seoConfig[selectedLanguage].PROJECT;
    
    // Generate dynamic title and description from selected project if available
    const projectTitle = selectedProject?.projectName 
        ? `${selectedProject.projectName} | Cadance` 
        : seoData.title;
    const projectDescription = selectedProject?.description || seoData.description;
    
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
            <Helmet>
                <title>{projectTitle}</title>
                <meta name="description" content={projectDescription} />
                <meta name="keywords" content={seoData.keywords} />
                <meta property="og:title" content={projectTitle} />
                <meta property="og:description" content={projectDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={seoData.canonical} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={projectTitle} />
                <meta name="twitter:description" content={projectDescription} />
                <link rel="canonical" href={seoData.canonical} />
                <html lang={selectedLanguage === "TR" ? "tr" : "en"} />
            </Helmet>
            <Navbar />

            {isMobile ? <VerticalSlider /> : <SlickSlider />}

            <BackButton />
            <Footer />
            <ScrollToTopButton />
        </div>
    )
}

export default Project;
import { useEffect, useContext, useState } from 'react'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Project.module.css";
import ProjectData from "../../projects.json"

import ScrollToTopButton from "../components/ScrollToTopButton";
import { ProjectContext } from "../context/ProjectContext";


const Project = () => {

    const { selectedProject, setSelectedProject } = useContext(ProjectContext)
    const { architecture } = ProjectData;

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentLeft, setCurrentLeft] = useState(0);

    function handleProjectClick(clickedProjectId) {
        const clickedProject = architecture?.find(project => project.id === clickedProjectId);
        setSelectedProject(clickedProject);
        console.log(clickedProject)
    }

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        setStartX(e.clientX);
        setCurrentLeft((prev) => prev + dx * 0.075);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        handleProjectClick(Number(location.pathname.split("/")[2]));
    }, []);


    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className={styles.projectMainContainer}>
            <Navbar />


            <div className={styles.mainSlider}>
                <div
                    className={styles.slideContainer}
                    style={{ left: `${currentLeft}px` }}
                    onMouseDown={handleMouseDown}
                >
                    <div className={styles.slide}>
                        <h1> {selectedProject?.projectName}</h1>
                        <p >CLIENT</p>
                        <p className={styles.slideText}>{selectedProject?.client}</p>
                        <p >LOCATION</p>
                        <p className={styles.slideText}>{selectedProject?.location}</p>
                        <p >YEAR</p>
                        <p className={styles.slideText}>{selectedProject?.year}</p>
                    </div>
                    <div className={styles.slide}>
                        <img
                            src={`../${selectedProject?.projectPictureUrl}`}
                            onDragStart={e => e.preventDefault()}
                        />
                    </div>
                    <div className={styles.slide}>
                        <img
                            src={`../${selectedProject?.projectPictureUrl}`}
                            onDragStart={e => e.preventDefault()}
                        />
                    </div>
                </div>
            </div>

            <Footer />
            <ScrollToTopButton />
        </div>
    )
}

export default Project
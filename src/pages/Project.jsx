import { useEffect, useContext, useRef, useState } from 'react'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Project.module.css";
import ProjectData from "../../projects.json"

import ScrollToTopButton from "../components/ScrollToTopButton";
import { ProjectContext } from "../context/ProjectContext";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Project = () => {

    const { selectedProject, setSelectedProject } = useContext(ProjectContext)
    const { architecture } = ProjectData;

    const sliderRef = useRef(null);
    // Use viewport width instead of measuring the slider to decide orientation
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );

    function handleProjectClick(clickedProjectId) {
        const clickedProject = architecture?.find(project => project.id === clickedProjectId);
        setSelectedProject(clickedProject);
        console.log(clickedProject)
    }

    useEffect(() => {
        handleProjectClick(Number(location.pathname.split("/")[2]));
    }, []);

    // Keep viewport width in sync on resize
    useEffect(() => {
        const onResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", onResize, { passive: true });
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const isMobile = viewportWidth <= 768;

    const settings = {
        className: "slider",
        dots: false,
        infinite: false,
        centerMode: false,
        // IMPORTANT: disable variableWidth when vertical to avoid axis issues
        variableWidth: !isMobile,
        // Show multiple slides when vertical to avoid empty space
        slidesToShow: isMobile ? 3 : 1,
        slidesToScroll: 1,
        arrows: false,
        vertical: isMobile,
        verticalSwiping: isMobile,
        swipeToSlide: true,
        // adaptiveHeight in vertical mode can cause awkward gaps; keep it off
        adaptiveHeight: false,
    };

    return (
        <div className={styles.projectMainContainer}>
            <Navbar />

            <div className={styles.mainSlider} ref={sliderRef}>
                {/* Force re-init when the orientation mode changes */}
                <Slider key={isMobile ? "vertical" : "horizontal"} {...settings}>
                    <div className={styles.slide}>
                        <h1>{selectedProject?.projectName}</h1>
                        <p>CLIENT</p>
                        <p className={styles.slideText}>{selectedProject?.client}</p>
                        <p>LOCATION</p>
                        <p className={styles.slideText}>{selectedProject?.location}</p>
                        <p>YEAR</p>
                        <p className={styles.slideText}>{selectedProject?.year}</p>
                        <p>{selectedProject.teamMembers && "TEAM MEMBERS"}</p>
                        <ul>{selectedProject.teamMembers && selectedProject.teamMembers.map((member, id) => (
                            <p key={id} className={styles.slideText}>{member}</p>
                        ))}</ul>
                    </div>
                    {selectedProject?.projectPictureUrl && selectedProject.projectPictureUrl.map((picture, id) => (
                        <div className={styles.slide} key={id}>
                            <img
                                src={`../${picture}`}
                                onDragStart={e => e.preventDefault()}
                            />
                        </div>
                    ))}

                </Slider>
            </div>

            <Footer />
            <ScrollToTopButton />
        </div>
    )
}

export default Project
import { useEffect, useContext, useRef, useState } from 'react'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Project.module.css";
import supabaseClient from "../config/supabaseClient";

import ScrollToTopButton from "../components/ScrollToTopButton";
import { ProjectContext } from "../context/ProjectContext";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Project = () => {

    const { selectedProject, setSelectedProject } = useContext(ProjectContext)

    const sliderRef = useRef(null);
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );

    const projectId = location.pathname.split("/")[2];
    const [project, setProject] = useState(null);

    useEffect(() => {
        const getProject = async () => {
            const { data, error } = await supabaseClient
                .from('cadanceTestTable')
                .select()
                .eq('id', projectId)
                .single();

            if (error) {
                console.log(error);
                return;
            }
            if (data) {
                setProject(data);
                setSelectedProject(data);
            }
        };

        if (!selectedProject) {
            getProject();
        } else {
            setProject(selectedProject);
        }

    }, [projectId, selectedProject, setSelectedProject]);

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
        variableWidth: !isMobile,
        slidesToShow: isMobile ? 3 : 1,
        slidesToScroll: 1,
        arrows: true,
        vertical: isMobile,
        verticalSwiping: isMobile,
        swipeToSlide: true,
        speed: 300
    };

    if (!project) {
        return <div>Loading...</div>; // Add a loading state
    }

    return (
        <div className={styles.projectMainContainer}>
            <Navbar />

            <div className={styles.mainSlider} ref={sliderRef}>
                <Slider key={isMobile ? "vertical" : "horizontal"} {...settings}>
                    <div className={styles.slide}>
                        <h1>{project?.projectDetails.projectName}</h1>
                        <p>CLIENT</p>
                        <p className={styles.slideText}>{project?.projectDetails.client}</p>
                        <p>LOCATION</p>
                        <p className={styles.slideText}>{project?.projectDetails.location}</p>
                        <p>YEAR</p>
                        <p className={styles.slideText}>{project?.projectDetails.year}</p>
                    </div>
                    {project?.projectDetails?.projectPictureUrl && project.projectDetails.projectPictureUrl.map((picture, id) => (
                        <div className={styles.slide} key={id}>
                            <img
                                src={picture}
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

export default Project;
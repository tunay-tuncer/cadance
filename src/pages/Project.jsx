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
    const [sliderWidth, setSliderWidth] = useState(0);
    function handleProjectClick(clickedProjectId) {
        const clickedProject = architecture?.find(project => project.id === clickedProjectId);
        setSelectedProject(clickedProject);
        console.log(clickedProject)
    }

    useEffect(() => {
        handleProjectClick(Number(location.pathname.split("/")[2]));
    }, []);

    useEffect(() => {
        if (sliderRef.current) {
            const sliderWidth = sliderRef.current.getBoundingClientRect().width;
            setSliderWidth(sliderWidth);
            console.log(sliderWidth);
            console.log(settings.verticalSwiping)
        }
    }, [sliderWidth])


    const settings = {
        className: "slider variable-width",
        dots: false,
        infinite: false,
        centerMode: false,
        slidesToShow: sliderWidth > 768 ? 1 : 3,
        slidesToScroll: 1,
        variableWidth: true,
        arrows: false,
        vertical: sliderWidth > 768 ? false : true,
        verticalSwiping: sliderWidth > 768 ? false : true,
    };


    return (
        <div className={styles.projectMainContainer}>
            <Navbar />

            <div className={styles.mainSlider} ref={sliderRef}>

                <Slider {...settings}>
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
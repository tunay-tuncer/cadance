// DEPENDENCIES
import { useEffect, useContext, useRef, useState } from 'react'
import styles from "../../styles/Project.module.css";
import supabaseClient from "../../config/supabaseClient";
import { ProjectContext } from "../../context/ProjectContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Loader from "../Loader.jsx"

const SlickSlider = () => {

    const { selectedProject, setSelectedProject, selectedLanguage } = useContext(ProjectContext);
    const [isLoading, setIsLoading] = useState(true);

    const sliderRef = useRef(null);
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );

    const projectId = location.pathname.split("/")[2];
    const [project, setProject] = useState(null);

    const content = {
        EN: {
            clientLabel: "CLIENT",
            locationLabel: "LOCATION",
            yearLabel: "YEAR"
        },
        TR: {
            clientLabel: "MÜŞTERİ",
            locationLabel: "KONUM",
            yearLabel: "YIL"
        }
    };

    // Safety check: Default to EN if language is undefined
    const currentLang = content[selectedLanguage] ? selectedLanguage : "EN";

    const getProject = async () => {
        const { data, error } = await supabaseClient
            .from('cadance_projects')
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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProject();
    }, [projectId]);

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
        verticalSwiping: true,
        swipeToSlide: true,
        speed: 300
    };

    if (!project) {
        return <Loader />;
    }

    return (
        <>
            {!isLoading && <div className={styles.mainSlider} ref={sliderRef}>
                <Slider key={isMobile ? "vertical" : "horizontal"} {...settings}>
                    <div className={styles.slide}>
                        <div className={styles.projectDetailsContainer}>
                            <h1>{project?.projectName}</h1>
                            <p>{content[currentLang].clientLabel}</p>
                            <p className={styles.slideText}>{project?.client}</p>
                            <p>{content[currentLang].locationLabel}</p>
                            <p className={styles.slideText}>{project?.location}</p>
                            <p>{content[currentLang].yearLabel}</p>
                            <p className={styles.slideText}>{project?.year}</p>
                        </div>
                        {project?.description && <div className={styles.projectDescriptionContainer}>{project?.description?.[currentLang]}</div>}
                    </div>

                    {project?.projectPictureUrl && project.projectPictureUrl.map((picture, id) => (
                        <div className={styles.slide} key={id}>
                            <img
                                src={picture}
                                onDragStart={e => e.preventDefault()}
                                alt=""
                            />
                        </div>
                    ))}

                </Slider>
            </div>}

        </>
    )
}

export default SlickSlider
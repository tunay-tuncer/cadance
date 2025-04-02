// DEPENDENCIES
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../context/ProjectContext";
import styles from "../styles/Portfolio.module.css";

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import Filter from "../components/portfolioPageComponents/Filter";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from "../components/Footer"

const Portfolio = () => {
    const { selectedNavItem, selectedProjectType, setSelectedProjectType } = useContext(ProjectContext)
    const [projects, setProjects] = useState([]);

    // READ PROJECT DATA
    useEffect(() => {
        fetch("/projects.json")
            .then((res) => res.json())
            .then((data) => setProjects(data[selectedProjectType]))
            .catch((error) => console.error("Error loading projects:", error));

    }, [selectedProjectType]);

    // HANDLE PAGE SCROLL WHEN CLICKED ON NAVBAR
    useEffect(() => {

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })

    }, [selectedNavItem])

    return (
        <div className={styles.portfolioPage}>

            <Navbar />

            <Filter />

            <ul className={styles.projectsMainContainer}>
                {projects.map((item) => (
                    <li className={styles.projectContainer} key={item.id}>
                        <img
                            className={styles.projectImage}
                            src={item.projectPictureUrl}
                            alt=""
                        />
                        <div className={styles.projectDescriptionContainer}>
                            <h3>{item.projectName}</h3>
                            <p>see details</p>
                        </div>
                    </li>
                ))}
            </ul>

            <ScrollToTopButton />
            <Footer />
        </div>
    );
};

export default Portfolio;

// DEPENDENCIES
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from 'react-router'
import { ProjectContext } from "../context/ProjectContext";
import styles from "../styles/Portfolio.module.css";

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import Filter from "../components/portfolioPageComponents/Filter";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from "../components/Footer"

const Portfolio = () => {
    const { selectedNavItem, selectedProjectType, setSelectedProject, selectedProject } = useContext(ProjectContext)
    const [projects, setProjects] = useState([]);
    const [searchText, setSearchText] = useState("");

    // READ PROJECT DATA
    useEffect(() => {
        fetch("/projects.json")
            .then((res) => res.json())
            .then((data) => setProjects(Array.isArray(data?.[selectedProjectType]) ? data[selectedProjectType] : []))
            .catch((error) => {
                console.error("Error loading projects:", error);
                setProjects([]); // fallback on error
            });
    }, [selectedProjectType]);

    // HANDLE PAGE SCROLL WHEN CLICKED ON NAVBAR
    useEffect(() => {

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })

    }, [selectedNavItem])

    function handleProjectClick(clickedProjectId) {
        const clickedProject = projects.find(project => project.id === clickedProjectId);
        setSelectedProject(clickedProject);
    }

    // Filter by tags (case-insensitive). All entered terms must match at least one tag each.
    const filteredProjects = useMemo(() => {
        const list = Array.isArray(projects) ? projects : [];
        const q = (searchText || "").toLowerCase().trim();
        if (!q) return list;
        const terms = q.split(/\s+/);
        return list.filter(p => {
            const tags = (p.tags || []).map(t => String(t).toLowerCase());
            if (tags.length === 0) return false;
            return terms.every(term => tags.some(tag => tag.includes(term)));
        });
    }, [projects, searchText]);

    return (
        <div className={styles.portfolioPage}>

            <Navbar />

            <Filter
                searchText={searchText}
                setSearchText={setSearchText}
            />

            <ul className={styles.projectsMainContainer}>
                {filteredProjects.length === 0 ? (
                    <li className={styles.noProjects}>
                        <p>No project found.</p>
                    </li>
                ) : (
                    filteredProjects.map((item) => (
                        <Link to={`/project/${item.id}`} className={styles.projectContainer} key={item.id} onClick={() => handleProjectClick(item.id)}>
                            <img
                                className={styles.projectImage}
                                style={{ transform: `translateY(${item.imageYPosition}%)` }}
                                src={item.projectPictureUrl[0]}
                                alt=""
                            />
                            <div className={styles.projectDescriptionContainer}>
                                <h3>{item.projectName}</h3>
                                <p>see details</p>
                            </div>
                        </Link>
                    ))
                )}
            </ul>

            <ScrollToTopButton />
            <Footer />
        </div>
    );
};

export default Portfolio;

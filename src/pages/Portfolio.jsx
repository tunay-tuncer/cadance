// DEPENDENCIES
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from 'react-router'
import { ProjectContext } from "../context/ProjectContext";
import styles from "../styles/Portfolio.module.css";
import supabaseClient from "../config/supabaseClient";

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import Filter from "../components/portfolioPageComponents/Filter";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from "../components/Footer"

const Portfolio = () => {
    const { selectedNavItem, selectedLanguage, isArchitecture, setSelectedProject, selectedProject } = useContext(ProjectContext)
    const [projects, setProjects] = useState([]);
    const [projectsByType, setProjectsByType] = useState([]);
    const [searchText, setSearchText] = useState("");

    //FILTER THE PROJECTS BY TYPE
    useEffect(() => {
        if (!projects) return
        const filteredProjectType = projects.filter((item) => item.isArchitecture == isArchitecture);
        filteredProjectType.sort((a, b) => a.id - b.id);
        setProjectsByType(filteredProjectType);

    }, [isArchitecture, projects])

    //FETCH ALL THE PROJECTS
    useEffect(() => {
        async function fetchProjects() {
            const { data, error } = await supabaseClient
                .from('cadance_projects')
                .select()

            if (error) {
                console.log(error);
                return
            }
            if (data) {
                data.sort((a, b) => a.id - b.id)
                setProjects(data);
            }
        }
        fetchProjects();
    }, [])


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
        const list = Array.isArray(projectsByType) ? projectsByType : [];
        const q = (searchText || "").toLowerCase().trim();
        if (!q) return list;
        const terms = q.split(/\s+/);
        return list.filter(p => {
            const tags = (p.tags || []).map(t => String(t).toLowerCase());
            if (tags.length === 0) return false;
            return terms.every(term => tags.some(tag => tag.includes(term)));
        });
    }, [projectsByType, searchText]);

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
                        <p>{selectedLanguage == "EN" ? "No project found..." : "Hiç proje bulunamadı..."}</p>
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
                                <p>{selectedLanguage == "EN" ? "see details" : "detayları görüntüle"}</p>
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

// DEPENDENCIES
import { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router'
import { ProjectContext } from "../context/ProjectContext";
import seoConfig from "../config/seoConfig";
import styles from "../styles/Portfolio.module.css";
import supabaseClient from "../config/supabaseClient";

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import Filter from "../components/portfolioPageComponents/Filter";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from "../components/Footer"
import PortfolioSkeleton from "../components/projectPageComponents/PortfolioSkeleton";

const Portfolio = () => {
    const { selectedNavItem, selectedLanguage, isArchitecture, setSelectedProject, selectedProject } = useContext(ProjectContext)
    const seoData = seoConfig[selectedLanguage].PORTFOLIO;
    const [projects, setProjects] = useState([]);
    const [projectsByType, setProjectsByType] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

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
            setIsLoading(true);
            const { data, error } = await supabaseClient
                .from('cadance_projects')
                .select()

            if (error) {
                console.log(error);
                setIsLoading(false);
                return
            }
            if (data) {
                data.sort((a, b) => a.id - b.id)
                setProjects(data);
            }
            setIsLoading(false);
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
            <Helmet>
                <title>{seoData.title}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                <meta property="og:title" content={seoData.ogTitle} />
                <meta property="og:description" content={seoData.ogDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={seoData.canonical} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoData.ogTitle} />
                <meta name="twitter:description" content={seoData.ogDescription} />
                <link rel="canonical" href={seoData.canonical} />
                <html lang={selectedLanguage === "TR" ? "tr" : "en"} />
            </Helmet>

            <Navbar />

            <Filter
                searchText={searchText}
                setSearchText={setSearchText}
            />

            <ul className={styles.projectsMainContainer}>
                {isLoading ? (
                    <PortfolioSkeleton count={6} />
                ) : filteredProjects.length === 0 ? (
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
                                alt={item.name}
                                loading="lazy"
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

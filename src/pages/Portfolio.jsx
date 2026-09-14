// DEPENDENCIES
import { useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { ProjectContext } from "../context/ProjectContext";
import seoConfig from "../config/seoConfig";
import styles from "../styles/Portfolio.module.css";
import supabaseClient from "../config/supabaseClient";

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import Filter from "../components/portfolioPageComponents/Filter";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from "../components/Footer";
import PortfolioSkeleton from "../components/projectPageComponents/PortfolioSkeleton";

const PAGE_SIZE = 5;

const Portfolio = () => {
    const { selectedNavItem, selectedLanguage, isArchitecture, setSelectedProject } = useContext(ProjectContext);
    const seoData = seoConfig[selectedLanguage].PORTFOLIO;
    const [projects, setProjects] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const isFetchingRef = useRef(false);
    const sentinelRef = useRef(null);

    // Initial fetch when category changes or when search text changes
    useEffect(() => {
        let isCancelled = false;
        let timer = null;

        const executeFetch = async () => {
            setIsLoading(true);
            setHasMore(true);
            isFetchingRef.current = true;

            let query = supabaseClient
                .from('cadance_projects')
                .select('*')
                .eq('isArchitecture', isArchitecture)
                .order('display_order', { ascending: true, nullsFirst: false })
                .order('id', { ascending: true });

            // If not searching, fetch the first page (PAGE_SIZE items)
            if (!searchText.trim()) {
                query = query.range(0, PAGE_SIZE - 1);
            }

            const { data, error } = await query;

            if (isCancelled) return;

            if (error) {
                console.error("Error fetching projects:", error);
                setProjects([]);
                setHasMore(false);
            } else if (data) {
                setProjects(data);
                // If searching, all matching category projects are fetched; if paginating, check if we have more
                if (searchText.trim() || data.length < PAGE_SIZE) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
            setIsLoading(false);
            isFetchingRef.current = false;
        };

        if (searchText.trim()) {
            timer = setTimeout(executeFetch, 300); // Debounce search input
        } else {
            executeFetch();
        }

        return () => {
            isCancelled = true;
            if (timer) clearTimeout(timer);
            isFetchingRef.current = false;
        };
    }, [isArchitecture, searchText]);

    // Fetch next batch of projects when scrolling near the bottom
    const loadMoreProjects = useCallback(async () => {
        if (isFetchingRef.current || !hasMore || isLoading || searchText.trim()) return;

        isFetchingRef.current = true;
        setIsFetchingMore(true);

        const from = projects.length;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabaseClient
            .from('cadance_projects')
            .select('*')
            .eq('isArchitecture', isArchitecture)
            .order('display_order', { ascending: true, nullsFirst: false })
            .order('id', { ascending: true })
            .range(from, to);

        if (error) {
            console.error("Error fetching more projects:", error);
        } else if (data) {
            if (data.length < PAGE_SIZE) {
                setHasMore(false);
            }
            setProjects(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newItems = data.filter(p => !existingIds.has(p.id));
                return [...prev, ...newItems];
            });
        }

        setIsFetchingMore(false);
        isFetchingRef.current = false;
    }, [hasMore, isLoading, searchText, projects.length, isArchitecture]);

    // Keep reference to latest loadMoreProjects for IntersectionObserver
    const loadMoreRef = useRef(loadMoreProjects);
    useEffect(() => {
        loadMoreRef.current = loadMoreProjects;
    }, [loadMoreProjects]);

    // Setup IntersectionObserver for automatic infinite scrolling
    useEffect(() => {
        if (isLoading || isFetchingMore || !hasMore || searchText.trim()) return;

        const currentSentinel = sentinelRef.current;
        if (!currentSentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    loadMoreRef.current?.();
                }
            },
            {
                root: null,
                rootMargin: "300px", // Trigger 300px before reaching the bottom for seamless UX
                threshold: 0
            }
        );

        observer.observe(currentSentinel);

        return () => {
            observer.disconnect();
        };
    }, [isLoading, isFetchingMore, hasMore, searchText]);

    // HANDLE PAGE SCROLL WHEN CLICKED ON NAVBAR
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }, [selectedNavItem]);

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
                <html lang={selectedLanguage === "Türkçe" ? "tr" : "en"} />
            </Helmet>

            <Navbar />

            <Filter
                searchText={searchText}
                setSearchText={setSearchText}
            />

            <ul className={styles.projectsMainContainer}>
                {isLoading ? (
                    <PortfolioSkeleton count={PAGE_SIZE} />
                ) : filteredProjects.length === 0 ? (
                    <li className={styles.noProjects}>
                        <p>{selectedLanguage === "English" || selectedLanguage === "EN" ? "No project found..." : "Hiç proje bulunamadı..."}</p>
                    </li>
                ) : (
                    <>
                        {filteredProjects.map((item) => (
                            <Link to={`/project/${item.id}`} className={styles.projectContainer} key={item.id} onClick={() => handleProjectClick(item.id)}>
                                <img
                                    className={styles.projectImage}
                                    style={{ transform: `translateY(${item.imageYPosition}%)` }}
                                    src={item.projectPictureUrl?.[0]}
                                    alt={item.projectName || "Project"}
                                    loading="lazy"
                                />
                                <div className={styles.projectDescriptionContainer}>
                                    <h3>{item.projectName}</h3>
                                    <p>{selectedLanguage === "English" || selectedLanguage === "EN" ? "see details" : "detayları görüntüle"}</p>
                                </div>
                            </Link>
                        ))}

                        {/* Skeleton placeholder while loading next batch */}
                        {isFetchingMore && (
                            <PortfolioSkeleton count={2} />
                        )}

                        {/* Invisible sentinel element for scroll detection */}
                        {hasMore && !searchText.trim() && (
                            <li
                                ref={sentinelRef}
                                style={{ height: "1px", listStyle: "none", opacity: 0, margin: 0, padding: 0 }}
                                aria-hidden="true"
                            />
                        )}
                    </>
                )}
            </ul>

            <ScrollToTopButton />
            <Footer />
        </div>
    );
};

export default Portfolio;

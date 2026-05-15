// DEPENDENCIES
import { useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProjectContext } from '../context/ProjectContext';
import seoConfig from '../config/seoConfig';

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import Landing from "../components/homePageComponents/Landing"
import About from '../components/homePageComponents/About';
import Process from '../components/homePageComponents/Process';
import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from '../components/Footer';

const Home = () => {
    const { selectedNavItem, setSelectedNavItem, selectedLanguage } = useContext(ProjectContext)
    const seoData = seoConfig[selectedLanguage].HOME;

    // HANDLE PAGE SCROLL WHEN CLICKED ON NAVBAR
    useEffect(() => {
        const element = document.getElementById(selectedNavItem);

        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                left: 0,
                behavior: "smooth",
            });
        }

        if (!element || selectedNavItem === "video") {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
    }, [selectedNavItem]);


    return (
        <div className='home-main-container'>
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
            <Landing />
            <About />
            <Process />
            <ScrollToTopButton />
            <Footer />
        </div>
    )
}

export default Home
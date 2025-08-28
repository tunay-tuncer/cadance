// DEPENDENCIES
import { useEffect, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import Landing from "../components/homePageComponents/Landing"
import About from '../components/homePageComponents/About';
import Process from '../components/homePageComponents/Process';
import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from '../components/Footer';

const Home = () => {
    const { selectedNavItem, setSelectedNavItem } = useContext(ProjectContext)

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
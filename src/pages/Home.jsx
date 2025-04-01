import { useEffect, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';

import Navbar from "../components/Navbar";

import Landing from "../components/homePageComponents/Landing"
import About from '../components/homePageComponents/About';
import Process from '../components/homePageComponents/Process';
import Members from "../components/homePageComponents/Members"
import WorkWithUs from '../components/homePageComponents/WorkWithUs';

import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from '../components/Footer';

const Home = () => {
    const { selectedNavItem, setSelectedNavItem } = useContext(ProjectContext)

    useEffect(() => {
        const element = document.getElementById(selectedNavItem)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        if (!element || element.id === "video") {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }


    }, [selectedNavItem])

    return (
        <div className='home-main-container'>
            <Navbar />
            <Landing />
            <About />
            <Process />
            <Members />
            <WorkWithUs />
            <ScrollToTopButton />
            <Footer />
        </div>
    )
}

export default Home
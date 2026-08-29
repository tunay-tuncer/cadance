// DEPENDENCIES
import { useContext, useState } from 'react'
import { Link } from 'react-router'
import { ProjectContext } from '../context/ProjectContext';
import styles from "../styles/Navbar.module.css"

import { IoChevronDown, IoReader } from "react-icons/io5";

const Navbar = () => {
    const { navbarItems, selectedNavItem, setSelectedNavItem, selectedLanguage, setSelectedLanguage } = useContext(ProjectContext)
    const [isDroppedDown, setIsDroppedDown] = useState(false)

    const handleSelectedNavItem = (id) => {
        setSelectedNavItem("")
        setTimeout(() => setSelectedNavItem(id), 10); // Delay update slightly
    };

    const handleLanguageChange = (e) => {
        e.preventDefault();
        setSelectedLanguage(prev => prev === "Türkçe" ? "English" : "Türkçe");
    }

    useState(() => {
        const handleResize = () => {
            const currentWindowWidth = window.innerWidth;
            if (currentWindowWidth > 768) { setIsDroppedDown(false) }
        }

        window.addEventListener("resize", handleResize)
    }, [window.innerWidth])

    return (
        <nav>
            <div className={styles.leftContainer}>
                <Link to={"/"} onClick={() => handleSelectedNavItem("video")}><img className='logo' src={navbarItems[0].logo} alt="cadance-logo" /></Link>
                <ul className={styles.linkContainer} style={{ transform: `${isDroppedDown ? "translateY(4rem)" : ""}` }}>
                    {navbarItems.map((item) => (!item.logo &&
                        <Link to={item.path} key={item.id}> <li className={styles.navLi} onClick={() => handleSelectedNavItem(item.id)}>{selectedLanguage == "English" ? item.nameEn : item.nameTr}</li></Link>
                    ))}
                </ul>
                <IoChevronDown onClick={() => setIsDroppedDown((prev) => !prev)} style={{ transform: isDroppedDown ? "rotateX(180deg)" : "" }} />
            </div>

            <div className={styles.rightContainer}>

                <div className={styles.languageDiv}>
                    <p onClick={(e) => handleLanguageChange(e)}>{selectedLanguage}</p>
                </div>
            </div>

        </nav >
    )
}

export default Navbar
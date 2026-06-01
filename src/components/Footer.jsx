// DEPENDENCIES
import { useContext, useState } from 'react';
import { Link } from 'react-router';
import styles from "../styles/Footer.module.css";
import GridBackground from './GridBackground';
import { ProjectContext } from '../context/ProjectContext';

const Footer = () => {
    const { navbarItems, selectedNavItem, selectedLanguage, setSelectedNavItem, socialMedia } = useContext(ProjectContext)

    const handleSelectedNavItem = (id) => {
        setSelectedNavItem("")
        setTimeout(() => setSelectedNavItem(id), 10); // Delay update slightly
    };

    return (
        <footer className={styles.footerMainContainer}>
            <div className={styles.footerLogoContainer}>

                {navbarItems.map((item) => (item.logo &&
                    <Link key={item.id} to={"/"} className={styles.logo} onClick={() => handleSelectedNavItem(item.id)}><img className='logo' src={item.logo} alt="cadance-logo" /></Link>
                ))}

                <h1>CADANCE</h1>
            </div>

            <ul className={styles.footerNavItemsContainer}>
                {navbarItems.map((item) => (!item.logo &&
                    <Link to={item.path} key={item.id}> <li className={styles.navLi} onClick={() => handleSelectedNavItem(item.id)}>{selectedLanguage == "EN" ? item.nameEn : item.nameTr}</li></Link>
                ))}
            </ul>

            <div className={styles.socialMediaMainContainer}>

                {socialMedia.map((media, id) => (
                    <a key={id} href={media.url}>{media.icon}</a>
                ))}

                <p className={styles.legalText}>Legal and policies © 2025  CADANCE. All Rights Reserved.</p>
            </div>

            <GridBackground />

        </footer>
    )
}

export default Footer
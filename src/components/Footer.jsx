// DEPENDENCIES
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import styles from "../styles/Footer.module.css"
import { ProjectContext } from '../context/ProjectContext';

// REACT ICONS
import { TiSocialLinkedin } from "react-icons/ti";
import { TiSocialPinterest } from "react-icons/ti";
import { FaInstagram } from "react-icons/fa";
import { FaBehance } from "react-icons/fa";

const Footer = () => {
    const { navbarItems, selectedNavItem, setSelectedNavItem } = useContext(ProjectContext)

    const socialMedia = [
        { icon: <FaInstagram />, url: "https://www.instagram.com" },
        { icon: <TiSocialPinterest />, url: "https://tr.pinterest.com" },
        { icon: <FaBehance />, url: "https://www.behance.com" },
        { icon: <TiSocialLinkedin />, url: "https://www.linkedin.com" }
    ]

    const handleSelectedNavItem = (id) => {
        setSelectedNavItem("")
        setTimeout(() => setSelectedNavItem(id), 10); // Delay update slightly
    };

    return (
        <footer className={styles.footerMainContainer}>
            <div className={styles.footerLogoContainer}>

                {navbarItems.map((item) => (item.logo &&
                    <Link key={item.id} to={"/"} className={styles.logo} onClick={() => handleSelectedNavItem(item.id)}><img className='logo' src={item.logo} alt="" /></Link>
                ))}

                <h1>CADANCE</h1>
            </div>

            <ul className={styles.footerNavItemsContainer}>
                {navbarItems.map((item) => (!item.logo &&
                    <Link to={"/"} key={item.id}> <li className={styles.navLi} onClick={() => handleSelectedNavItem(item.id)}>{item.name}</li></Link>
                ))}
            </ul>

            <Link to={"/portfolio"} className={styles.portfolioContainer}>PORTFOLIO</Link>

            <div className={styles.socialMediaMainContainer}>
                <ul className={styles.socialMediaContainer}>
                    {socialMedia.map((media, id) => (
                        <a key={id} href={media.url}>{media.icon}</a>
                    ))}
                </ul>
                <p className={styles.legalText}>Legal and policies © 2025  CADANCE. All Rights Reserved.</p>
            </div>

        </footer>
    )
}

export default Footer
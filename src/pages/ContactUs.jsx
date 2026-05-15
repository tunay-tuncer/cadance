//DEPENDENCIES
import { useContext, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { ProjectContext } from '../context/ProjectContext';
import seoConfig from '../config/seoConfig';

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import styles from "../styles/ContactUs.module.css";

// MEDIA
import image from "../assets/WindowsLogoFullBlack.22.jpg"

// REACT ICONS
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";

const ContactUs = () => {
    const { selectedLanguage } = useContext(ProjectContext)
    const seoData = seoConfig[selectedLanguage].CONTACT;
    const [isVisible, setIsVisible] = useState(false)

    const contactInfo = [
        { icon: <IoIosMail />, text: "info@cadancedesign.com", onClick: () => handleMailAddress() },
        { icon: <FaPhone />, text: "+90 553 266 58 04", onClick: () => window.location.href = `tel:+905532665804` },
        { icon: <FaPhone />, text: "+90 507 663 31 52", onClick: () => window.location.href = `tel:+905076633152` }
    ]

    function handleMailAddress() {
        navigator.clipboard.writeText("info@cadancestudio.com");
        setIsVisible(true);
        setTimeout(() => {
            setIsVisible(false)
        }, 2000);
    }

    return (
        <div id='contactUs' className={styles.contactUsMainContainer}>
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
            <div className={styles.contactUsContainer}>
                <img src={image} alt="" className={styles.contactUsImage} />
                <div className={styles.contactUsTextDiv}>
                    <h1>{selectedLanguage == "EN" ? "CONTACT US" : "İLETİŞİME GEÇ"}</h1>
                    <ul className={styles.iconsContainer}>
                        {contactInfo.map((info, id) => (
                            <li className={styles.contactText} onClick={info.onClick} key={id} style={{ position: `${id == 0 && "relative"}` }}>
                                {info.icon}
                                <p>{info.text}</p>
                            </li>
                        ))}
                        {isVisible && <p style={{ position: "absolute", right: "2rem" }}>{selectedLanguage == "EN" ? "Copied To Clipboard!" : "Panoya kopyalandı"}</p>}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ContactUs
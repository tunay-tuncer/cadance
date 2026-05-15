//DEPENDENCIES
import { useContext, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { ProjectContext } from "../context/ProjectContext";
import seoConfig from "../config/seoConfig";

// PAGE COMPONENTS
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import styles from "../styles/Members.module.css"

const Members = () => {
    const { selectedLanguage } = useContext(ProjectContext);
    const seoData = seoConfig[selectedLanguage].MEMBERS;

    const membersList = [
        { id: 0, memberName: "TUNAY EKİN TUNÇER", memberImage: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1777643859/TunayTun%C3%A7er_zfh71u.png", memberTitleEn: "COFOUNDING PARTNER / ARCHITECT", memberTitleTr: "KURUCU ORTAK / MİMAR" },
        { id: 1, memberName: "GÖKCAN AYKAÇ", memberImage: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1777644346/G%C3%B6kcanAyka%C3%A7_e7le24.png", memberTitleEn: "COFOUNDING PARTNER / ARCHITECT", memberTitleTr: "KURUCU ORTAK / MİMAR" },
        { id: 2, memberName: "ODIN", memberImage: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1777643859/Odin_u7slac.png", memberTitleEn: "MYSTIC DESIGNER", memberTitleTr: "MİSTİK TASARIMCI" }
    ]

    return (
        <div className={styles.membersMainContainer} >
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
            <ul className={styles.membersUl}>
                {membersList.map((member) => (
                    <li key={member.id} className={styles.member}>
                        <img src={member.memberImage} style={styles.memberPic} alt="cadance-member-img" />
                        <div className={styles.memberTextDiv}>
                            <h2 className={styles.memberName}>{member.memberName}</h2>
                            <p className={styles.memberName}>{selectedLanguage == "EN" ? member.memberTitleEn : member.memberTitleTr}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <Footer />
        </div>
    )
}

export default Members
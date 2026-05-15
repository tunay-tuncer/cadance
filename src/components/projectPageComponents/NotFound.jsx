import { ProjectContext } from "../../context/ProjectContext";
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router'
import Navbar from "../Navbar"
import Footer from "../Footer"
import seoConfig from "../../config/seoConfig"

import styles from "../../styles/NotFound.module.css"

const NotFound = () => {

    const { selectedLanguage } = useContext(ProjectContext);
    const seoData = seoConfig[selectedLanguage].NOTFOUND;

    const content = {
        EN: {
            heading: "Looks like you are lost... ",
            body: "You’ve ventured so far off the map that even the GPS is confused. There is nothing to see here but empty pixels",
            button: "TAKE ME HOME"
        },

        TR: {
            heading: "Kaybolmuş gibisin...",
            body: "Haritanın çok uzağına gitmişsin, GPS'in bile kafası karışmış durumda. Burada görülecek hiçbir şey yok, sadece boş pikseller var",
            button: "BENİ EVE GÖTÜR"
        }
    }

    const currentLang = content[selectedLanguage] ? selectedLanguage : "EN";

    return (
        <div className={styles.notFoundMainDiv}>
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

            <div className={styles.notFoundTextDiv}>
                <h2 className="homepageHeading">{content[currentLang].heading}</h2>
                <p className="homepageHeading">{content[currentLang].body}</p>
                <Link to={"/"} className={styles.notFoundButton}>{content[currentLang].button}</Link>
            </div>

            <Footer />
        </div>
    )
}

export default NotFound
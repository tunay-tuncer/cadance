import { ProjectContext } from "../../context/ProjectContext";
import { useContext } from 'react'
import { Link } from 'react-router'
import Navbar from "../Navbar"
import Footer from "../Footer"

import styles from "../../styles/NotFound.module.css"

const NotFound = () => {

    const { selectedLanguage } = useContext(ProjectContext);

    const content = {
        EN: {
            heading: "Looks like you are lost... ",
            body: "You’ve ventured so far off the map that even the GPS is confused. There is nothing to see here but empty pixels",
            button: "TAKE ME HOME"
        },

        TR: {
            heading: "Kaybolmuş gibisin...",
            body: "Haritanın çok uzağına gitmişsin, GPS bile kafası karışmış durumda. Burada görülecek hiçbir şey yok, sadece boş pikseller var",
            button: "BENİ EVE GÖTÜR"
        }
    }

    const currentLang = content[selectedLanguage] ? selectedLanguage : "EN";

    return (
        <div className={styles.notFoundMainDiv}>
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
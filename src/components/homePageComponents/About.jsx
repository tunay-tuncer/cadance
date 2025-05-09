// DEPENDENCIES
import { Link } from 'react-router'
import styles from "../../styles/About.module.css"
import image from "../../assets/BlueGlassLogoPNG.png"

const About = () => {
    return (
        <div id='about' className={styles.aboutMainContainer}>

            <img className={styles.aboutImage} src={image} alt="" />
            <div className={styles.textDiv}>
                <h2 className="homepageHeading">CADANCE DESIGN STUDIO</h2>
                <p>
                    At <strong>Cadance</strong>, we blend architecture, design, and visualization to create immersive, high-quality representations of spaces. Inspired by the concept of cadence in music, our work follows a rhythm. Each project harmonizing form, function, and aesthetics.
                    With expertise in 3D modeling, rendering, and visualization, we craft compelling architectural narratives that bring ideas to life. Whether it's concept development, urban design, or high-fidelity visualizations, our approach prioritizes innovation, clarity, and impact.
                </p>
                <Link to={"/portfolio"} className={styles.portfolioLinkButton}>EXPLORE OUR PORTOLIO</Link>
            </div>

        </div >
    )
}

export default About
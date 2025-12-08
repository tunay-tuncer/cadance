// DEPENDENCIES
import { ProjectContext } from "../../context/ProjectContext";
import { useContext } from 'react'
import { Link } from 'react-router'
import styles from "../../styles/About.module.css"
import image from "../../assets/BlueGlassLogoPNG.png"

const About = () => {
    const { selectedLanguage } = useContext(ProjectContext);

    const content = {
        EN: {
            heading: "CADANCE DESIGN STUDIO",
            description: (
                <>
                    At <strong>Cadance</strong>, we blend architecture, design, and visualization to create immersive, high-quality representations of spaces. Inspired by the concept of cadence in music, our work follows a rhythm. Each project harmonizing form, function, and aesthetics.
                    <br /><br />
                    With expertise in 3D modeling, rendering, and visualization, we craft compelling architectural narratives that bring ideas to life. Whether it's concept development, urban design, or high-fidelity visualizations, our approach prioritizes innovation, clarity, and impact.
                </>
            ),
            buttonText: "EXPLORE OUR PORTFOLIO"
        },
        TR: {
            heading: "CADANCE TASARIM STÜDYOSU",
            description: (
                <>
                    <strong>Cadance</strong> olarak, mekanların sürükleyici ve yüksek kaliteli temsillerini oluşturmak için mimari, tasarım ve görselleştirmeyi harmanlıyoruz. Müzikteki kadans kavramından ilham alan çalışmalarımız bir ritmi takip eder; her proje biçim, işlev ve estetiği uyum içinde sunar.
                    <br /><br />
                    3D modelleme, render ve görselleştirme konusundaki uzmanlığımızla, fikirleri hayata geçiren etkileyici mimari anlatılar kurguluyoruz. İster konsept geliştirme, ister kentsel tasarım veya yüksek kaliteli görselleştirmeler olsun, yaklaşımımız yenilik, netlik ve etkiyi ön planda tutar.
                </>
            ),
            buttonText: "PORTFOLYOMUZU KEŞFEDİN"
        }
    };

    const currentLang = content[selectedLanguage] ? selectedLanguage : "EN";

    return (
        <div id='about' className={styles.aboutMainContainer}>

            <img className={styles.aboutImage} src={image} alt="" />
            <div className={styles.textDiv}>
                <h2 className="homepageHeading">{content[currentLang].heading}</h2>
                <p>
                    {content[currentLang].description}
                </p>
                <Link to={"/portfolio"} className={styles.portfolioLinkButton}>{content[currentLang].buttonText}</Link>
            </div>

        </div >
    )
}

export default About
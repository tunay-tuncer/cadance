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
            heading: "CADANCE STUDIO",
            description: (
                <>
                    At <strong>Cadance</strong>, by blending architectural design with digital art, we create the most striking and realistic representations of spaces. Drawing inspiration from the concept of cadence in music, our approach treats every project as a rhythm, presenting form, function, and aesthetics in perfect harmony.
                    <br /><br />
                    Through our expertise in 3D modeling, photorealistic rendering, and parametric design processes, we craft innovative architectural narratives at every scale, from the conceptual phase to urban design.
                </>
            ),
            buttonText: "EXPLORE OUR PORTFOLIO"
        },
        TR: {
            heading: "CADANCE STÜDYO",
            description: (
                <>
                    <strong>Cadance</strong> olarak, mimari tasarımı dijital sanatla harmanlayarak mekanların en etkileyici ve gerçekçi temsillerini oluşturuyoruz. Müzikteki kadans kavramından ilham alan çalışma disiplinimiz, her projeyi bir ritimle ele alır; form, işlev ve estetiği kusursuz bir uyum içinde sunar.
                    <br /><br />
                    Uzmanlığımız olan 3D modelleme, fotogerçekçi render ve parametrik tasarım süreçlerimizle, konsept aşamasından kentsel tasarıma kadar her ölçekte yenilikçi mimari anlatılar kurguluyoruz.
                </>
            ),
            buttonText: "PORTFOLYOMUZU KEŞFEDİN"
        }
    };

    const currentLang = content[selectedLanguage] ? selectedLanguage : "EN";

    return (
        <section id='about' className={styles.aboutMainContainer}>

            <img className={styles.aboutImage} src={image} alt="Cadance Studio mimari görselleştirme ve parametrik tasarım" />
            <div className={styles.textDiv}>
                <h1 className="homepageHeading">{content[currentLang].heading}</h1>
                <p>
                    {content[currentLang].description}
                </p>
                <Link to={"/portfolio"} className={styles.portfolioLinkButton}>{content[currentLang].buttonText}</Link>
            </div>

        </section >
    )
}

export default About
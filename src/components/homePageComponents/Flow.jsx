import styles from "../../styles/Flow.module.css"
//REACT ICONS
import { MdOutlineCheckBox, MdArrowRight } from "react-icons/md";

import FlowRightSide from "./FlowRightSide";
import GridBackground from "../GridBackground";
import { ProjectContext } from "../../context/ProjectContext";
import { useContext } from "react";

const Flow = () => {

    const { selectedLanguage } = useContext(ProjectContext);

    const flowSteps = [
        { id: 1, textTr: "Projenizin aşamalarını ve iş akışının nasıl işleyeceğini öğrenin", textEn: "Learn about the stages of your project and how the workflow will proceed" },
        { id: 2, textTr: "Projeye istediğiniz yerden erişin, kimin erişebileceğine karar verin.", textEn: "Access the project from anywhere you want, and decide who can access it." },
        { id: 3, textTr: "Gelişmelerden otomatik mail sistemi ile anında haberdar olun, sürprizleri hayatınızdan çıkarın.", textEn: "Stay updated with the latest changes with our automatic email system and eliminate surprises from your life" },
    ]

    return (
        <section className={styles.flowMainSection}>

            <div className={styles.leftContainer}>

                <div className={styles.headingContainer}>
                    <h3>CADANCE FLOW // A NEW ERA</h3>
                    <h1>{selectedLanguage == "TR" ? "Projenizi" : "Manage Projects"} <span>{selectedLanguage == "TR" ? "Uzaktan Yönetin." : "Remotely"}</span></h1>
                </div>

                <ul className={styles.flowStepsContainer}>
                    {flowSteps.map((step) => (
                        <li key={step.id} className={styles.stepItem}>
                            <MdOutlineCheckBox />
                            <p>{selectedLanguage === "TR" ? step.textTr : step.textEn}</p>
                        </li>
                    ))}
                </ul>

                <a className={styles.linkButton} href="https://flow.cadancestudio.com">
                    <p>{selectedLanguage === "TR" ? "Akışı Keşfedin" : " Explore the Flow"}</p>
                    <MdArrowRight />

                </a>
            </div>
            <FlowRightSide />
            <GridBackground />
        </section>
    )
}

export default Flow
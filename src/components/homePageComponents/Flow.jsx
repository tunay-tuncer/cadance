import styles from "../../styles/Flow.module.css"
//REACT ICONS
import { MdOutlineCheckBox, MdArrowRight } from "react-icons/md";

import FlowRightSide from "./FlowRightSide";

const Flow = () => {

    const flowSteps = [
        { id: 1, text: "Projenizin aşamalarını ve iş akışının nasıl işleyeceğini öğrenin" },
        { id: 2, text: "Projeye istediğiniz yerden erişin, kimin erişebileceğine karar verin." },
        { id: 3, text: "Gelişmelerden otomatik mail sistemi ile anında haberdar olun, sürprizleri hayatınızdan çıkarın." },
    ]

    return (
        <section className={styles.flowMainSection}>

            <div className={styles.leftContainer}>

                <div className={styles.headingContainer}>
                    <h3>CADANCE FLOW // LIVE PROJECT TRACKING</h3>
                    <h1>Projenizi <span>Uzaktan Yönetin.</span></h1>
                </div>

                <ul className={styles.flowStepsContainer}>
                    {flowSteps.map((step) => (
                        <li key={step.id} className={styles.stepItem}>
                            <MdOutlineCheckBox />
                            <p>{step.text}</p>
                        </li>
                    ))}
                </ul>

                <a className={styles.linkButton} href="https://flow.cadancestudio.com">
                    <p>Akışı Keşfedin  </p>
                    <MdArrowRight />

                </a>
            </div>
            <FlowRightSide />
            <div className={styles.gridBackground}></div>
        </section>
    )
}

export default Flow
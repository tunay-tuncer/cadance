import processImgUrl from "../../assets/BlueGlassArrowPNG.png"
import styles from "../../styles/Process.module.css"

const Process = () => {
    return (
        <div className={styles.processMainContainer}>
            <div id='process' className={styles.firstStepContainer}>
                <h2 className="homepageHeading">UNDERSTANDING THE VISION</h2>
                <div className={styles.textContainer}>
                    <p>At Cadance, our design process is a carefully structured journey that transforms ideas into visually compelling architectural experiences. We believe that every project deserves a unique approach, blending creativity with precision to achieve impactful results.</p>
                    <p>Every project begins with a deep understanding of its purpose, context, and client expectations. Whether it’s an architectural structure, an urban intervention, or a product design, we take the time to analyze the goals, aesthetic direction, and functional requirements. This stage involves research, mood boards, and conceptual sketches to align our vision with the project's objectives.</p>
                </div>
                <img src={processImgUrl} alt="" />
            </div>

            <div className={styles.secondStepContainer}>
                <h2 className="homepageHeading">CONCEPT DEVELOPMENT</h2>
                <div className={styles.textContainer}>
                    <p>Once the foundation is set, we explore multiple design directions through 3D sketches, massing studies, and spatial compositions. At this stage, we test form, scale, and proportion while ensuring the design aligns with practical constraints. Our iterative approach allows flexibility, encouraging refinement and exploration before locking in a concept.</p>
                </div>
            </div>
        </div>
    )
}

export default Process
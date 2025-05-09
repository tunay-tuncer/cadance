// DEPENDENCIES
import { useEffect, useState } from "react"
import styles from "../../styles/Process.module.css"

// MEDIA
import processImgUrl from "../../assets/BlueGlassArrowPNG.png"
import diagramImage from "../../assets/BlueGlassLogoPNG.png"

import interiorImage from "../../assets/s2.1.png"
import interiorImageMaterialOverride from "../../assets/s2-MO.png"
import productImage from "../../assets/LandscapeWMaterial.jpg"
import productImageMaterialOverride from "../../assets/LandscapeWMaterialOverride.jpg"

// REACT ICONS
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Process = () => {
    const [sliderValue1, setSliderValue1] = useState(50)
    const [sliderValue2, setSliderValue2] = useState(50)

    const sliderImages = [
        { image1Url: interiorImage, image2Url: interiorImageMaterialOverride, image1Id: Math.floor(Math.random() * 10000), image2Id: Math.floor(Math.random() * 10000), slider: "slider1" },
        { image1Url: productImage, image2Url: productImageMaterialOverride, image1Id: Math.floor(Math.random() * 10000), image2Id: Math.floor(Math.random() * 10000), slider: "slider2" }
    ]

    // DETERMINE SLIDER ID - SET SLIDER VALUE
    const handleSliderValue = (e, sliderId) => {
        if (sliderId === "slider1") {
            setSliderValue1(e.target.value);
        } else {
            setSliderValue2(e.target.value);
        }
    };

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
                <div className={styles.diagramContainer}>
                    <img src={diagramImage} className={styles.diagramImage} alt="" />
                    <img src={diagramImage} className={styles.diagramImage} alt="" />
                    <img src={diagramImage} className={styles.diagramImage} alt="" />
                </div>
            </div>

            <div className={styles.thirdStepContainer}>
                <h2 className="homepageHeading">MODELLING AND VISUALIZATION</h2>
                <div className={styles.textContainer}>
                    <p>With a clear concept in place, we move into the technical phase, building precise 3D models in various softwares. Here, we refine materiality, spatial relationships, and construction details, ensuring that the project is both aesthetically pleasing and functionally sound. This phase also allows for early visualization, helping to communicate the essence of the design effectively.</p>
                    <ul>
                        Once the model is complete, we bring the project to life with high-quality renders and visual storytelling. We focus on:
                        <div className={styles.renderStepsDiv}>
                            <div className={styles.renderStep}>Model Topology</div>
                            <div className={styles.renderStep}>Lighting and Atmosphere</div>
                            <div className={styles.renderStep}>Material Realism</div>
                            <div className={styles.renderStep}>Composition and Perspective</div>
                        </div>

                    </ul>

                </div>

                <ul className={styles.imageSliderMainContainer}>
                    {sliderImages.map((item, id) => (
                        <li className={styles.sliderLi} key={id}>
                            <img className={styles.sliderImage1} src={item.image1Url} alt="" />

                            <img className={styles.sliderImage2} src={item.image2Url} alt="" style={{ width: `${item.slider === "slider1" ? sliderValue1 : sliderValue2}%` }} />

                            <input type="range" min={0} max={100} onChange={(e) => handleSliderValue(e, item.slider)}
                                className={styles.slider} value={item.slider === "slider1" ? sliderValue1 : sliderValue2} />

                            <div className={styles.horizontalLine} style={{ left: item.slider === "slider1" ? `${sliderValue1}%` : `${sliderValue2}%` }}>
                                <div className={styles.iconContainer}>
                                    <FaChevronLeft />
                                    <FaChevronRight />
                                </div>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>


        </div>
    )
}

export default Process
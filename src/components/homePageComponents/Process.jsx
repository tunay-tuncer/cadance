// DEPENDENCIES
import { useContext, useState } from "react" // 1. Added useContext
import { ProjectContext } from "../../context/ProjectContext" // 2. Added Context import

// PAGE COMPONENTS
import styles from "../../styles/Process.module.css"

// MEDIA
import processImgUrl from "../../assets/BlueGlassArrowPNG.png"

import interiorImage from "../../assets/s2.1.png"
import interiorImageMaterialOverride from "../../assets/s2-MO.png"
import productImage from "../../assets/LandscapeWMaterial.jpg"
import productImageMaterialOverride from "../../assets/LandscapeWMaterialOverride.jpg"

// REACT ICONS
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Process = () => {
    const { selectedLanguage } = useContext(ProjectContext);

    const [sliderValue1, setSliderValue1] = useState(50)
    const [sliderValue2, setSliderValue2] = useState(50)

    const sliderImages = [
        { image1Url: interiorImage, image2Url: interiorImageMaterialOverride, image1Id: Math.floor(Math.random() * 10000), image2Id: Math.floor(Math.random() * 10000), slider: "slider1" },
        { image1Url: productImage, image2Url: productImageMaterialOverride, image1Id: Math.floor(Math.random() * 10000), image2Id: Math.floor(Math.random() * 10000), slider: "slider2" }
    ]

    // 4. Translation Object
    const content = {
        EN: {
            step1Heading: "UNDERSTANDING THE VISION",
            step1P1: "At Cadance, our design process is a carefully structured journey that transforms ideas into visually compelling architectural experiences. We believe that every project deserves a unique approach, blending creativity with precision to achieve impactful results.",
            step1P2: "Every project begins with a deep understanding of its purpose, context, and client expectations. Whether it’s an architectural structure, an urban intervention, or a product design, we take the time to analyze the goals, aesthetic direction, and functional requirements. This stage involves research, mood boards, and conceptual sketches to align our vision with the project's objectives.",
            step2Heading: "MODELLING AND VISUALIZATION",
            step2P1: "With a clear concept in place, we move into the technical phase, building precise 3D models in various softwares. Here, we refine materiality, spatial relationships, and construction details, ensuring that the project is both aesthetically pleasing and functionally sound. This phase also allows for early visualization, helping to communicate the essence of the design effectively.",
            step2P2: "Once the model is complete, we bring the project to life with high-quality renders and visual storytelling."
        },
        TR: {
            step1Heading: "VİZYONU ANLAMAK",
            step1P1: "Cadance olarak tasarım sürecimiz, fikirleri görsel açıdan etkileyici mimari deneyimlere dönüştüren, özenle kurgulanmış bir yolculuktur. Her projenin, yaratıcılığı hassasiyetle harmanlayan özgün bir yaklaşımı hak ettiğine inanıyoruz.",
            step1P2: "Her proje; amacının, bağlamının ve müşteri beklentilerinin derinlemesine anlaşılmasıyla başlar. İster mimari bir yapı, ister kentsel bir müdahale veya ürün tasarımı olsun; hedefleri, estetik yönü ve işlevsel gereklilikleri analiz etmek için zaman ayırırız. Bu aşama, vizyonumuzu projenin hedefleriyle hizalamak için araştırma, mood board çalışmaları ve kavramsal eskizleri içerir.",
            step2Heading: "MODELLEME VE GÖRSELLEŞTİRME",
            step2P1: "Net bir konsept belirlendikten sonra teknik aşamaya geçiyor ve çeşitli yazılımlarda hassas 3D modeller oluşturuyoruz. Burada malzeme detaylarını, mekansal ilişkileri ve yapısal detayları geliştirerek projenin hem estetik hem de işlevsel açıdan sağlam olmasını sağlıyoruz. Bu aşama aynı zamanda erken görselleştirmeye olanak tanıyarak tasarımın özünü etkili bir şekilde aktarmaya yardımcı olur.",
            step2P2: "Model tamamlandığında, projeyi yüksek kaliteli renderlar ve görsel hikaye anlatımıyla hayata geçiriyoruz."
        }
    }

    // Safety Check
    const currentLang = content[selectedLanguage] ? selectedLanguage : "EN";

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
                <h2 className="homepageHeading">{content[currentLang].step1Heading}</h2>

                <div className={styles.textContainer}>
                    <p>{content[currentLang].step1P1}</p>
                    <p>{content[currentLang].step1P2}</p>
                </div>
                <img src={processImgUrl} alt="" className={styles.visionImage} />
            </div>

            <div className={styles.thirdStepContainer}>
                <h2 className="homepageHeading">{content[currentLang].step2Heading}</h2>

                <div className={styles.textContainer}>
                    <p>{content[currentLang].step2P1}</p>
                    <p>{content[currentLang].step2P2}</p>
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
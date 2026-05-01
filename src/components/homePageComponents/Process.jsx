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
            step1Heading: "DESIGN VISION AND STRATEGIC APPROACH",
            step1P1: "At Cadance, our design process is a strategic journey that transforms ideas into visually compelling architectural experiences. Whether it’s an architectural structure or an urban intervention, we begin by conducting in-depth research and creating mood boards to analyze the project’s objectives, material textures, and functional requirements. Our goal is to reveal the project’s unique identity with creative sensitivity.",
            step1P2: "Every project begins with a deep understanding of its purpose, context, and client expectations. Whether it’s an architectural structure, an urban intervention, or a product design, we take the time to analyze the goals, aesthetic direction, and functional requirements. This stage involves research, mood boards, and conceptual sketches to align our vision with the project's objectives.",
            step2Heading: "ADVANCED MODELING AND VISUALIZATION",
            step2P1: "Once we have a clear concept, we bring the project into the digital realm using precise 3D modeling techniques. At this stage, we meticulously focus not only on form but also on material details and spatial relationships to ensure the project’s technical and aesthetic consistency. At the end of the process, we bring the project to life through high-quality renders and visual storytelling, presenting the most realistic representation of what has yet to be built. ",
            step2P2: "Once the model is complete, we bring the project to life with high-quality renders and visual storytelling."
        },
        TR: {
            step1Heading: "TASARIM VİZYONU ve STRATEJİK YAKLAŞIM",
            step1P1: "Cadance olarak tasarım sürecimiz, fikirleri görsel açıdan etkileyici mimari deneyimlere dönüştüren stratejik bir yolculuktur. İster mimari bir yapı, ister kentsel bir müdahale olsun; hedefleri, malzeme dokularını ve işlevsel gereklilikleri analiz etmek için derinlemesine araştırma ve moodboard çalışmalarıyla işe başlıyoruz. Amacımız, projenin özgün kimliğini kreatif bir hassasiyetle ortaya çıkarmaktır.",
            step1P2: "Her proje; amacının, bağlamının ve müşteri beklentilerinin derinlemesine anlaşılmasıyla başlar. İster mimari bir yapı, ister kentsel bir müdahale veya ürün tasarımı olsun; hedefleri, estetik yönü ve işlevsel gereklilikleri analiz etmek için zaman ayırırız. Bu aşama, vizyonumuzu projenin hedefleriyle hizalamak için araştırma, mood board çalışmaları ve kavramsal eskizleri içerir.",
            step2Heading: "İLERİ SEVİYE MODELLEME ve GÖRSELLEŞTİRME",
            step2P1: "Net bir konseptin ardından, hassas 3D modelleme teknikleriyle projeyi dijital dünyaya taşıyoruz. Bu aşamada sadece form değil, malzeme detayları ve mekansal ilişkiler üzerinde titizlikle durarak projenin teknik ve estetik tutarlılığını sağlıyoruz. Sürecin sonunda, yüksek kaliteli renderlar ve görsel hikaye anlatımıyla projeyi hayata geçiriyor, henüz inşa edilmemiş olanın en gerçekçi halini sunuyoruz.",
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
        <section className={styles.processMainContainer}>
            <article id='process' className={styles.firstStepContainer}>
                <h2 className="homepageHeading">{content[currentLang].step1Heading}</h2>

                <div className={styles.textContainer}>
                    <p>{content[currentLang].step1P1}</p>
                    <p>{content[currentLang].step1P2}</p>
                </div>
                <img src={processImgUrl} alt="" className={styles.visionImage} />
            </article>

            <article className={styles.thirdStepContainer}>
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
            </article>
        </section>
    )
}

export default Process
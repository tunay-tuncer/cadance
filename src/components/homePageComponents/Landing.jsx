// DEPENDENCIES
import { useEffect, useRef, useState, useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import styles from "../../styles/Landing.module.css";
// MEDIA
import video from "../../assets/logoAnimation.webm";

const Landing = () => {
    const videoRef = useRef(null);
    const { selectedLanguage } = useContext(ProjectContext);

    const videoTexts = {
        EN: ["ARCHITECTURE", "PRODUCT DESIGN", "3D VISUALIZATION", "RENOVATION"],
        TR: ["MİMARLIK", "ÜRÜN TASARIMI", "3D GÖRSELLEŞTİRME", "TADİLAT"]
    };

    const currentLang = videoTexts[selectedLanguage] ? selectedLanguage : "EN";

    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    // SETUP FOR AUTOPLAY WHEN LOADED
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((error) => console.error("Autoplay prevented:", error));
        }
    }, []);

    // VIDEO TEXT ANIMATION
    useEffect(() => {
        const currentList = videoTexts[currentLang];

        const textInterval = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % currentList.length);
        }, 4000);

        return () => clearInterval(textInterval);
    }, [currentLang]); // Updated dependency

    return (
        <div id="video" className={styles.mainContainer}>
            <div className={styles.videoContainer}>
                <video ref={videoRef} autoPlay loop muted playsInline>
                    <source src={video} type="video/webm" />
                    Your browser does not support the video tag.
                </video>

                <div className={styles.videoTextDiv}>
                    <h1>CADANCE</h1>
                    <p>{videoTexts[currentLang][currentTextIndex]}</p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
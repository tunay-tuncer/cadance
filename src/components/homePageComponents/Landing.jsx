import { useEffect, useRef, useState } from "react";
import styles from "../../styles/Landing.module.css";
import video from "../../assets/logoAnimation.webm";

const Landing = () => {
    const videoRef = useRef(null);

    const videoTexts = ["ARCHITECTURE", "PRODUCT DESIGN", "3D VISUALIZATION", "RENOVATION"]
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((error) => console.error("Autoplay prevented:", error));
        }
    }, []);

    useEffect(() => {
        const textInterval = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % videoTexts.length);
        }, 4000);

        return () => clearInterval(textInterval);
    }, [])

    return (
        <div id="video" className={styles.mainContainer}>

            <div className={styles.videoContainer}>

                <video ref={videoRef} autoPlay loop muted playsInline>
                    <source src={video} type="video/webm" />
                    Your browser does not support the video tag.
                </video>

                <div className={styles.videoTextDiv}>
                    <h1>CADANCE</h1>
                    <p>{videoTexts[currentTextIndex]}</p>
                </div>

            </div>

        </div>
    );
};

export default Landing;

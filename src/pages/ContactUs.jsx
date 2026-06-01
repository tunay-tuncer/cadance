// DEPENDENCIES
import { useContext, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { ProjectContext } from '../context/ProjectContext';
import seoConfig from '../config/seoConfig';

// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import styles from "../styles/ContactUs.module.css";

// MEDIA
import image from "../assets/WindowsLogoFullBlack.22.jpg";

// REACT ICONS
import { IoIosMail } from "react-icons/io";
import { FaPhone, FaArrowRight, FaInstagram, FaPinterest } from "react-icons/fa6";

const ContactUs = () => {
    const { selectedLanguage } = useContext(ProjectContext);
    const seoData = seoConfig[selectedLanguage].CONTACT;
    const [isVisible, setIsVisible] = useState(false);

    // Dinamik Mail Konuları (Kullanıcı tıkladığında doğrudan istemciyi doldurur)
    const mailSubjects = {
        EN: {
            viz: "mailto:info@cadancestudio.com?subject=[Cadance Studio] New Project Inquiry - Visualization",
            renovation: "mailto:info@cadancestudio.com?subject=[Cadance Studio] New Project Inquiry - Renovation",
            drawing: "mailto:info@cadancestudio.com?subject=[Cadance Studio] New Project Inquiry - Drawing/Project"
        },
        TR: {
            viz: "mailto:info@cadancestudio.com?subject=[Cadance Studio] Yeni Proje Talebi - Görselleştirme",
            renovation: "mailto:info@cadancestudio.com?subject=[Cadance Studio] Yeni Proje Talebi - Tadilat / Yenileme",
            drawing: "mailto:info@cadancestudio.com?subject=[Cadance Studio] Yeni Proje Talebi - Proje / Çizim"
        }
    };

    function handleMailAddress() {
        navigator.clipboard.writeText("info@cadancestudio.com");
        setIsVisible(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 2000);
    }

    return (
        <div id='contactUs' className={styles.contactUsMainContainer}>
            <Helmet>
                <title>{seoData.title}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                <meta property="og:title" content={seoData.ogTitle} />
                <meta property="og:description" content={seoData.ogDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={seoData.canonical} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoData.ogTitle} />
                <meta name="twitter:description" content={seoData.ogDescription} />
                <link rel="canonical" href={seoData.canonical} />
                <html lang={selectedLanguage === "TR" ? "tr" : "en"} />
            </Helmet>
            <Navbar />

            <div className={styles.contactUsContainer}>
                {/* Sol Taraf: Sanatsal/Soyut 3D Görsel alanı */}
                <div className={styles.imageWrapper}>
                    <img src={image} alt="Cadance Studio Design" className={styles.contactUsImage} />
                </div>

                {/* Sağ Taraf: Moody & Dark Luxury İçerik Alanı */}
                <div className={styles.contactUsTextDiv}>
                    <div className={styles.headerSection}>
                        <h1>{selectedLanguage === "EN" ? "START A PROJECT" : "PROJE BAŞLATIN"}</h1>
                        <p className={styles.subtext}>
                            {selectedLanguage === "EN"
                                ? "Select your project type to send a direct inquiry or reach out via our channels."
                                : "Doğrudan talep göndermek için proje türünüzü seçin veya kanallarımızdan bize ulaşın."}
                        </p>
                    </div>

                    {/* Hızlı E-posta Tetikleyicileri (Kategori Bazlı) */}
                    <div className={styles.projectTypeContainer}>
                        <a href={mailSubjects[selectedLanguage].viz} className={styles.projectTypeCard}>
                            <span>Viz</span>
                            <FaArrowRight className={styles.arrowIcon} />
                        </a>
                        <a href={mailSubjects[selectedLanguage].renovation} className={styles.projectTypeCard}>
                            <span>Renovation</span>
                            <FaArrowRight className={styles.arrowIcon} />
                        </a>
                        <a href={mailSubjects[selectedLanguage].drawing} className={styles.projectTypeCard}>
                            <span>Drawing</span>
                            <FaArrowRight className={styles.arrowIcon} />
                        </a>
                    </div>

                    {/* Klasik İletişim Bilgileri Bilgileri */}
                    <div className={styles.infoWrapper}>
                        <div className={styles.contactText} onClick={handleMailAddress}>
                            <IoIosMail className={styles.infoIcon} />
                            <span className={styles.emailText}>info@cadancestudio.com</span>
                            {isVisible && (
                                <span className={styles.toastCopy}>
                                    {selectedLanguage === "EN" ? "Copied!" : "Kopyalandı!"}
                                </span>
                            )}
                        </div>
                        <div className={styles.phoneGroup}>
                            <a href="tel:+905532665804" className={styles.contactText}>
                                <FaPhone className={styles.infoIcon} />
                                <span>+90 553 266 58 04</span>
                            </a>
                            <a href="tel:+905076633152" className={styles.contactText}>
                                <FaPhone className={styles.infoIcon} />
                                <span>+90 507 663 31 52</span>
                            </a>
                        </div>
                    </div>

                    {/* Cadance Flow Pazarlama & Giriş Kartı */}
                    <div className={styles.flowShowcaseCard}>
                        <h3>CADANCE FLOW</h3>
                        <p>
                            {selectedLanguage === "EN"
                                ? "Track your project's phase, revisions, and real-time approvals via your exclusive client dashboard."
                                : "Projenizin aşamalarını, revizyonlarını ve anlık onay süreçlerini size özel müşteri panelinizden takip edin."}
                        </p>
                        <a href="https://flow.cadancestudio.com" target="_blank" rel="noopener noreferrer" className={styles.flowButton}>
                            {selectedLanguage === "EN" ? "Go to Client Dashboard" : "Müşteri Paneline Git"}
                            <FaArrowRight />
                        </a>
                    </div>

                    {/* Sosyal Medya Linkleri */}
                    <div className={styles.socialsContainer}>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                            <FaPinterest />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
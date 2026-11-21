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
import { FaPhone, FaArrowRight, FaInstagram, FaPinterest, FaWhatsapp, FaRegCopy, FaCheck } from "react-icons/fa6";

const ContactUs = () => {
    const { selectedLanguage } = useContext(ProjectContext);
    const seoData = seoConfig[selectedLanguage].CONTACT;
    const [copiedTarget, setCopiedTarget] = useState(null); // 'email' | 'phone' | null

    const corporatePhone = "+90 533 092 77 35";
    const corporatePhoneRaw = "+905330927735";

    const mailSubjects = {
        English: {
            viz: "mailto:info@cadancestudio.com?subject=[Cadance Studio] New Project Inquiry - Visualization",
            renovation: "mailto:info@cadancestudio.com?subject=[Cadance Studio] New Project Inquiry - Renovation",
            drawing: "mailto:info@cadancestudio.com?subject=[Cadance Studio] New Project Inquiry - Drawing/Project"
        },
        Türkçe: {
            viz: "mailto:info@cadancestudio.com?subject=[Cadance Studio] Yeni Proje Talebi - Görselleştirme",
            renovation: "mailto:info@cadancestudio.com?subject=[Cadance Studio] Yeni Proje Talebi - Tadilat / Yenileme",
            drawing: "mailto:info@cadancestudio.com?subject=[Cadance Studio] Yeni Proje Talebi - Proje / Çizim"
        }
    };

    const whatsappMessage = selectedLanguage === "English"
        ? encodeURIComponent("Hello Cadance Studio, I would like to inquire about a new project.")
        : encodeURIComponent("Merhaba Cadance Studio, yeni bir proje hakkında bilgi ve teklif almak istiyorum.");

    const whatsappUrl = `https://wa.me/905330927735?text=${whatsappMessage}`;

    const handleCopy = (text, type, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        navigator.clipboard.writeText(text);
        setCopiedTarget(type);
        setTimeout(() => {
            setCopiedTarget(null);
        }, 2000);
    };

    return (
        <div
            id='contactUs'
            className={styles.contactUsMainContainer}
            style={{
                backgroundColor: '#ffffff',
                height: 'calc(100vh - 4rem)',
                maxHeight: 'calc(100vh - 4rem)',
                overflow: 'hidden'
            }}
        >
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
                <html lang={selectedLanguage === "Türkçe" ? "tr" : "en"} />
            </Helmet>
            <Navbar />

            <div
                className={styles.contactUsContainer}
                style={{
                    backgroundColor: '#ffffff',
                    height: '100%',
                    maxHeight: '100%',
                    overflow: 'hidden'
                }}
            >
                {/* Sol Taraf: Görsel Alanı */}
                <div className={styles.imageWrapper}>
                    <img src={image} alt="Cadance Studio Design" className={styles.contactUsImage} />
                </div>

                {/* Sağ Taraf: Orijinal Açık/Beyaz Arka Plan Alanı */}
                <div
                    className={styles.contactUsTextDiv}
                >
                    <div className={styles.headerSection}>
                        <h1>{selectedLanguage === "English" ? "START A PROJECT" : "PROJE BAŞLATIN"}</h1>
                        <p className={styles.subtext}>
                            {selectedLanguage === "English"
                                ? "Select your project category or contact our team directly through our corporate channels."
                                : "Doğrudan talep iletmek için proje türünüzü seçin veya kurumsal kanallarımızdan bize ulaşın."}
                        </p>
                    </div>

                    {/* Hızlı E-posta Tetikleyicileri (Kategori Bazlı) */}
                    <div className={styles.projectTypeContainer}>
                        <a href={mailSubjects[selectedLanguage].viz} className={styles.projectTypeCard}>
                            <span>{selectedLanguage === "Türkçe" ? "Görselleştirme" : "Visualization"}</span>
                            <FaArrowRight className={styles.arrowIcon} />
                        </a>
                        <a href={mailSubjects[selectedLanguage].renovation} className={styles.projectTypeCard}>
                            <span>{selectedLanguage === "Türkçe" ? "Tadilat" : "Renovation"}</span>
                            <FaArrowRight className={styles.arrowIcon} />
                        </a>
                        <a href={mailSubjects[selectedLanguage].drawing} className={styles.projectTypeCard}>
                            <span>{selectedLanguage === "Türkçe" ? "Çizim" : "Drawing"}</span>
                            <FaArrowRight className={styles.arrowIcon} />
                        </a>
                    </div>

                    {/* Kurumsal İletişim Bilgileri: E-posta ve Şirket Hattı */}
                    <div className={styles.infoWrapper}>
                        {/* E-posta Satırı */}
                        <div className={styles.contactItem}>
                            <a href="mailto:info@cadancestudio.com" className={styles.contactText}>
                                <IoIosMail className={styles.infoIcon} />
                                <span className={styles.emailText}>info@cadancestudio.com</span>
                            </a>
                            <button
                                type="button"
                                className={styles.copyBtn}
                                onClick={(e) => handleCopy("info@cadancestudio.com", "email", e)}
                                aria-label={selectedLanguage === "English" ? "Copy email" : "E-postayı kopyala"}
                                title={selectedLanguage === "English" ? "Copy email" : "E-postayı kopyala"}
                            >
                                {copiedTarget === "email" ? (
                                    <span className={styles.copyFeedback}>
                                        <FaCheck className={styles.checkIcon} />
                                        {selectedLanguage === "English" ? "Copied" : "Kopyalandı"}
                                    </span>
                                ) : (
                                    <FaRegCopy />
                                )}
                            </button>
                        </div>

                        {/* Şirket Hattı Kartı */}
                        <div className={styles.corporatePhoneCard}>
                            <div className={styles.corporatePhoneHeader}>
                                <span className={styles.corporateBadge}>
                                    {selectedLanguage === "English" ? "CORPORATE LINE" : "ŞİRKET HATTI"}
                                </span>
                                <span className={styles.locationBadge}>
                                    {selectedLanguage === "English" ? "Izmir / TR" : "İzmir / TR"}
                                </span>
                            </div>

                            <div className={styles.phoneMainRow}>
                                <a href={`tel:${corporatePhoneRaw}`} className={styles.phoneNumberLink}>
                                    <FaPhone className={styles.phoneIcon} />
                                    <span className={styles.phoneDigits}>{corporatePhone}</span>
                                </a>
                                <button
                                    type="button"
                                    className={styles.copyBtn}
                                    onClick={(e) => handleCopy(corporatePhone, "phone", e)}
                                    aria-label={selectedLanguage === "English" ? "Copy phone number" : "Numarayı kopyala"}
                                    title={selectedLanguage === "English" ? "Copy phone number" : "Numarayı kopyala"}
                                >
                                    {copiedTarget === "phone" ? (
                                        <span className={styles.copyFeedback}>
                                            <FaCheck className={styles.checkIcon} />
                                            {selectedLanguage === "English" ? "Copied" : "Kopyalandı"}
                                        </span>
                                    ) : (
                                        <FaRegCopy />
                                    )}
                                </button>
                            </div>

                            {/* Hızlı Aksiyon Butonları */}
                            <div className={styles.quickActionGroup}>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.whatsappActionBtn}
                                    aria-label="WhatsApp Business"
                                >
                                    <FaWhatsapp className={styles.waIcon} />
                                    <span>{selectedLanguage === "English" ? "WhatsApp Chat" : "WhatsApp ile Yazın"}</span>
                                </a>
                                <a
                                    href={`tel:${corporatePhoneRaw}`}
                                    className={styles.callActionBtn}
                                    aria-label={selectedLanguage === "English" ? "Call company phone" : "Şirket hattını ara"}
                                >
                                    <FaPhone className={styles.callIcon} />
                                    <span>{selectedLanguage === "English" ? "Call Now" : "Hemen Arayın"}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Cadance Flow Müşteri Paneli Kartı */}
                    <div className={styles.flowShowcaseCard}>
                        <div className={styles.flowHeader}>
                            <h3>CADANCE FLOW</h3>
                            <span className={styles.flowPill}>CLIENT PORTAL</span>
                        </div>
                        <p>
                            {selectedLanguage === "English"
                                ? "Track your project's phase, revisions, and real-time approvals via your exclusive client dashboard."
                                : "Projenizin aşamalarını, revizyonlarını ve anlık onay süreçlerini size özel müşteri panelinizden takip edin."}
                        </p>
                        <a href="https://flow.cadancestudio.com" target="_blank" rel="noopener noreferrer" className={styles.flowButton}>
                            <span>{selectedLanguage === "English" ? "Go to Client Dashboard" : "Müşteri Paneline Git"}</span>
                            <FaArrowRight />
                        </a>
                    </div>

                    {/* Sosyal Medya Linkleri */}
                    <div className={styles.socialsContainer}>
                        <a
                            href="https://instagram.com/cadancestudio"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className={`${styles.socialLink} ${styles.socialIg}`}
                            title="Instagram"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://pinterest.com/cadancestudio"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Pinterest"
                            className={`${styles.socialLink} ${styles.socialPin}`}
                            title="Pinterest"
                        >
                            <FaPinterest />
                        </a>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp Business"
                            className={`${styles.socialLink} ${styles.socialWa}`}
                            title="WhatsApp Business"
                        >
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
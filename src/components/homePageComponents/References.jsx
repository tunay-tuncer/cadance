import { useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import styles from "../../styles/References.module.css"

const References = () => {
    const { selectedLanguage } = useContext(ProjectContext);

    const originalImages = [
        { id: 1, url: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1788002777/DeuMimarlik_kboyvs.png", name: "Dokuz Eylül Mimarlık" },
        { id: 2, url: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1788003039/Aspar_tpeamf.png", name: "Aspar Kuyumculuk" },
        { id: 3, url: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1788003121/Sinav_fsox09.png", name: "Sınav Eğitim Kurumları" },
        { id: 4, url: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1788003231/Mavlu_h63k89.png", name: "Mavlu Mimarlık" },
        { id: 5, url: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1788003397/Biop_um5o4d.png", name: "Biop Biotech" },
        { id: 6, url: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1788003634/Alfa_cow7za.png", name: "Alfa Havuz ve İklimlendirme" },
        { id: 7, url: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1788003852/Iyonya_gvc3g3.png", name: "Iyonya Mühendislik" }
    ]

    const referenceImages = [...originalImages, ...originalImages];

    return (
        <section className={styles.referencesContainer} id="references">
            <div className={styles.headerWrapper}>
                <span className={styles.subHeading}>{selectedLanguage == "English" ? "Trusted Partners" : "İş Ortaklarımız"}</span>
                <h2 className={styles.heading}>{selectedLanguage == "English" ? "Our Collaborations" : "Referanslar"}</h2>
            </div>

            <div className={styles.carouselTrack}>
                <ul className={styles.referencesInnerContainer}>
                    {referenceImages.map((reference, index) => (
                        <li key={`${reference.id}-${index}`} className={styles.referenceItem}>
                            <div className={styles.imageWrapper}>
                                <img src={reference.url} alt={reference.name} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default References;
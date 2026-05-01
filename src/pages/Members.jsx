//DEPENDENCIES
import { useContext, useEffect } from "react";
import { ProjectContext } from "../context/ProjectContext";

// PAGE COMPONENTS
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import styles from "../styles/Members.module.css"

const Members = () => {
    const { selectedLanguage } = useContext(ProjectContext);

    const membersList = [
        { id: 0, memberName: "TUNAY EKİN TUNÇER", memberImage: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1777643859/TunayTun%C3%A7er_zfh71u.png", memberTitleEn: "COFOUNDING PARTNER / ARCHITECT", memberTitleTr: "KURUCU ORTAK / MİMAR" },
        { id: 1, memberName: "GÖKCAN AYKAÇ", memberImage: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1777644346/G%C3%B6kcanAyka%C3%A7_e7le24.png", memberTitleEn: "COFOUNDING PARTNER / ARCHITECT", memberTitleTr: "KURUCU ORTAK / MİMAR" },
        { id: 2, memberName: "ODIN", memberImage: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1777643859/Odin_u7slac.png", memberTitleEn: "MYSTIC DESIGNER", memberTitleTr: "MİSTİK TASARIMCI" }
    ]

    return (
        <div className={styles.membersMainContainer} >
            <Navbar />
            <ul className={styles.membersUl}>
                {membersList.map((member) => (
                    <li key={member.id} className={styles.member}>
                        <img src={member.memberImage} style={styles.memberPic} alt="" />
                        <div className={styles.memberTextDiv}>
                            <h2 className={styles.memberName}>{member.memberName}</h2>
                            <p className={styles.memberName}>{selectedLanguage == "EN" ? member.memberTitleEn : member.memberTitleTr}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <Footer />
        </div>
    )
}

export default Members
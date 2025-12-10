//DEPENDENCIES
import { useContext, useEffect } from "react";
import { ProjectContext } from "../context/ProjectContext";

// PAGE COMPONENTS
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import styles from "../styles/Members.module.css"
import memberPhoto from "../assets/MiesPortrait.jpg"

const Members = () => {
    const { selectedLanguage } = useContext(ProjectContext);

    const membersList = [
        { id: 0, memberName: "TUNAY EKİN TUNÇER", memberImage: memberPhoto, memberTitleEn: "CO-FOUNDER", memberTitleTr: "KURUCU ORTAK" },
        { id: 1, memberName: "GÖKCAN AYKAÇ", memberImage: memberPhoto, memberTitleEn: "CO-FOUNDER", memberTitleTr: "KURUCU ORTAK" },
        { id: 2, memberName: "ODIN", memberImage: memberPhoto, memberTitleEn: "MYSTIC DESIGNER", memberTitleTr: "MİSTİK TASARIMCI" }
    ]

    return (
        <div className={styles.membersMainContainer} >
            <Navbar />
            <ul className={styles.membersUl}>
                {membersList.map((member) => (
                    <li key={member.id} className={styles.member}>
                        <img src={member.memberImage} alt="" />
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
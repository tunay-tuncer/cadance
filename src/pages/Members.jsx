import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import styles from "../styles/Members.module.css"
import memberPhoto from "../assets/MiesPortrait.jpg"

const Members = () => {
    const membersList = [
        { id: 0, memberName: "TUNAY EKİN TUNÇER", memberImage: memberPhoto, memberTitle: "HEAD ARCHITECT" },
        { id: 1, memberName: "GÖKCAN AYKAÇ", memberImage: memberPhoto, memberTitle: "HEAD ARCHITECT" },
        { id: 2, memberName: "ODIN", memberImage: memberPhoto, memberTitle: "HEAD ARCHITECT" }
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
                            <p className={styles.memberName}>{member.memberTitle}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <Footer/>
        </div>
    )
}

export default Members
// PAGE COMPONENTS
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import  styles from "../styles/ContactUs.module.css";

// MEDIA
import image from "../assets/WindowsLogoFullBlack.22.jpg"

// REACT ICONS
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";

const WorkWithUs = () => {
    const contactInfo = [
        { icon: <IoIosMail/>, text: "info@cadancedesign.com", onClick: () => {navigator.clipboard.writeText("info@cadancedesign.com")} },
        { icon: <FaPhone/>, text: "+90 553 266 58 04", onClick: () => window.location.href=`tel:+905532665804` },
        { icon: <FaPhone/>, text: "+90 507 663 31 52", onClick: () => window.location.href=`tel:+905076633152` }
    ]

    return (
        <div id='workWithUs' className={styles.contactUsMainContainer}>
            <Navbar />
            <div className={styles.contactUsContainer}>
                <img src={image} alt="" className={styles.contactUsImage}/>
                <div className={styles.contactUsTextDiv}>
                    <h1>CONTACT US</h1>
                    <ul className={styles.iconsContainer}>
                        {contactInfo.map((info, id) => (
                            <li className={styles.contactText} onClick={info.onClick} key={id}>
                                {info.icon}
                                <p>{info.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default WorkWithUs
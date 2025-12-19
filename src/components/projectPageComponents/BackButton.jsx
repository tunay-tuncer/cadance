import { Link } from "react-router";
import styles from "../../styles/BackButton.module.css"
import { IoMdArrowBack } from "react-icons/io";

const BackButton = () => {
    return (
        <Link className={styles.backButtonDiv} to={"/portfolio"}>
            <IoMdArrowBack className={styles.backButton} />
        </Link>
    )
}

export default BackButton
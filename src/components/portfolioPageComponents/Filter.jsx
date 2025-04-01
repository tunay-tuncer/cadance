import { useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import styles from "../../styles/Filter.module.css";
import { IoIosSearch } from "react-icons/io";

const Filter = () => {
    const { selectedProjectType, setSelectedProjectType } = useContext(ProjectContext);

    const filterButtons = [
        { name: "ARCHITECTURE", id: "architecture" },
        { name: "PRODUCT", id: "product" }
    ];

    const handleSelectedProjectType = (projectType) => {
        setSelectedProjectType(projectType);
    };

    return (
        <div className={styles.filterMainContainer}>
            {filterButtons.map((item) => (
                <button
                    key={item.id}
                    className={`${styles.filterButton} ${selectedProjectType === item.id ? styles.selectedButton : ""}`}
                    onClick={() => handleSelectedProjectType(item.id)}
                >
                    {item.name}
                </button>
            ))}
            <div className="inputContainer">
                <input type="text" />
                <IoIosSearch />
            </div>
        </div>
    );
};

export default Filter;

import { useContext, useEffect } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import styles from "../../styles/Filter.module.css";

const Filter = ({ searchText, setSearchText }) => {
    const { selectedProjectType, selectedLanguage, setSelectedProjectType } = useContext(ProjectContext);

    const filterButtons = [
        { nameTr: "MİMARLIK", nameEn: "ARCHITECTURE", id: "architecture" },
        { nameTr: "ÜRÜN", nameEn: "PRODUCT", id: "product" }
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
                    {selectedLanguage == "EN" ? item.nameEn : item.nameTr}
                </button>
            ))}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    className={styles.filterInput}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={selectedLanguage == "EN" ? "Search by tags (e.g. istanbul 2025)" : "Etiketlere göre ara (ör. istanbul 2025)"}
                />
                {searchText.length > 0 && (
                    <p className={styles.deleteButton} onClick={() => setSearchText("")}>x</p>
                )}
            </div>
        </div>
    );
};

export default Filter;

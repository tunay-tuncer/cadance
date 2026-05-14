import styles from "../../styles/PortfolioSkeleton.module.css";

const PortfolioSkeleton = ({ count = 6 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className={styles.skeletonContainer}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonDescription}>
                        <div className={styles.skeletonTitle}></div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default PortfolioSkeleton;

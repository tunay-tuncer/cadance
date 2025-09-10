// DEPENDENCIES
import { useEffect, useContext, useState } from "react";
import styles from "../../styles/Project.module.css";
import supabaseClient from "../../config/supabaseClient";
import { ProjectContext } from "../../context/ProjectContext";

const VerticalSlider = () => {
  const { selectedProject, setSelectedProject } = useContext(ProjectContext);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const projectId = typeof window !== "undefined"
    ? window.location.pathname.split("/")[2]
    : null;

  const getProject = async () => {
    if (!projectId) return;
    const { data, error } = await supabaseClient
      .from("cadanceTestTable")
      .select()
      .eq("id", projectId)
      .single();

    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setProject(data);
      setSelectedProject?.(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      setProject(selectedProject);
      setIsLoading(false);
    } else {
      getProject();
    }
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .vs-container {
            width: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            scroll-snap-type: y mandatory;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
            touch-action: pan-y;
          }
          .vs-slide {
            scroll-snap-align: start;
            scroll-snap-stop: always;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }
          .vs-slide img {
            width: 100%;
            object-fit: cover;
          }
        }
      `}</style>

      <div className={`${styles.mainSlider} vs-container`} aria-label="Vertical carousel">
        {isLoading && <div className={styles.slide}>Loading...</div>}

        {!isLoading && project && (
          <>
            <section className={`${styles.slide} vs-slide`} aria-roledescription="slide" aria-label="Project details">
              <h1>{project?.projectDetails?.projectName}</h1>
              <p>CLIENT</p>
              <p className={styles.slideText}>{project?.projectDetails?.client}</p>
              <p>LOCATION</p>
              <p className={styles.slideText}>{project?.projectDetails?.location}</p>
              <p>YEAR</p>
              <p className={styles.slideText}>{project?.projectDetails?.year}</p>
            </section>

            {project?.projectDetails?.projectPictureUrl &&
              project.projectDetails.projectPictureUrl.map((picture, id) => (
                <section
                  className={`${styles.slide} vs-slide`}
                  key={id}
                  aria-roledescription="slide"
                  aria-label={`Image ${id + 1}`}
                >
                  <img
                    src={picture}
                    alt={`Project image ${id + 1}`}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </section>
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default VerticalSlider;
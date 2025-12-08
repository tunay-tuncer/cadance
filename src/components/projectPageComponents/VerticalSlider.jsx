// DEPENDENCIES
import { useEffect, useContext, useState } from "react";
import styles from "../../styles/Project.module.css";
import supabaseClient from "../../config/supabaseClient";
import { ProjectContext } from "../../context/ProjectContext";

const VerticalSlider = () => {
  const { selectedProject, setSelectedProject, selectedLanguage } = useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState(true);

  const projectId = location.pathname.split("/")[2];
  const [project, setProject] = useState(null);

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const content = {
    EN: {
      clientLabel: "CLIENT",
      locationLabel: "LOCATION",
      yearLabel: "YEAR"
    },
    TR: {
      clientLabel: "MÜŞTERİ",
      locationLabel: "KONUM",
      yearLabel: "YIL"
    }
  };

  // Safety check: Default to EN if language is undefined
  const currentLang = content[selectedLanguage] ? selectedLanguage : "EN";

  const getProject = async () => {
    const { data, error } = await supabaseClient
      .from('cadanceTestTable')
      .select()
      .eq('id', projectId)
      .single();

    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      setProject(data);
      setSelectedProject(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProject();
    setProject(selectedProject);

  }, []);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = viewportWidth <= 768;

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
              <p>{content[currentLang].clientLabel}</p>
              <p className={styles.slideText}>{project?.projectDetails?.client}</p>
              <p>{content[currentLang].locationLabel}</p>
              <p className={styles.slideText}>{project?.projectDetails?.location}</p>
              <p>{content[currentLang].yearLabel}</p>
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
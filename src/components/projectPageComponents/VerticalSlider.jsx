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
      .from('cadance_projects')
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
      <div className={`${styles.mainSlider} vs-container`} aria-label="Vertical carousel">
        {isLoading && <div className={styles.slide}>Loading...</div>}

        {!isLoading && project && (
          <>
            <section className={`${styles.slide} vs-slide`} aria-roledescription="slide" aria-label="Project details">
              <div className={styles.projectDetailsContianer}>
                <h1>{project?.projectName}</h1>
                <p>{content[currentLang].clientLabel}</p>
                <p className={styles.slideText}>{project?.client}</p>
                <p>{content[currentLang].locationLabel}</p>
                <p className={styles.slideText}>{project?.location}</p>
                <p>{content[currentLang].yearLabel}</p>
                <p className={styles.slideText}>{project?.year}</p>
              </div>
              <div className={styles.projectDescriptionContainer}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis id eum eveniet ut sapiente iste repellat labore natus ipsum. Repellat, ex veniam fugit ut voluptas distinctio maiores sapiente culpa? Doloremque?
              </div>
            </section>

            {project?.projectPictureUrl &&
              project.projectPictureUrl.map((picture, id) => (
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
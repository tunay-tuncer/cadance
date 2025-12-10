import { createContext, useState } from "react";
import logo from "../assets/LogoBluePNG.png";

export const ProjectContext = createContext({})

export const ProjectContextProvider = ({ children }) => {
    const [projectDetails, setProjectDetails] = useState([
    ]);
    const [selectedNavItem, setSelectedNavItem] = useState("");

    const [selectedLanguage, setSelectedLanguage] = useState("TR");

    const navbarItems = [
        { logo: logo, id: "video", path: "/" },
        { nameTr: "HAKKINDA", nameEn: "ABOUT", id: "about", path: "/" },
        { nameTr: "SÜREÇ", nameEn: "PROCESS", id: "process", path: "/" },
        { nameTr: "ÜYELER", nameEn: "MEMBERS", id: "members", path: "/members" },
        { nameTr: "İLETİŞİM", nameEn: "CONTACT US", id: "contactUs", path: "/contactUs" },
        { nameTr: "PORTFOLYO", nameEn: "PORTFOLIO", id: "portfolio", path: "/portfolio" }
    ]

    const [selectedProjectType, setSelectedProjectType] = useState("architecture");
    const [selectedProject, setSelectedProject] = useState({});


    return (
        <ProjectContext.Provider value={{ selectedNavItem, setSelectedNavItem, selectedLanguage, setSelectedLanguage, navbarItems, selectedProjectType, setSelectedProjectType, selectedProject, setSelectedProject }}>
            {children}
        </ProjectContext.Provider>
    )
}
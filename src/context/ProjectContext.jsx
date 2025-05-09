import { createContext, useState } from "react";
import logo from "../assets/LogoBluePNG.png";

export const ProjectContext = createContext({})

export const ProjectContextProvider = ({ children }) => {
    const [projectDetails, setProjectDetails] = useState([
    ])
    const [selectedNavItem, setSelectedNavItem] = useState("")

    const navbarItems = [
        { logo: logo, id: "video" },
        { name: "ABOUT", id: "about" },
        { name: "PROCESS", id: "process" },
        { name: "MEMBERS", id: "members" },
        { name: "WORK WITH US", id: "workWithUs" }
    ]

    const [selectedProjectType, setSelectedProjectType] = useState("architecture");
    const [selectedProject, setSelectedProject] = useState({});


    return (
        <ProjectContext.Provider value={{ selectedNavItem, setSelectedNavItem, navbarItems, selectedProjectType, setSelectedProjectType, selectedProject, setSelectedProject }}>
            {children}
        </ProjectContext.Provider>
    )
}
import { createContext, useState } from "react";
import logo from "../assets/LogoBluePNG.png";

export const ProjectContext = createContext({})

export const ProjectContextProvider = ({ children }) => {
    const [projectDetails, setProjectDetails] = useState([
    ])
    const [selectedNavItem, setSelectedNavItem] = useState("")

    const navbarItems = [
        { logo: logo, id: "video", path:"/" },
        { name: "ABOUT", id: "about", path:"/" },
        { name: "PROCESS", id: "process", path:"/" },
        { name: "MEMBERS", id: "members", path:"/members" },
        { name: "CONTACT US", id: "workWithUs", path:"/contactUs" }
    ]

    const [selectedProjectType, setSelectedProjectType] = useState("architecture");
    const [selectedProject, setSelectedProject] = useState({});


    return (
        <ProjectContext.Provider value={{ selectedNavItem, setSelectedNavItem, navbarItems, selectedProjectType, setSelectedProjectType, selectedProject, setSelectedProject }}>
            {children}
        </ProjectContext.Provider>
    )
}
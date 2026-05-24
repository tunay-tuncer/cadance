import { createContext, useState } from "react";
import logo from "../assets/LogoBluePNG.png";

// REACT ICONS
import { TiSocialLinkedin } from "react-icons/ti";
import { TiSocialPinterest } from "react-icons/ti";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
        { nameTr: "İLETİŞİM", nameEn: "CONTACT US", id: "contact", path: "/contact" },
        { nameTr: "PORTFOLYO", nameEn: "PORTFOLIO", id: "portfolio", path: "/portfolio" },
        { nameTr: "FLOW", nameEn: "FLOW", id: "flow", path: "https://flow.cadancestudio.com" }
    ]

    const socialMedia = [
        { icon: <FaInstagram />, url: "https://www.instagram.com/cadancestudio/" },
        { icon: <TiSocialPinterest />, url: "https://tr.pinterest.com/cadancestudio/" },
        { icon: <TiSocialLinkedin />, url: "https://www.linkedin.com" }
    ]

    const [isArchitecture, setIsArchitecture] = useState(true);
    const [selectedProject, setSelectedProject] = useState({});


    return (
        <ProjectContext.Provider value={{ selectedNavItem, setSelectedNavItem, selectedLanguage, setSelectedLanguage, navbarItems, socialMedia, isArchitecture, setIsArchitecture, selectedProject, setSelectedProject }}>
            {children}
        </ProjectContext.Provider>
    )
}
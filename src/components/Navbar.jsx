import { useContext, useState } from 'react'
import { Link } from 'react-router'
import { ProjectContext } from '../context/ProjectContext';
import styles from "../styles/Navbar.module.css"



const Navbar = () => {
    const { navbarItems, selectedNavItem, setSelectedNavItem } = useContext(ProjectContext)

    const handleSelectedNavItem = (id) => {
        setSelectedNavItem("")
        setTimeout(() => setSelectedNavItem(id), 10); // Delay update slightly
    };

    return (
        <nav>
            <ul className={styles.linkContainer}>
                {navbarItems.map((item) => (item.logo ?
                    <Link key={item.id} to={"/"} onClick={() => handleSelectedNavItem(item.id)}><img className='logo' src={item.logo} alt="" /></Link> : <Link to={"/"} key={item.id}> <li className={styles.navLi} onClick={() => handleSelectedNavItem(item.id)}>{item.name}</li></Link>
                ))}
            </ul>

            <Link to={"/portfolio"} className={styles.portfolioContainer}>
                <li className={styles.navLi}>PORTFOLIO</li>
            </Link>
        </nav >
    )
}

export default Navbar
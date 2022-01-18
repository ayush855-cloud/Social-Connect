import React from 'react';
import { Link } from 'react-router-dom';
import Menus from './Menu';
import Search from './Search';
import '../../styles/header.css';
import { useSelector } from 'react-redux';




function Header() {
    const {theme,status,modal}=useSelector(state=>state);

    return (
        <>
        <div className={`header ${(status|| modal) && 'header_fixed'}`}>
     <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
     <Link className="navbar-brand text-uppercase logo" to="/" style={{fontSize:'1.5rem',color:"rgb(17, 87, 114)",fontWeight:'800',filter:theme?'invert(1)':"invert(0)"}}
     onClick={()=>window.scrollTo({top:0})}
     >Social Connect</Link>
     <Search/>
     <Menus/>
     </nav>
     </div>
        </>
    )
}

export default Header

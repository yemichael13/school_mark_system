import React from "react";

import "./Footer.css";

const Footer = () => {
    return(
        <footer className="footer">
            <p>
                <span>&copy; {new Date().getFullYear()} All Rights Reserved. </span>
                <span> Degnetu Academy. </span>
            
            </p>
    </footer>
    )
}

export default Footer;
import { useEffect, useState } from "react";
import './App.scss';
import logo from './logo.png';
import { useLocation, useNavigate } from "react-router-dom";
import { Donate } from 'react-kofi-overlay'
import ReactGA from "react-ga4";

function Header() {
    const navigate = useNavigate();
    const [opened, setOpened] = useState(false)
    const location = useLocation();
    console.log(location)
    return (
        <div className="header">
           <button onClick={() => navigate('/')} className="logo"><img src={logo}></img></button>
            <div className="right-buttons">
                {location.pathname !== '/' ? <button onClick={() => navigate('/')}>search</button> : undefined}
                <button>connect with your neighbors</button>
                <button onClick={() => {
                    ReactGA.event({
                        category: "navbar",
                        action: "button_click",
                        label: "learn your rights", // optional
                      });
                    window.open('https://www.oregonrentersrights.org/');
                }}>learn your rights</button>
                <Donate
                username="rateyourlandlordpdx"
                classNames={{
                donateBtn: 'donateBtn'
                }}
                onToggle={(opened) => {
                    ReactGA.event({
                        category: "navbar",
                        action: "button_click",
                        label: "donate", // optional
                      });
                    setOpened(opened)
                }}
            >
                ❤️ support us
            </Donate>
           </div>

        </div>
    )
}


export default Header;

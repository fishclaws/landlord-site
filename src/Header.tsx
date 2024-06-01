import { useEffect, useState } from "react";
import './App.scss';
import logo2 from './logo3.png';
import image_logo from './image_logo.png';
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
           <button onClick={() => navigate('/')} className="logo">
            {/* <img className="image_logo" src={image_logo}/> */}
            <img src={logo2}/>
            {location.pathname !== '/' ? 
                <button className="search-button-nav" onClick={() => navigate('/')}>search</button> : 
                <div className='headerContainer'>
                    {/* <img className='post' src="/images/post.png" alt="a post"></img> */}
                    <div className="name">
                    Rate Your Landlord PDX
                    </div>
                </div>}

            </button>
            <div className="right-buttons">
                <button onClick={() => navigate('/organize')} >👫 connect with your neighbors</button>
                <button onClick={() => {
                    ReactGA.event({
                        category: "navbar",
                        action: "button_click",
                        label: "learn your rights", // optional
                      });
                    window.open('https://www.oregonrentersrights.org/');
                }}>📜 learn your rights</button>
                <Donate
                username="rateyourlandlordpdx"
                classNames={{
                donateBtn: 'donateBtn'
                }}
                styles= {{
                    donateBtn: {
                    backgroundColor: 'transparent',
                    borderColor: '#3c4233',
                    borderStyle: 'solid',
                    borderWidth: '2px'
                    }
                }}
                onToggle={(opened) => {
                    ReactGA.event({
                        category: "navbar",
                        action: "button_click",
                        label: "donate", // optional
                      });
                    setOpened(opened)
                }}
            >💚 support us
            </Donate>
           </div>

        </div>
    )
}


export default Header;

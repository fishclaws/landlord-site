import { useState } from 'react';
import './App.scss';
import ReactGA from "react-ga4";

function Banner() {
    let [clicked, setClicked] = useState(false);
    return (
//         <div className='banner-wrapper'>
//             <button className='circle-button'>

// <svg viewBox="0 0 500 500" className='campaign'>
//     <path id="curve" d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97" />
//     <text width="500">
//       <textPath xlinkHref="#curve">
//         Stop Greedy Landlords
//       </textPath>
//     </text>
//   </svg></button>
//         </div>
        <div className='banner-wrapper'>
            {
            !clicked && <button className="banner" 
            onClick={() => {
                window.open('https://rentersactionnetwork.org/');
            }}>
            <span className='vote'> Join Renters Action Network</span>
            {/* <br/>
                <span className='for'> for Multonomah County Commissioner District 3</span> */}

            </button>
            }

        </div>
    )
}


export default Banner;

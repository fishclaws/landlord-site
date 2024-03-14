import { useEffect, useState } from "react";
import './App.scss';

function Disclaimer() {
    const [accepted, setAccepted] = useState(() => {
        return localStorage.getItem('accepted-disclaimer') === 'yes'
    });

    useEffect(() => {
        if (accepted) {
            localStorage.setItem('accepted-disclaimer', 'yes')

        }
    }, [accepted]);

    return (
        <div>
            { !accepted ?
            <div className="disclaimer-screen">
                <div className='disclaimer'>
                    <div className="disclaimer-title">Disclaimer</div>
                    <span className="">Please be advised that RateYourLandlordPDX does not warrant the accuracy of any data presented here. </span>
                    <span>As the data provided has been submitted by community members, and from sources like the Oregon Secretary of State, it has not been expressly verified and you agree to use it at your own risk. RateYourLandlordPDX shares the information in this system “as is” and makes no guarantees, representations or warranties of any kind, express or implied, arising by law or otherwise, including but not limited to, content, accuracy, completeness, timeliness, reliability, fitness for a particular purpose, usefulness, use or results to be obtained from this data, or that the data will be error-free. By using this tool, you agree that any use of, and reliance upon, the data will be at your sole discretion and risk, and you agree to take full responsibility therefor and shall not be hold RateYourLandlordPDX liable for losses caused by using this information.</span>
                    {/* <span>The information shown here is not verfied to be 100% correct.</span>
                    <span>Data is collected from PortlandMaps.com, the Oregon Secretary of State and Multonomah County Court Records</span> */}
                    <button className="got-it" onClick={() => setAccepted(true)}>understood</button>
                    {/* <button className="got-it" onClick={() => setAccepted(true)}>I agree to the above terms and conditions</button> */}
                </div>
            </div>
            : undefined
            }
        </div>
    )
}


export default Disclaimer;

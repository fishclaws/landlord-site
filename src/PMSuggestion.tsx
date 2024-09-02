import { useEffect, useState } from "react";
import { submitReport, submitSuggestion } from "./services";

function PMSuggestion({property_id, callback}: {property_id: string | undefined, callback: (done: boolean) => void}) {
    const [suggestedPM, setPM] = useState('')
    useEffect(() => {
        window.onpopstate = () => {
            if (callback)
                callback(false)
        }
    })

    function report() {
        const reportObj = {
            propertyId: property_id,
            data: suggestedPM,
            type: 'pm',
        }
        submitSuggestion(reportObj)
        callback(true)
    }

    return (
        <div className="report-screen">
            <div>
            <button className="close-btn" onClick={() => callback(false)}>×</button>
            <br/>
            <br/>

            <p>Please enter the name of the property manager you think should be connected to this property</p>
            
            <input 
                type="text" 
                value={suggestedPM}
                placeholder="..."
                onChange={(event) => setPM(event.target.value)}></input>
            
            <button disabled={suggestedPM.length === 0} onClick={() => report()}>submit</button>
            </div>
        </div>
    )
}

export default PMSuggestion;
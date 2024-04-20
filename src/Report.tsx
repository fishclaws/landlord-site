import { useEffect, useState } from "react";
import { submitReport } from "./services";

function ReportScreen({property_id, callback}: {property_id: string | undefined, callback: (done: boolean) => void}) {
    const [text, setText] = useState('')
    useEffect(() => {
        window.onpopstate = () => {
            if (callback)
                callback(false)
        }
    })

    function report() {
        const reportObj = {
            text,
            property_id,
            url: window.location.href
        }
        submitReport(reportObj)
        callback(true)
    }

    return (
        <div className="report-screen">
            <div>
            <button className="close-btn" onClick={() => callback(false)}>×</button>
            <h1>Is something incorrect?</h1>
            <p>We pull our data from public sources such as PortlandMaps.com & the Oregon Secretary of State</p>
            <p>If there's a problem please report it below</p>
            <textarea key="report-textarea" autoFocus={true} cols={40} rows={3} maxLength={250} 
                            onChange={(event) => {
                                setText(event.target.value)
                            }}></textarea>
            <span className='char-counter'>{text.length} / 250</span>
            <br/>
            <button disabled={text.length === 0} onClick={() => report()}>submit</button>
            </div>
        </div>
    )
}

export default ReportScreen;
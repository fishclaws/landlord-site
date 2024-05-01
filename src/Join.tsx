import { useState } from "react";
import { submitContact } from "./services";

function Join({text, property_id}: {text: string, property_id?: string}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [joined, setJoined] = useState(false)

    function submitMe(name: string, email: string) {
        submitContact({
            name, email, property_id
        })
    }

    return (
        <div className="org-join">
            {!joined ? <>
                <p>{text}</p>
                <br />
                <label className="small-text">(You don't have to use your real name)</label>
                <input
                    type="text"
                    value={name}
                    placeholder="Your Name"
                    onChange={event => {
                        setName(
                            event.target.value
                        );
                    }}
                ></input>
                <input type="email"
                    value={email}
                    placeholder="Email"
                    onChange={event => {
                        setEmail(
                            event.target.value
                        );
                    }}></input>
                <button onClick={() => {
                    setJoined(true)
                    submitMe(name, email)
                }}>add me!</button>
            </> :
                <>
                    <p>Thanks for Joining! We'll reach out soon once we start growing</p>
                </>
            }
        </div>
    )
}

export default Join
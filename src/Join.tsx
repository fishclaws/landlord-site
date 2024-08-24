import { useState } from "react";
import { submitContact } from "./services";

function Join({addSkills, text, property_id, title, onJoin}: {addSkills?: string[], text: string, property_id?: string, title?: string, onJoin?: () => void}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [joined, setJoined] = useState(false)

    function submitMe(name: string, email: string, addSkills?: string[]) {
        submitContact({
            name, email, property_id, skills: addSkills
        })
    }

    return (
        <div className="org-join">
            {!joined ? <>
                {title && <h3>{title}</h3>}
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
                    submitMe(name, email, addSkills)
                    if (onJoin) {
                        onJoin()
                    }
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
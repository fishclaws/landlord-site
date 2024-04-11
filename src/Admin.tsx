import axios from "axios";
import "./App.scss";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { admin, determine } from "./services";
import { useEffect, useState } from "react";

function Admin() {

    const [password, setPassword] = useState('')
    const [content, setContent] = useState([])
    const [history, setHistory] = useState([] as any)

    useEffect(() => {
        setHistory(content.map(c => ''))
    }, [content])

    return (
    <div className="admin">
            <h1>Welcome</h1>
            <input
                placeholder="password"
                value={password}
                type='text'
                onChange={event => {
                setPassword(
                    event.target.value
                );
                }}>
            </input>
            <button onClick={() => {
                admin(password).then(data => setContent(data))
            }}>Get Content</button>
            <table className="approval-table">
                <tbody>
            {
                
                content.map((c: any, i: number) => 
                    <tr className={history[i]}>
                        <td>{c.content}</td>
                        <td><button
                            disabled={history[i]} 
                            onClick={() => {
                            determine(password, c.review_id, true)
                            const copy = {
                                ...history,
                            }
                            copy[i] = 'approved'
                            setHistory(copy)
                        }}>approve</button></td>
                        <td><button 
                                                    disabled={history[i]} 
                                                    onClick={() => {
                            determine(password, c.review_id, false)
                            const copy = {
                                ...history,
                            }
                            copy[i] = 'rejected'
                            setHistory(copy)
                        }
                        }>reject</button></td>
                    </tr>)
            }
            </tbody>
            </table>
    </div>
    );
}

export default Admin;
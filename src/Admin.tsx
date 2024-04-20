import axios from "axios";
import "./App.scss";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { admin, determine, resolveReport } from "./services";
import { useEffect, useState } from "react";

function Admin() {

    const [password, setPassword] = useState('')
    const [content, setContent] = useState([])
    const [reports, setReports] = useState([])
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
                admin(password).then(data => {
                    setContent(data.content);
                    setReports(data.reports);
            })
            }}>Get Content</button>
            <table className="approval-table">
                <tbody>
            {
                
                content.map((c: any, i: number) => 
                    <tr className={history[i]}>
                        <td>
                            <p>{c.content}</p>
                            <div className="admin-buttons">
                                <button
                                    className="approved"
                                    disabled={history[i]} 
                                    onClick={() => {
                                    determine(password, c.review_id, 'yes')
                                    const copy = {
                                        ...history,
                                    }
                                    copy[i] = 'approved'
                                    setHistory(copy)
                                }}>approve</button>
                                <button 
                                    className="rejected"
                                    disabled={history[i]} 
                                    onClick={() => {
                                    determine(password, c.review_id, 'no')
                                    const copy = {
                                        ...history,
                                    }
                                    copy[i] = 'rejected'
                                    setHistory(copy)
                                }
                                }>reject</button>
                                <button
                                    className="praise"
                                    disabled={history[i]} 
                                    onClick={() => {
                                    determine(password, c.review_id, 'praise')
                                    const copy = {
                                        ...history,
                                    }
                                    copy[i] = 'praise'
                                    setHistory(copy)
                                }}>mark as praise</button>
                            </div>
                        </td>
                    </tr>)
            }
            </tbody>
            </table>
            <br/>
            <table className="reports-table">
                <tbody>
            {
                
                reports.map((report: any, i: number) => 
                    <tr>
                        <td>
                            <p>TEXT: {report.text}</p>
                            <br/>
                            <p>URL: {report.url}</p>
                            <br/>
                            <p>PROPERTY_ID: {report.property_id}</p>
                            <div className="admin-buttons">
                                <button
                                    className="approved"
                                    onClick={() => {
                                        resolveReport(password, report.id)
                                        setReports([...reports].filter((r: any) => r.id !== report.id))

                                }}>mark resolved</button>
                            </div>
                        </td>
                    </tr>)
            }
            </tbody>
            </table>
    </div>
    );
}

export default Admin;
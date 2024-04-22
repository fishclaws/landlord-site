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
    const [contacts, setContacts] = useState([] as any[])
    const [reviewCount, setReviewCount] = useState(0)

    useEffect(() => {
        setHistory(content.map(c => ''))
    }, [content])

    return (
    <div className="admin">
            <h1 >Welcome</h1>
            <input
                className="pass"
                placeholder="password"
                value={password}
                type='text'
                onChange={event => {
                setPassword(
                    event.target.value
                );
                }}>
            </input>
            <div className="get-content" >
                <button
                    
                    onClick={() => {
                    admin(password).then(data => {
                        setContent(data.content);
                        setReports(data.reports);
                        setContacts(data.contacts);
                        setReviewCount(data.reviewCount);
                })
                }}>Get Content</button>
            </div>
            <h3  className="contact-list">submitted reviews</h3>
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
            <h3  className="contact-list">reports</h3>
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

            <div className="contact-list">
                <h3>contacts</h3>
                {
                    contacts.map(contact =>
                        <div>
                            <div>{contact.name}</div>
                            <div>{contact.email}</div>
                        </div>
                    )
                }
            </div>

            <h3  className="contact-list">review count: {reviewCount}</h3>
    </div>
    );
}

export default Admin;
import axios from "axios";
import "./App.scss";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { admin, determine, resolveReport } from "./services";
import { useEffect, useState } from "react";
import flag from "./flag.png"

function Admin() {

    const [password, setPassword] = useState('')
    const [content, setContent] = useState([])
    const [reports, setReports] = useState([])
    const [history, setHistory] = useState([] as any)
    const [contacts, setContacts] = useState([] as any[])
    const [reviewCount, setReviewCount] = useState(0)
    const [expanded, setExpanded] = useState([] as boolean[])

    useEffect(() => {
        setHistory(content.map(c => ''))
    }, [content])

    function hasDeletedReview(c: any) {
        return c.json.reviews.find((r: any) => r && r.deleted)
    }

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
                    contacts.map((c, i) =>
                        <div>
                            {(c.flagged || hasDeletedReview(c)) && <img src={flag}></img>}
                            <div>{c.json.contact.name}</div>
                            <div>{c.json.contact.email}</div>
                            {
                                c.json.reviews.filter((r: any) => r).length !== 0 && <button
                                onClick={
                                    () => {
                                        const e = [...expanded]
                                        e[i] = !e[i]
                                        setExpanded(e)
                                    }
                                }
                            >reviews left {c.json.reviews.filter((r: any) => r).length}</button>
                            }
                            {
                                expanded[i] && c.json.reviews
                                    .filter((r: any) => r)
                                    .map((r: any) => 
                                    <div className="contact-review">
                                        {r.deleted && 
                                            <div>
                                                <img src={flag}></img>
                                                DELETED
                                            </div>}
                                        <a href={`/address/${r.address}`}>link</a>
                                        <br/>
                                        {r.review_text && <span>comment: {r.review_text}</span>}
                                        
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>

            <h3  className="contact-list">review count: {reviewCount}</h3>
    </div>
    );
}

export default Admin;
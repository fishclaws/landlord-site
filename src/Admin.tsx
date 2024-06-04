import axios from "axios";
import "./App.scss";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { admin, getAllUsers, determine, login, resolveReport, updateUser, createUser, deleteUser } from "./services";
import { useEffect, useState } from "react";
import flag from "./flag.png"
import { useStore } from "./hooks/useStore";
import { CreateUser, User, newUserObj } from "./UserType";

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

function Admin() {
    const { authData, setAuthData } = useStore() as any;

    const [loggedIn, setLoggedIn] = useState(false)

    // const [password, setPassword] = useState('')
    const [content, setContent] = useState([])
    const [reports, setReports] = useState([])
    const [history, setHistory] = useState([] as any)
    const [contacts, setContacts] = useState([] as any[])
    const [groupBys, setGroupBys] = useState([] as any[])
    const [reviewCount, setReviewCount] = useState(0)
    const [expanded, setExpanded] = useState([] as boolean[])
    const [unAuthorized, setUnauthorized] = useState(false)
    const [users, setUsers] = useState([] as User[])
    const [newUser, setNewUser] = useState(newUserObj())
    const [addNewUser, setAddNewUser] = useState(false)
    const [dataPulled, setDataPulled] = useState(false)

    useEffect(() => {
        // Check if we're already logged in
        if (authData && authData.jwt) {
            const jwt = authData.jwt.access_token
            if (jwt) {
                const decoded = parseJwt(jwt)

                if (decoded.exp * 1000 >= Date.now()) {
                    setLoggedIn(true)
                    getUserList()
                }
            }
        }

    }, [])

    useEffect(() => {
        if (content) {
            setHistory(content.map(c => ''))
        }
    }, [content])

    useEffect(() => {
        getUserList()
    }, [authData])


    function logout() {
        googleLogout();
        localStorage.removeItem("authData");
        setAuthData(null);
        window.location.reload();
    }


    function hasDeletedReview(c: any) {
        return c.json.reviews.find((r: any) => r && r.deleted)
    }

    function getContent() {
        admin(authData.jwt.access_token).then(data => {
            setContent(data.content);
            setReports(data.reports);
            setContacts(data.contacts);
            setReviewCount(data.reviewCount);
            setGroupBys(data.reviewGroupBys)
            setDataPulled(true)
        })
    }

    function getUserList() {
        if (authData && authData.data.super_user) {
            getAllUsers(authData.jwt.access_token)
                .then(users => {
                    if (Array.isArray(users)) {
                        setUsers(users)
                    } else {
                        console.log(`users is not an array ${users && JSON.stringify(users)}`)
                    }
                })
        }
    }

    function userSection(u: User, attribute: keyof User) {
        return (
            <div className="input">
            <label htmlFor={`${attribute}_${u.id}`}>{attribute}</label>
            <input 
                id={`${attribute}_${u.id}`} 
                type="checkbox"
                checked={u[attribute] == true}
                disabled={u.id === authData.data.id && attribute === 'super_user'}
                onChange={() => {
                    (u as any)[attribute] = !u[attribute]
                    updateUser(authData.jwt.access_token, u)
                    if (u.id === authData.data.id) {
                        authData.data[attribute] = u[attribute]
                        setAuthData(authData)
                    }
                    setUsers([...users])
                }}></input>
            </div>
        )
    }

    function newUserTextSection(u: CreateUser, attribute: keyof CreateUser) {
        return (
            <div className="input">
                <label htmlFor={`${attribute}_new`}>{attribute} </label>
                <input
                    id={`${attribute}_new`}
                    type="email"
                    className="email-input"
                    value={u.email}
                    onChange={(event) => {
                        (u as any)[attribute] = event.target.value
                        setNewUser({...u})
                    } }></input>
            </div>
        )
    }

    function newUserSection(u: CreateUser, attribute: keyof CreateUser) {
        return (
            <div className="input">
                <label htmlFor={`${attribute}_new`}>{attribute}</label>
                <input
                    id={`${attribute}_new`}
                    type="checkbox"
                    checked={u[attribute] == true}
                    onChange={() => {
                        (u as any)[attribute] = !u[attribute];
                        setNewUser({...u})
                    } }></input>
            </div>
        )
    }

    function copyEmailsToClipboard() {
        if (contacts) {
            let emails = ''
            for (const c of contacts) {
                if (!(c.flagged || hasDeletedReview(c))) {
                    emails += `${c.json.contact.email}, `
                }
            }
            navigator.clipboard.writeText(emails);
        }
    }

    return (
        <div className="admin">

            <h1 >Welcome</h1>
            {unAuthorized && (
                <div className="auth-status">This email is unauthorized</div>
            )}
            {!loggedIn &&
                <div className="google-login">
                <GoogleOAuthProvider clientId="371942184882-eam71m05ve89gdf488q1g5jnqp53usnv.apps.googleusercontent.com">
                    <GoogleLogin
                        useOneTap={true}
                        onSuccess={async (credentialResponse) => {
                            console.log(credentialResponse);
                            const result = await login(credentialResponse.credential!)
                            if (result.statusCode === 401) {
                                setUnauthorized(true)
                                googleLogout();
                            } else {
                                try {
                                    if (result.message === 'success') {
                                        localStorage.setItem("authData", JSON.stringify(result));
                                        setAuthData(result);
                                        setLoggedIn(true)
                                        setUnauthorized(false)
                                    }
                                } catch(error) {
                                    setUnauthorized(true)
                                    googleLogout();
                                }
                            }
                        }}
                        onError={() => {
                            console.log("Login Failed");
                        }}
                    />
                </GoogleOAuthProvider>
                </div>
            }
            {loggedIn && (
                <>
                    { authData &&
                    <div className="auth-status">logged in as {authData.data.email}</div>
                    }
                    <div className="logout-button">
                    <button
                        onClick={logout}
                        
                    >
                        Logout
                    </button>
                    </div>

                    {
                        authData && authData.data.super_user && users && (
                        <div className="super-user">
                            <div className="user-list">
                                {
                                    users && users.map(u => (
                                        <div className="user">
                                            <p>user id: <span>{u.id}</span></p>
                                            <p>email: <span>{u.email}</span></p>
                                            {userSection(u, 'super_user')}
                                            {userSection(u, 'can_approve_reviews')}
                                            {userSection(u, 'deactivated')}
                                            {
                                                u.id !== authData.data.id &&
                                                u.deactivated &&
                                                <button
                                                    className="delete"  
                                                    onClick={() => {
                                                    deleteUser(authData.jwt.access_token, u.id)
                                                        .then((users) => {
                                                            setUsers(users)
                                                        })
                                                }}>delete</button>
                                            }
                                        </div>
                                    ))
                                }
                                { !addNewUser ?
                                    <button onClick={() => setAddNewUser(true)}>Add new user</button>
                                    :
                                    (
                                        <div className="user">
                                            {newUserTextSection(newUser, 'email')}
                                            {newUserSection(newUser, 'super_user')}
                                            {newUserSection(newUser, 'can_approve_reviews')}
                                            {newUserSection(newUser, 'deactivated')}
                                            <button
                                                className="add" 
                                                onClick={() => {
                                                createUser(authData.jwt.access_token, newUser)
                                                    .then(users => {
                                                        setUsers(users)
                                                        setNewUser(newUserObj())
                                                        setAddNewUser(false)
                                                    })
                                            }}>add</button>
                                        </div>
                                        
                                    )                                
                            }
                            </div>
                        </div>
                        )
                    }

                    <div className="get-content" >
                        <button

                            onClick={getContent}>Get Data</button>
                    </div>
                    {
                        dataPulled && <div>
                        <h3 className="contact-list">review count: {reviewCount}</h3>
                        <br/>
                        { content && content.length > 0 &&
                        <><h3 className="contact-list">reviews pending approval:</h3><table className="approval-table">
                                    <tbody>
                                        {content && content.map((c: any, i: number) => <tr className={history[i]}>
                                            <td>
                                                <p>{c.content}</p>
                                                {authData && authData.data.can_approve_reviews &&
                                                    <div className="admin-buttons">
                                                        <button
                                                            className="approved"
                                                            disabled={history[i]}
                                                            onClick={() => {
                                                                determine(authData.jwt.access_token, c.review_id, 'yes');
                                                                const copy = {
                                                                    ...history,
                                                                };
                                                                copy[i] = 'approved';
                                                                setHistory(copy);
                                                            } }>approve</button>
                                                        <button
                                                            className="rejected"
                                                            disabled={history[i]}
                                                            onClick={() => {
                                                                determine(authData.jwt.access_token, c.review_id, 'no');
                                                                const copy = {
                                                                    ...history,
                                                                };
                                                                copy[i] = 'rejected';
                                                                setHistory(copy);
                                                            } }>reject</button>
                                                        <button
                                                            className="praise"
                                                            disabled={history[i]}
                                                            onClick={() => {
                                                                determine(authData.jwt.access_token, c.review_id, 'praise');
                                                                const copy = {
                                                                    ...history,
                                                                };
                                                                copy[i] = 'praise';
                                                                setHistory(copy);
                                                            } }>mark as praise</button>
                                                    </div>}
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table></>
                        }
                        <br />
                        <h3 className="contact-list">reports</h3>
                        <table className="reports-table">
                            <tbody>
                                {

                                    reports && reports.map((report: any, i: number) =>
                                        <tr>
                                            <td>
                                                <p>TEXT: {report.text}</p>
                                                <br />
                                                <p>URL: {report.url}</p>
                                                <br />
                                                <p>PROPERTY_ID: {report.property_id}</p>
                                                {
                                                authData && authData.data.can_approve_reviews &&
                                                <div className="admin-buttons">
                                                    <button
                                                        className="approved"
                                                        onClick={() => {
                                                            resolveReport(authData.jwt.access_token, report.id)
                                                            setReports([...reports].filter((r: any) => r.id !== report.id))

                                                        }}>mark resolved</button>
                                                </div>
                                            }
                                            </td>
                                        </tr>)
                                }
                            </tbody>
                        </table>
                        <div className="multiple-reviews">
                        <h3 className="contact-list">multiple reviews per address</h3>
                        <div className="groups">
                            {
                                groupBys && groupBys.length && groupBys[0].filter((g: any) => g.c > 1).map((g: any) => (
                                    <div>
                                        <p><span>{g.c}</span> reviews for {g.address} <a href={`/address/${g.address}`}>link</a></p>
                                        
                                    </div>
                                ))
                            }
                        </div>
                        <h3 className="contact-list">multiple reviews per business</h3>
                        <div className="groups">
                            {
                                groupBys && groupBys.length && groupBys[1].filter((g: any) => g.c > 1).map((g: any) => (
                                    <div>
                                        <p><span>{g.c}</span> reviews for {g.name} <a href={`/search/${g.name}`}>link</a></p>
                                        
                                    </div>
                                ))
                            }
                        </div>
                        <h3 className="contact-list">multiple reviews per "property owner"</h3>
                        <div className="groups">
                            {
                                groupBys && groupBys.length && groupBys[3].filter((g: any) => g.c > 1).map((g: any) => (
                                    <div>
                                        <p><span>{g.c}</span> reviews for {g.name}</p>
                                        
                                    </div>
                                ))
                            }
                        </div>
                        </div>

                        <div className="contact-list">
                            <h3>contacts <button 
                                className="copy-to-clip"
                                onClick={copyEmailsToClipboard}>copy emails to clipboard</button></h3>
                            {
                                contacts && contacts.map((c, i) =>
                                    <div>
                                        {(c.flagged || hasDeletedReview(c)) && <img src={flag}></img>}
                                        <div>{c.json.contact.name}</div>
                                        <div>{c.json.contact.email}</div>
                                        <div className="added-on">added on {c.json.contact.date_added}</div>
                                        {
                                            c.json.reviews.filter((r: any) => r).length !== 0 && <button
                                                onClick={
                                                    () => {
                                                        const e = [...expanded]
                                                        e[i] = !e[i]
                                                        setExpanded(e)
                                                    }
                                                }
                                            >left {c.json.reviews.filter((r: any) => r).length} reviews</button>
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
                                                        <br />
                                                        {r.review_text && <span>comment: {r.review_text}</span>}
                                                            
                                                    </div>
                                                )
                                        }
                                        {
                                            expanded[i] && c.json.rejected &&
                                            c.json.rejected.length > 0 &&
                                            <div>Rejected: </div>
                                        }
                                        {
                                            expanded[i] && c.json.rejected
                                                .filter((r: any) => r)
                                                .map((r: string) => (
                                                    <div className="contact-review"><span>{r}</span></div>
                                                ))

                                        }
                                    </div>
                                )
                            }
                        </div>

                    </div>
                    }
                </>

            )}
        </div>
    );
}

export default Admin;
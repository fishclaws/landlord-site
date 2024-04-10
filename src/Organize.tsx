import { useEffect, useRef, useState } from "react";
import { submitContact } from "./services";

interface Section {
    id: number;
    title: string;
    desc: string;
    question?: string;
    bullets?: string[];
    additional?: string;
    answers?: { reply: string, next: number }[],
    join?: string;
}

const sections: Section[] = [
    {
        id: 0,
        title: 'Do you know your neighbors?',
        desc: `Before you get started, you should have an idea of how many homes are in your building or property. Make a list of each apartment, and write down the name of any neighbors you already know. If you have contact info for them, like a phone number, write that down too.`,
        question: `Do you already know any of your neighbors, and have a way to contact them?`,
        answers: [
            { reply: 'yes', next: 2 },
            { reply: 'no', next: 1 }]
    },
    {
        id: 1,
        title: 'Recruit a few allies',
        desc: `Approaching your neighbors for the first time can feel intimidating, but it doesn't have to be! If you have a sense of who might be friendly, focus on them first. Your goal is to get 1-3 initial allies in the building that will help you reach the rest of your neighbors.`,
        bullets: [
            'Say hi to a neighbor you see out and about around the building',
            'Offer to help neighbors if you see someone struggling with something',
            'If you feel comfortable, knock on doors, ask if they\'re interested in coming together as a building'
        ],
        answers: [
            { reply: 'Ok, what next?', next: 2 }
        ]
    },
    {
        id: 2,
        title: 'Let\'s Organize',
        desc: `Once you know some of your neighbors, and have their phone numbers, start a group chat or other way to communicate. You may want to use an encrypted app like Signal for privacy. Together, decide who wants to be organizers for the group. These individuals will help coordinate meetings, communicate with members, and represent the group in negotiations with the landlord.`,
        answers: [
            { reply: 'Ok, what next?', next: 3 }
        ]
    },
    {
        id: 3,
        title: 'Document & Plan',
        desc: `Based on your goals, create a plan of action. This might involve drafting a list of demands, gathering signatures on a petition, or scheduling a meeting with the landlord to discuss tenant concerns.`,
        additional: `We’ve seen success with tenants writing and cosigning a letter that lays out a timeline of all of their grievances, then lists their demands and a deadline for management to meet their request. It then lays out what actions the tenants will take if the requests are not met: like publicizing the problems at the building, leaving negative reviews, or pursuing legal action where appropriate.`,
        answers: [
            { reply: 'Ok, what next?', next: 4 }
        ]
    },
    {
        id: 4,
        title: 'Let\'s Talk',
        desc: `Arrange a meeting with the landlord or property management to discuss the tenant union's concerns and proposed solutions. Be prepared to negotiate and advocate for your rights as a group.`,
        additional: `If you wrote a letter, send it to your landlord or management electronically, or otherwise with a method of mail that allows you to document that it was sent and delivered. You may also want to print out the letter and hand deliver it to management.`,
        answers: [
            { reply: 'Ok, what next?', next: 5 }
        ]
    },
    {
        id: 5,
        title: 'Keep it Rolling',
        desc: `Keep the momentum going by holding regular meetings, following up with the landlord on agreed-upon actions, and supporting each other through any challenges that arise. Remember that change may take time, but by staying organized and persistent, you can make a difference in your building.`,
        join: 'Join the Portland Metro Tenant Union! Together we can build renter power in this city.',
    }

]

function SectionComponent({ index, sect, addSection, submitMe }: { index: number, sect: Section, addSection: (id: number) => void, submitMe: (name: string, email: string) => void }) {
    const ref: any = useRef();

    const [answerStatuses, setStatuses] = useState(sect.answers?.map(a => 'unselected'))
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [joined, setJoined] = useState(false)

    useEffect(() => {
        if (ref.current) {
            setTimeout(() =>
                (ref.current as any).scrollIntoView({ behavior: "smooth", block: "nearest", inline: 'start' }),
                100);
            
        }
    }, []);

    return (
        <>
            {index !== 0 && <div className="downArrow">↯</div>}
            <div className="org-section" ref={ref}>
                <div className="org-title">{sect.title}</div>
                <p className="org-desc">{sect.desc}</p>
                {sect.bullets && <div className="org-bullets">
                    {sect.bullets.map(b => <div className="org-bullet">{b}</div>)}
                </div>}
                <p className="org-add">{sect.additional}</p>
                <p className="org-question">{sect.question}</p>
                {sect.answers &&
                    <div className="org-answers">
                        {sect.answers.map((a, i) => <button
                            className={answerStatuses![i]}
                            disabled={answerStatuses![i] === 'disabled'}
                            onClick={(e) => {
                                for (let j = 0; j < sect.answers!.length; j++) {
                                    answerStatuses![j] = 'disabled';
                                }
                                answerStatuses![i] = 'selected';
                                setStatuses(answerStatuses);
                                e.preventDefault();
                                addSection(a.next);
                            }}>{a.reply}</button>)}
                    </div>}
                {sect.join &&
                    <div className="org-join">
                        {!joined ? <>
                            <p>{sect.join}</p>
                            <br/>
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
                    </div>}
            </div></>
    );
}

function Organize() {


    const [flow, setFlow] = useState([sections.find(s => s.id === 0)] as Section[])

    function addSection(id: number) {
        const section = sections.find(s => s.id === id)!;
        if (!flow.find(f => f.id === section.id))
            setFlow([...flow, section])
    }

    function submitMe(name: string, email: string) {
        submitContact({
            name, email
        })
    }

    return (
        <div className="organize-wrapper">

            {
                flow.map((sect, i) =>
                    <SectionComponent index={i} sect={sect} addSection={addSection} submitMe={submitMe}/>
                )
            }
        </div>
    );
}

export default Organize;
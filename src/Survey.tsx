'use client'
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';

interface Question {
    text: string,
    answers?: Array<string>
}

function Survey() {
    const [questions]: [Question[], any] = useState([
        {
            text: 'How much has your rent gone up in the past year?',
            answers: [
                'None',
                'Less than a $100',
                'Between $100 and $300',
                'More than a $300'
            ]
        },
        {
            text: 'Does your Landlord respond to maintenance requests?',
            answers: [
                'Never',
                'Sometimes',
                'Always',
            ]
        },
        {
            text: 'Is your landlord unprofessional or creepy?',
            answers: [
                'Never',
                'Sometimes',
                'Always',
            ]
        },
        {
            text: 'Does your building have untreated mold or other biohazards?',
            answers: [
                'Yes',
                'No',
                'Unsure'
            ]
        },
        {
            text: 'Has your landlord attempted to evict you?',
            answers: [
                'Yes',
                'No'
            ]
        },
        {
            text: 'Is your building unlivable?',
            answers: [
                'Yes',
                'Sometimes',
                'No'
            ]
        }, 
        {
            text: 'What do you want people to know about your landlord?',
        }
    ]);
    return (

        <div className='survey-container'>
            <h3>Feedback</h3>
            {
                questions.map(q => (
                    <div className='question'>
                        {q.text}
                        <br/>
                        {q.answers ? 
                            (<div className='answers'>
                                {
                                    q.answers?.map(a => (
                                        <button className='answer'>{a}</button>
                                    ))
                                }
                            </div>) : 
                            <textarea name="Text1" cols={40} rows={5}></textarea>
                        }
                    </div>
                ))
            }
        </div>
    );
}

export default Survey;

'use client'
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { submitResponse } from './services'

interface Question {
    text: string,
    answers?: Array<string>
}

const qs = [
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
    }
]

type Landlord = { name: string; origin: string; }

function Survey(
    {
        landlordList, 
        hideSurvey, 
        address, 
        propertyId
    }: {
        landlordList: Landlord[], 
        hideSurvey: () => void, 
        address: string, 
        propertyId: string
    }) {

    const [questions]: [Question[], any] = useState(qs);
    const [answersSelected, setAnswersSelected] = useState(questions.map(q => null) as (number | null)[]);
    // const [selectedLandlords, setSelectedLandlords] = useState(landlordList.length === 1 ? landlordList : [])
    const [reviewText, setReviewText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const maxLength = 0

    function submit() {
        setIsLoading(true)
        submitResponse({
            answersSelected,
            landlordList,
            reviewText,
            address,
            propertyId
        })
    }

    return (

        <div>
            <h3 className='survey-title'>Rate Your Landlord</h3>
            {/* { landlordList.length === 1 ? undefined :
            <div className='landlord-options'>
                <div className='question checkbox-wrapper'>Which person/business do you want to rate?
                    <label className='checkbox-line  all-of-them' htmlFor='all'>ALL OF THEM
                        <input className='checkbox' type="checkbox" id='all' name='all' 
                        onChange={(e) => {
                            if (e.target.checked) {
                                const newList = [...landlordList]
                                setSelectedLandlords(newList)
                            }
                        }}/>
                        <span className="checkmark"></span>
                    </label>
                {
                    landlordList.map((landlord, index) =>
                        <label className='checkbox-line' htmlFor={landlord.name}>{landlord.name}
                            <input className='checkbox' type="checkbox" 
                                id={landlord.name} 
                                name={landlord.name}
                                onChange={(e) => {
                                    let newList = [...selectedLandlords]
                                    if (e.target.checked) {
                                        newList.push(landlord)
                                    } else {
                                        newList = newList.filter(l => l.name !== landlord.name)
                                    }
                                    setSelectedLandlords(newList)
                                }}
                                checked={selectedLandlords.find(l => l.name === landlord.name) !== undefined} />
                            <span className="checkmark"></span>
                        </label>
                    )
                }
                </div>
            </div>
            } */}
            {
                questions.map((q, questionIndex) => (
                    <div className='question'>
                        {q.text}
                        <br/>
                        {q.answers ? 
                            (<div className={'answers'}>
                                {
                                    q.answers?.map((a, answerIndex) => (
                                        <button 
                                        className={'answer' + (answersSelected[questionIndex] === answerIndex ? ' active' : '')} 
                                        onFocus={() => {
                                            const ans = [...answersSelected]
                                            ans[questionIndex] = answerIndex
                                            console.log(ans)
                                            setAnswersSelected(ans)
                                        }}>{a}</button>
                                    ))
                                }
                            </div>) : undefined
                        }
                    </div>
                ))
            }
            <div className='question'>
                What else do you want people to know about this landlord?
                <textarea name="Text1" cols={40} rows={5} maxLength={250} 
                            onChange={(event) => {
                                setReviewText(event.target.textContent!)
                            }}></textarea>
            </div>
            <div className='submit-button-wrapper'>
                <button className={'submit-button' + isLoading ? ' button--loading' : ''} 
                    disabled={answersSelected.includes(null) || isLoading}
                    onClick={() => {
                        submit()
                    }}><span className="button__text">SUBMIT</span></button>
            </div>
        </div>
    );
}

export default Survey;

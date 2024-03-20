'use client'
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { submitResponse } from './services'
import { Landlord, Question, qs } from './SurveyQuestions';


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
            <h3 className='survey-title'>rate this landlord</h3>
            {
                questions.map((q, questionIndex) => (
                    <div className='question'>
                        <p>{q.text}</p>
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
                <p>What else do you want people to know about this landlord?</p>
                <textarea name="Text1" cols={40} rows={5} maxLength={250} 
                            onChange={(event) => {
                                setReviewText(event.target.value)
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

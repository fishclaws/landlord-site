'use client'
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { submitResponse } from './services'
import { Landlord, QUESTION_SET, Question, qs } from './SurveyQuestions';


function Survey(
    {
        landlordList, 
        hideSurvey, 
        address, 
        propertyId
    }: {
        landlordList: Landlord[], 
        hideSurvey: (showJoin: boolean) => void, 
        address: string, 
        propertyId: string
    }) {

    const [questions]: [Question[], any] = useState(qs);
    const [answersSelected, setAnswersSelected] = useState({} as { [key: number]: number});
    // const [selectedLandlords, setSelectedLandlords] = useState(landlordList.length === 1 ? landlordList : [])
    const [reviewText, setReviewText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const maxLength = 0

    function submit() {
        setIsLoading(true)

        let showJoin = false

        const answers = Object.keys(answersSelected).reduce((agg, curr) => {
            const questionId = Number(curr)
            agg[questionId] = answersSelected[questionId]
            return agg;
        }, [] as number[])

        const answer = answers[qs.findIndex(q => q.tenantUnion)]
        if (answer === 0 || answer === 2) {
            showJoin = true
        }

        submitResponse({
            QUESTION_SET,
            answersSelected: answers,
            landlordList,
            reviewText,
            address,
            propertyId
        }).then((result) => {
            console.log(result)
            setIsLoading(false)
            hideSurvey(showJoin)
        })
    }

    return (

        <div>
            <h3 className='survey-title'>rate this landlord</h3>
            {
                questions.map((q, questionIndex) => (
                    <div className='question'>
                        <p>{q.emoji} {q.text}</p>
                        <br/>
                        {q.answers ? 
                            (<div className={'answers'}>
                                {
                                    q.answers?.map((a, answerIndex) => (
                                        <button 
                                        className={'answer' + (answersSelected[questionIndex] === answerIndex ? ' active' : '')} 
                                        onClick={() => {
                                            const ans = { ...answersSelected}
                                            if (ans[questionIndex] === answerIndex) {
                                                delete ans[questionIndex];
                                            } else {
                                                ans[questionIndex] = answerIndex
                                            }
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
                            }}>
                                
                            </textarea><span className='char-counter'>{reviewText.length} / 250</span>
            </div>
            <div className='submit-button-wrapper'>
                <button className={'submit-button' + (isLoading ? ' button--loading' : '')} 
                    disabled={(Object.keys(answersSelected).length === 0 && reviewText === '') || isLoading}
                    onClick={() => {
                        submit()
                    }}><span className="button__text">SUBMIT</span></button>
            </div>
        </div>
    );
}

export default Survey;

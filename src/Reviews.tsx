import { useEffect, useState } from "react"
import { Review } from "./ResultTypes"
import { qs, selectionQuestions } from "./SurveyQuestions"
import './App.scss';
import Twemoji from 'react-twemoji';

interface Aggregate {
    question: string;
    emoji: string,
    answers: {
        text: string,
        count: number
    }[]
}

function Reviews({ property_reviews, other_reviews, onOpen, scrollToReviews }: { property_reviews: Review[], other_reviews: Review[] | null, onOpen: any, scrollToReviews: any }) {

    const [propertyAgg, setPropertyAgg]: [Aggregate[], any] = useState([])
    const [otherAgg, setOtherAgg]: [Aggregate[], any] = useState([])
    const [propertyComments, setPropertyComments]: [string[], any] = useState([])
    const [otherComments, setOtherComments]: [string[], any] = useState([])
    const [selected, setSelected] = useState('this')
    const [propertyItemized, setPropertyItemized] = useState([] as any[])
    const [otherItemized, setOtherItemized] = useState([] as any[])

    useEffect(() => {
        if (property_reviews) {
            setPropertyAgg(getStatements(property_reviews))
            setPropertyComments(property_reviews.filter(rev => rev.review_text).map(rev => rev.review_text.trim()).filter(rev => rev.length))
            setPropertyItemized(getItemized(property_reviews))
        }
        if (other_reviews) {
            let or = other_reviews
            if (property_reviews)
                or = or.filter(rev => !property_reviews.find(pr => pr.id === rev.id))
            setOtherAgg(getStatements(or))
            setOtherComments(or.filter(rev => rev.review_text).map(rev => rev.review_text.trim()).filter(rev => rev.length))
            setOtherItemized(getItemized(or))
        }
    }, [])


    useEffect(() => {
        if (anyPropertyReviewsExist()) {
            setSelected('this')
        } else {
            setSelected('other')
        }
    }, [propertyItemized, propertyAgg, propertyComments])

    function getCount(index: number, arr: Review[], answerOfNote: number) {
        return arr.reduce((total, rev) => {
            if (rev.selected_answers[index] === answerOfNote) {
                total += 1
            }
            return total
        }, 0)
    }

    function getStatements(arr: Review[]): Aggregate[] {
        return qs.map((q, index) => (
            {
                question: q.text,
                emoji: q.emoji,
                answers: q.answersOfNote
                    .map(answerOfNote => {
                        let count = getCount(index, arr, answerOfNote)
                        return {
                            text: q.answers[answerOfNote],
                            count
                        }
                    })
                    .filter(result => result.count !== 0 && result.text)
            }
        )).filter(agg => agg.answers.length > 0)

    }

    function getItemized(arr: Review[]) {
        const result: number[] = []
        for (let rev of arr) {
            for (let i = qs.length; i < qs.length + selectionQuestions.questions.length; i++) {
                const review = rev.selected_answers[i]
                if (review === 1) {
                    if (!result[i - qs.length]) {
                        result[i - qs.length] = 1
                    } else {
                        result[i - qs.length]++
                    }
                }
            }
        }
        return result
    }

    function anyPropertyReviewsExist() {
        return propertyItemized.length + propertyAgg.length + propertyComments.length > 0
    }

    return (
        <div>
            {
            anyPropertyReviewsExist() ?
                <div className="reviews-title">
                    {
                    
                    <button
                        className={'review-type-bttn ' + (selected === 'this' ? 'selected' : '')}
                        onClick={() => { setSelected('this'); onOpen.func() }}>reviews for this address</button>
                    }
                    {
                    
                    <button
                        className={'review-type-bttn ' + (selected === 'other' ? 'selected' : '')}
                        onClick={() => { setSelected('other'); onOpen.func() }}>reviews for other addresses</button>
                    }
                </div>
                :
                <div className="reviews-title-singular">Reviews for other addresses owned by this landlord</div>
            }
            <div className={'reviews-wrapper'}>
                {
                    (selected === 'this' ? propertyAgg : otherAgg).length > 0 ?
                        (selected === 'this' ? propertyAgg : otherAgg).map((question, i) => (
                            <div className="review-section">
                                {/* <Twemoji options={{ className: 'twemoji' }}>
                                    <span className="emoji">{question.emoji}</span>
                                </Twemoji> */}
                                <div className='review-question'>{question.emoji} {question.question}</div>
                                {
                                    question.answers.map((a) => (
                                        <div className='review-answer'><span className="count">{a.count} {a.count === 1 ? 'person' : 'people'} said: </span><span className="statment">{a.text}</span></div>
                                    ))
                                }
                            </div>
                        ))
                    :
                    (selected === 'this' ? propertyItemized : otherItemized).length === 0 &&
                    <div className="review-section">
                        <div className='review-question'>{selected === 'this' ? 'no reviews for this address' : 'no other reviews'}</div>
                        <div className='leave-a-review-wrapper'>
                            <button className='leave-a-review' onClick={() => scrollToReviews()}>leave a review</button>
                        </div>
                    </div>
                }
                 <div className='selection-questions'>
                    {
                        (selected === 'this' ? propertyItemized : otherItemized).length > 0 &&
                        (selected === 'this' ? propertyItemized : otherItemized).map((q, i) => 
                                <div 
                                    key={`${i}-sq`}
                                    className="selection-question selection">{selectionQuestions.questions[i].emoji} {selectionQuestions.questions[i].text} <span className="item-count"><small>x</small><strong>{q}</strong></span>
                                </div>
                        )
                    }
                </div>
                {
                    (selected === 'this' ? propertyComments : otherComments).length !== 0 &&
                    <div>
                        <div className="comment-title">comments:</div>
                        {
                            (selected === 'this' ? propertyComments : otherComments)
                                .map((comment, index) => (

                                    <>
                                        <p className="comment">{comment}</p>
                                    </>

                                ))
                        }
                    </div>
                }
            </div>




            {/* <Twemoji options={{ className: 'twemoji' }}>
            <span>☣ 💲</span>
            </Twemoji> */}
            {/* {
                other_reviews_filtered && other_reviews_filtered.length > 0 &&
                <><div className="reviews-title">Reviews for other properties from this landlord</div>
                    <div className="reviews-wrapper">
                        {qs.map((question, i) => (
                            <div className='review-statement'>{getStatements(i, other_reviews_filtered)}</div>
                        ))}
                    </div></>
            } */}
        </div>
    )
}

export default Reviews
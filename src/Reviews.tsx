import { getState } from "react"
import { Review } from "./ResultTypes"
import { qs } from "./SurveyQuestions"
import './App.scss';
import Twemoji from 'react-twemoji';

function Reviews({ property_reviews, other_reviews }: { property_reviews: Review[], other_reviews: Review[] | null }) {

    const [propertyAgg, setPropertyAgg] = getState([])
    const [otherAgg, setOtherAgg] = getState([])
    const other_reviews_filtered = other_reviews && other_reviews.filter(rev => !property_reviews.find(r => r.id === rev.id))

    function getCount(index: number, arr: Review[], answerOfNote: number) {
        return arr.reduce((total, rev) => {
            if (rev.selected_answers[index] === answerOfNote) {
                total += 1
            }
            return total
        }, 0)
    }

    function getStatements(index: number, arr: Review[]) {
        return qs[index].answersOfNote
            .map(answerOfNote => {
                let count = getCount(index, arr, answerOfNote)
                return { answerOfNote, count }
            })
            .filter(result => result.count !== 0)
            .reduce((agg,  => {
                const {answerOfNote, count} = result

                return {
                    question: 
                }

    }
    return (
        <div>
            <div className="reviews-title">Reviews for this Property</div>
            <div className="reviews-wrapper">
                {
                    qs.map((question, i) => (
                        <div className='review-statement'>{getStatements(i, property_reviews)}</div>
                    ))
                }
            </div>

            {/* <Twemoji options={{ className: 'twemoji' }}>
            <span>☣ 💲</span>
            </Twemoji> */}
            {
                other_reviews_filtered && other_reviews_filtered.length > 0 &&
                <><div className="reviews-title">Reviews for other properties from this landlord</div>
                    <div className="reviews-wrapper">
                        {qs.map((question, i) => (
                            <div className='review-statement'>{getStatements(i, other_reviews_filtered)}</div>
                        ))}
                    </div></>
            }
        </div>
    )
}

export default Reviews
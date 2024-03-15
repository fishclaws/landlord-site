import { Review } from "./ResultTypes"
import { qs } from "./SurveyQuestions"
import './App.scss';

function Reviews({ property_reviews, other_reviews }: { property_reviews: Review[], other_reviews: Review[] | null }) {
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
        return qs[index].answersOfNote.map(answerOfNote => {
            let statement = ''
            let count = getCount(index, arr, answerOfNote)
            if (count === 0) {
                return null
            }
            var regex = /<(\d+)\|answer>/;
            const match_conditional = regex.exec(qs[index].statement);
            console.log(match_conditional)
            if (match_conditional && answerOfNote === parseInt(match_conditional[1])) {
                statement = qs[index].statement.replace(match_conditional[0].toLowerCase(), qs[index].answers[answerOfNote].toLowerCase())
            } else {
                statement = qs[index].statement.replace('<answer>', qs[index].answers[answerOfNote].toLowerCase())
            }
            return `${count} ${count > 1 ? 'people' : 'person'} said ${statement}`

        })
            .filter(x => x)
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
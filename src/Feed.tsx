import './Feed.scss'

const exampleFeed = [
    {
        type: 'REVIEW_LEFT',
        origin: '3035 SE ANKENY',
        text: 'Leaves out fish cups and raw sardines. Why would he do that? Rent is way too high',
        date: (new Date()).toString()
    },
    {
        type: 'REVIEW_LEFT',
        origin: '3035 SE ANKENY',
        text: 'Leaves out fish cups and raw sardines. Why would he do that? Rent is way too high',
        date: (new Date()).toString()
    },
    {
        type: 'PUBLIC_COMMENT',
        origin: '3035 SE ANKENY',
        text: 'I\'m insterested in joining',
        date: (new Date()).toString() 
    },
    {
        type: 'REVIEW_LEFT',
        origin: '3035 SE ANKENY',
        text: 'Leaves out fish cups and raw sardines. Why would he do that? Rent is way too high',
        date: (new Date()).toString()
    }
]

function Feed() {
    return (
        <div className="the-feed">
          <div className='title'>what are people upto</div>
          {
            <div className='feed-item'>
                <div>What do you want to share?</div>
                <textarea></textarea>
            </div>
          }
          {
            exampleFeed.map((feedItem) => (
                <div className='feed-item'>
                    <div className='small-text'>Review left for <a href={`/address/${feedItem.origin}`}>{feedItem.origin}</a></div>
                    <div>{feedItem.text}</div>
                    <div className='date-text'>{feedItem.date}</div>
                </div>
            ))
          
          }
        </div>
      );
};

export default Feed;
'use client'

import './info.scss'

function Info({message}: {message: string}) {

  return (
    <div className="absCenter">
        <button className="infoButton">
            <div className="infoButton-btn">
                <span className="infoButton-btn-text">i</span>
            </div>
            <div className="infoButton-container">
                <div className="infoButton-container-message">{message}</div>
            </div>
        </button>
    </div>
  )
}

export default Info;

function Organize() {

    const sections = [
        {
           title: 'Catalog your Building',
           desc: `Before you get started, you should have an idea of how many homes are in your building or property. Make a list of each apartment, and write down the name of any neighbors you already know. If you have contact info for them, like a phone number, write that down too.`,
           question:`Do you already know any of your neighbors, and have a way to contact them?`,
           answers: ['yes', 'no']
        },

        {
            title: 'Recruit a few allies',
            desc: `Approaching your neighbors for the first time can feel intimidating, but it doesn’t have to be! If you have a sense of who might be friendly, focus on them first. Your goal is to get 1-3 initial allies in the building that will help you reach the rest of your neighbors. If you’ve faced any particular issues in the building or with management that might have affected your neighbors as well, keep those in mind.`,
            question:`Do you already know any of your neighbors, and have a way to contact them?`,
            answers: ['yes', 'no']
         }
    ]

    return (
        <div className="organize-wrapper">
            
            {
            sections.map((sect, i) => 
                <div className="org-section">
                    <div className="org-title">{sect.title}</div>
                    <p className="org-desc">{sect.desc}</p>
                    <p className="org-question">{sect.question}</p>
                    <div className="org-answers">
                    {
                        sect.answers.map(a => <button>{a}</button>)
                    }
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default Organize;
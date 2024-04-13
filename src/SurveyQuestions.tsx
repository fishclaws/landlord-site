
export interface Question {
    text: string,
    details?: string,
    answers: Array<string>,
    answersOfNote: Array<number>,
    statement: string,
    emoji: string,
    tenantUnion?: boolean;
}

export const QUESTION_SET = '23326db2f378920858c29ea3c228351b'

export const qs: Question[] = [
    {
        text: 'How much has your rent gone up in the past year?',
        answers: [
            'None',
            'Less than $60',
            'Between $60 and $150',
            'More than $150'
        ],
        answersOfNote: [1,2,3],
        statement: 'their rent went up <answer>',
        emoji: '💵'
    },
    {
        text: 'Does this landlord respond to maintenance problems?',
        answers: [
            'Yes',
            'No',
            'Slow to respond',
        ],
        answersOfNote: [1, 2],
        statement: 'this landlord <answer> responds to maintenance problems',
        emoji: '🛠️'
    },
    {
        text: 'Is this landlord unprofessional or creepy? ',
        details: '(unwanted comments, rude, aggressive, privacy violations, retaliation)',
        answers: [
            'Yes',
            'No'
        ],
        answersOfNote: [0],
        statement: 'this landlord is <answer> unprofessional or creepy',
        emoji: '🛑'

    },
    {
        text: 'Is this building unlivable or unsafe?',
        details: '(mold, pests, leaks, maintenance needs, insufficient heat)',
        answers: [
            'Yes',
            'No'
        ],
        answersOfNote: [0],
        statement: 'this building has untreated mold or other biohazards',
        emoji: '☣️'
    },
    {
        text: 'Has this landlord attempted to evict you for any reason?',
        answers: [
            'Yes',
            'No'
        ],
        answersOfNote: [0],
        statement: 'this landlord attempted to evict them',
        emoji: '⚖️'
    },
    {
        text: 'Would you start or join a tenant union?',
        answers: [
            'Yes',
            'No',
            'Interested in learning more'
        ],
        answersOfNote: [0],
        statement: 'this landlord attempted to evict them',
        emoji: '👥',
        tenantUnion: true
    }
    // {
    //     text: 'Is your building unlivable?',
    //     answers: [
    //         'Yes',
    //         'Sometimes',
    //         'No'
    //     ],
    //     answersOfNote: [0, 1],
    //     statement: 'this building is <1|answer> unlivable'
    // }
]

export type Landlord = { name: string; origin: string; }

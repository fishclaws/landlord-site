
export interface Question {
    text: string,
    answers?: Array<string>
}

export const qs = [
    {
        text: 'How much has your rent gone up in the past year?',
        answers: [
            'None',
            'Less than $100',
            'Between $100 and $300',
            'More than $300'
        ],
        answersOfNote: [1,2,3],
        statement: 'their rent went up <answer>'
    },
    {
        text: 'Does your Landlord respond to maintenance problems?',
        answers: [
            'Never',
            'Sometimes',
            'Always',
        ],
        answersOfNote: [0, 1],
        statement: 'this landlord <answer> responds to maintenance problems'
    },
    {
        text: 'Is your landlord unprofessional or creepy?',
        answers: [
            'Never',
            'Sometimes',
            'Always',
        ],
        answersOfNote: [1, 2],
        statement: 'this landlord is <answer> unprofessional or creepy'

    },
    {
        text: 'Does your building have untreated mold or other biohazards?',
        answers: [
            'Yes',
            'No',
            'Unsure'
        ],
        answersOfNote: [0],
        statement: 'this building has untreated mold or other biohazards'
    },
    {
        text: 'Has your landlord attempted to evict you?',
        answers: [
            'Yes',
            'No'
        ],
        answersOfNote: [0],
        statement: 'this landlord attempted to evict them'
    },
    {
        text: 'Is your building unlivable?',
        answers: [
            'Yes',
            'Sometimes',
            'No'
        ],
        answersOfNote: [0, 1],
        statement: 'this building is <1|answer> unlivable'
    }
]

export type Landlord = { name: string; origin: string; }

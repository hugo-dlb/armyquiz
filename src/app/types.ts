export type Database = {
    categories: Category[];
}

export type Category = {
    id: string;
    label: string;
    questions: Question[];
}

export type Question = {
    uid?: string;
    label: string;
    choices: Choice[];
    correctChoiceIndexes: number[];
}

export type Choice = {
    label: string;
    isCorrectChoice: boolean;
}
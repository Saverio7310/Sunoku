import type { RecordScore } from "../types/gameTypes";

export const RECORD_SCORE_KEY: string = 'Record score';

/**
 * Store the record score into the local storage
 * @param score Score to store
 */
export function saveRecordScore(score: number): void {
    const date = new Date();
    const record: RecordScore = {
        value: score,
        date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    };
    localStorage.setItem(RECORD_SCORE_KEY, JSON.stringify(record));
}

export function retrieveRecordScore(): RecordScore {
    const jsonRecord: string | null = localStorage.getItem(RECORD_SCORE_KEY);
    const emptyRecord: RecordScore = {
        value: 0,
        date: ''
    };

    if (!jsonRecord) return emptyRecord;

    try {
        return JSON.parse(jsonRecord);
    } catch (error) {
        console.error('Record Score string is not a valid JSON!');
    }

    return emptyRecord;
}
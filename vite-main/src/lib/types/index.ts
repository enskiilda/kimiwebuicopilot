export enum TTS_RESPONSE_SPLIT {
        PUNCTUATION = 'punctuation',
        PARAGRAPHS = 'paragraphs',
        NONE = 'none'
}

export type Banner = {
        id: string;
        type: string;
        title?: string;
        content: string;
        url?: string;
        dismissible?: boolean;
        timestamp: number;
};

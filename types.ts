export enum EditorMode {
    WRITE = 'WRITE',
    PREVIEW = 'PREVIEW',
    SPLIT = 'SPLIT'
}

export interface ExportOptions {
    filename: string;
    includeHeader: boolean;
}

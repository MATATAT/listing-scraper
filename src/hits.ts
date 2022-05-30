export interface Hit {
    id: number;
    requisition_id: string;
    product?: string;
    title: string;
    absolute_url: string;
}

export type Hits = Hit[];
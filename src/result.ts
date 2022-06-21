// TODO: Make this not so rudimentary

export enum Origin {
    ListingState = 0,
    Email = 1,
}

export enum Status {
    Ok,
    Error,
}

export interface IResult {
    origin: Origin,
    status: Status
}

export namespace Result {
    export function ok(origin: Origin): IResult {
        return {
            origin,
            status: Status.Ok
        };
    }

    export function err(origin: Origin): IResult {
        return {
            origin,
            status: Status.Error
        };
    }
}
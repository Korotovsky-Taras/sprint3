export class ServiceError extends Error {
    message: string;
    constructor(status: number, message: string) {
        super();
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
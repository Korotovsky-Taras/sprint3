import {Request, Response} from "express";

class AuthHelper {
    constructor(protected refreshTokenName: string = 'refreshToken') {}
    applyRefreshToken(res: Response, refreshToken: string) {
        res.cookie(this.refreshTokenName, refreshToken, {httpOnly: true, secure: true})
    }
    clearRefreshToken(res: Response): void {
        res.clearCookie(this.refreshTokenName);
    }
    getRefreshToken(req: Request): string | null {
        const cookies = req.cookies;
        return typeof cookies === 'object' ? cookies[this.refreshTokenName] : null
    }
    getUserAgent(req: Request): string {
        return req.header('user-agent') || "unknown";
    }
    getIp(req: Request): string {
        return req.ip;
    }
}

export const authHelper = new AuthHelper();
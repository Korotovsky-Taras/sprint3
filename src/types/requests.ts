import {Request} from "express";

export type RequestWithParams<P> = Request<P>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamsBody<P, B> = Request<P, {}, B>;
export type RequestWithParamsQuery<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithBody<T> = Request<{},{},T>;
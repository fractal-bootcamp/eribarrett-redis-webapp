import { Request, Response, NextFunction } from 'express';

export interface TypedRequest extends Request {
    // request type can be extended here
}

export interface TypedResponse extends Response {
    // response type can be extended here
}

// for middleware func that use req/res
export type MiddlewareFunction = (
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
) => Promise<void> | void;

// for route handler funcs 
export type RouteHandler = (
    req: TypedRequest,
    res: TypedResponse,
    next?: NextFunction
) => Promise<void> | void;

// click counter middleware
export type ClickCounterMiddleware = (routeName: string) => MiddlewareFunction;

// response structure 
export interface ApiResponse {
    status: 'success' | 'error';
    message?: string;
    data?: any;
}

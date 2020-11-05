import { Request, Response, NextFunction } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
    res
        .set('access-control-allow-origin', '*')
        .set('access-control-allow-headers', '*')
        .set('access-control-allow-methods', '*')
    next()
}
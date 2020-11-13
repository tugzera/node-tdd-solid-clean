import { Request, Response } from 'express'
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";

export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpRequest: HttpRequest = {
            body: req.body
        }
        const httpResponse: HttpResponse = await controller.handle(httpRequest)
        if (httpResponse.statusCode === 500) {
            res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
        }
        res.status(httpResponse.statusCode).json(httpResponse.body)
    }
}
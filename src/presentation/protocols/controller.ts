import { HttpRequest, HttpResponse } from './'

export interface Controller {
    handle(HttpRequest: HttpRequest): Promise<HttpResponse>
}
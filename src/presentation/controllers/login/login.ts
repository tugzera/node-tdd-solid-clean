import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
} from "../../protocols";
import { badRequest, serverError, unauthorizedError } from "../../helpers";
import { MissingParamError, InvalidParamError } from "../../errors";
import { Authenticator } from "../../../domain/usecases/authenticator";

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authenticator: Authenticator;

  constructor(emailValidator: EmailValidator, authenticator: Authenticator) {
    this.emailValidator = emailValidator;
    this.authenticator = authenticator;
  }

  async handle(HttpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];
      const { body } = HttpRequest;
      const { email, password } = body;
      for (const field of requiredFields) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isValidEmailFormat = this.emailValidator.isValid(email);
      if (!isValidEmailFormat) {
        return badRequest(new InvalidParamError("email"));
      }
      const authentication = await this.authenticator.auth(email, password);
      if (!authentication) {
        return unauthorizedError();
      }
    } catch (error) {
      return serverError(error);
    }
  }
}

import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  Authenticator,
} from "./login-protocols";
import { badRequest, serverError, unauthorizedError } from "../../helpers";
import { MissingParamError, InvalidParamError } from "../../errors";

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
      const accessToken = await this.authenticator.auth(email, password);
      if (!accessToken) {
        return unauthorizedError();
      }
    } catch (error) {
      return serverError(error);
    }
  }
}

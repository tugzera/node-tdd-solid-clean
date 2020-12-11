import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount,
  Validator,
} from "./signup-protocols";
import { InvalidParamError } from "../../errors";
import { badRequest, successRequest, serverError } from "../../helpers";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  private readonly validator: Validator;

  constructor(
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validator: Validator
  ) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
    this.validator = validator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validatorError = this.validator.validate(httpRequest.body);
      if (validatorError) {
        return badRequest(validatorError);
      }
      const requiredFields = ["name", "email", "password", "confirm_password"];
      const { body } = httpRequest;
      const { name, email, password, confirm_password } = body;
      const isValid = this.emailValidator.isValid(body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      if (password !== confirm_password) {
        return badRequest(new InvalidParamError("confirm_password"));
      }
      const data = await this.addAccount.add({ name, email, password });
      return Promise.resolve(successRequest(data));
    } catch (error) {
      return serverError(error);
    }
  }
}

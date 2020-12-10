import { HttpRequest, EmailValidator } from "../../protocols";
import { badRequest, serverError, unauthorizedError } from "../../helpers";
import {
  MissingParamError,
  InvalidParamError,
  UnauthorizedError,
} from "../../errors";
import { LoginController } from "./login";
import { Authenticator } from "../../../domain/usecases/authenticator";

const makeAuthenticator = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async auth(email: string, password: string): Promise<string> {
      return Promise.resolve("any_token");
    }
  }
  return new AuthenticatorStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticatorStub: Authenticator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticatorStub = makeAuthenticator();
  const sut = new LoginController(emailValidatorStub, authenticatorStub);
  return { sut, emailValidatorStub, authenticatorStub };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@email.com",
    password: "any_password",
  },
});

describe("Login Controller", () => {
  test("Should return error 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const data = {
      body: { password: "any_password" },
    };
    const response = await sut.handle(data);
    expect(response).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return error 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const data = {
      body: { email: "any_email" },
    };
    const response = await sut.handle(data);
    expect(response).toEqual(badRequest(new MissingParamError("password")));
  });

  test("Should return error if no valid email format is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const data = makeFakeRequest();
    const response = await sut.handle(data);
    expect(response).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("Should call email validator with the correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, "isValid");
    const data = makeFakeRequest();
    await sut.handle(data);
    expect(emailValidatorSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should returns error 500 if emailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const data = makeFakeRequest();
    const response = await sut.handle(data);
    expect(response).toEqual(serverError(new Error()));
  });

  test("Should call Authentication with the correct values ", async () => {
    const { sut, authenticatorStub } = makeSut();
    const authenticationSpy = jest.spyOn(authenticatorStub, "auth");
    const data = makeFakeRequest();
    await sut.handle(data);
    expect(authenticationSpy).toHaveBeenCalledWith(
      "any_email@email.com",
      "any_password"
    );
  });

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticatorStub } = makeSut();
    jest
      .spyOn(authenticatorStub, "auth")
      .mockReturnValueOnce(Promise.resolve(null));
    const data = makeFakeRequest();
    const response = await sut.handle(data);
    expect(response).toEqual(unauthorizedError());
  });

  test("Should return error 500 if authenticator throws", async () => {
    const { sut, authenticatorStub } = makeSut();
    jest
      .spyOn(authenticatorStub, "auth")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const data = makeFakeRequest();
    const response = await sut.handle(data);
    expect(response).toEqual(serverError(new Error()));
  });
});

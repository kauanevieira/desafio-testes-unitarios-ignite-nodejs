import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepo: InMemoryUsersRepository;
let authUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
const rawUser: ICreateUserDTO = {
  email: "email@email.com",
  name: "dan",
  password: "senha",
};

describe("AuthenticateUserUseCase", () => {
  beforeAll(async () => {
    usersRepo = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepo);
    await createUserUseCase.execute(rawUser);
    authUseCase = new AuthenticateUserUseCase(usersRepo);
  });

  it("should authenticate existing user.", async () => {
    const authenticated = await authUseCase.execute({
      email: rawUser.email,
      password: rawUser.password,
    });

    expect(authenticated).toHaveProperty("token");
    expect(authenticated).toHaveProperty("user");
  });

  it("should not authenticate non-existing user.", async () => {
    expect(async () => {
      await authUseCase.execute({ email: "email", password: rawUser.password });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not authenticate existing user with wrong password.", async () => {
    expect(async () => {
      await authUseCase.execute({ email: rawUser.email, password: "wrong" });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
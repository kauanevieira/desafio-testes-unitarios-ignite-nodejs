import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let useCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepo: InMemoryUsersRepository;
const rawUser: ICreateUserDTO = {
  email: "email@email.com",
  name: "dan",
  password: "senha",
};
let createdUser: User;

describe("ShowUserProfileUseCase", () => {
  beforeAll(async () => {
    usersRepo = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepo);
    createdUser = await createUserUseCase.execute(rawUser);
    useCase = new ShowUserProfileUseCase(usersRepo);
  });

  it("should return instance of existing user.", async () => {
    const existingUser = await useCase.execute(createdUser.id!);
    expect(existingUser).toBeDefined();
    expect(existingUser).toBeInstanceOf(User);
    expect(existingUser).toEqual(createdUser);
  });

  it("should throw error if user do not exists.", async () => {
    expect(async () => {
      await useCase.execute("adfasdf");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
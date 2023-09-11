import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepo: InMemoryUsersRepository;
let useCase: CreateUserUseCase;
const rawUser: ICreateUserDTO = {
  name: "Kauane",
  email: "email@email.com",
  password: "senha",
};

describe("CreateUserUseCase", () => {
  beforeAll(() => {
    usersRepo = new InMemoryUsersRepository();
    useCase = new CreateUserUseCase(usersRepo);
  });

  it("should create a new user.", async () => {
    await useCase.execute(rawUser);
    const created = await usersRepo.findByEmail("email@email.com");

    expect(created).toBeInstanceOf(User);
    expect(created).toHaveProperty("id");
  });

  it("should not create user with existing email.", async () => {
    expect(async () => {
      await useCase.execute(rawUser);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
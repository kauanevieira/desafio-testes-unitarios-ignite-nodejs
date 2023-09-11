import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let statementsRepo: InMemoryStatementsRepository;
let usersRepo: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let useCase: CreateStatementUseCase;
const createUserDto: ICreateUserDTO = {
  name: "Danillo",
  email: "email@email.com",
  password: "senha",
};
let user: User;
let statementDto: ICreateStatementDTO;

describe("CreateUserUseCase", () => {
  beforeAll(async () => {
    statementsRepo = new InMemoryStatementsRepository();
    usersRepo = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepo);
    useCase = new CreateStatementUseCase(usersRepo, statementsRepo);

    user = await createUserUseCase.execute(createUserDto);
    statementDto = {
      amount: 45,
      description: "erw",
      type: OperationType.DEPOSIT,
      user_id: user.id!,
    };
  });

  it("should create a new statement.", async () => {
    const statement = await useCase.execute(statementDto);
    const created = await statementsRepo.findStatementOperation({
      statement_id: statement.id!,
      user_id: user.id!,
    });

    expect(created).toBeInstanceOf(Statement);
    expect(created).toEqual(statement);
  });

  it("should not create statement with non existing user.", async () => {
    expect(async () => {
      await useCase.execute({ ...statementDto, user_id: "saddasd" });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not create statement if balance is gonna be negative.", async () => {
    expect(async () => {
      await useCase.execute({
        ...statementDto,
        type: OperationType.WITHDRAW,
        amount: 465464,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
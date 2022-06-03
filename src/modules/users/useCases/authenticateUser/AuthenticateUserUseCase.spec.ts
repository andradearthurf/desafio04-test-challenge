import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () =>{
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async() =>{
    const user: ICreateUserDTO = {
      name: "test",
      email: "test@test.com",
      password: "1234",
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");

  });

  it("should not be able to authenticate an non existent user", async () =>{
    expect(async () =>{
      await authenticateUserUseCase.execute({
        email: "falsetest@test.com",
        password: "test123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a incorrect password", async() =>{
    expect(async () =>{
      const user: ICreateUserDTO = {
        email: "test@test.com",
        name: "test",
        password: "1234",
      };

      await inMemoryUsersRepository.create(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a incorrect email", async () => {
    expect(async () =>{
      const user: ICreateUserDTO = {
        email: "test@test.com",
        name: "test",
        password: "1234",
      };

      await inMemoryUsersRepository.create(user);

      const response = await authenticateUserUseCase.execute({
        email: "non@existent.com",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})

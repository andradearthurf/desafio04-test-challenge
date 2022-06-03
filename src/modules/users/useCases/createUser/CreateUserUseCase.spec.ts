import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "1234",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able create a new user with email already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Test User1",
        email: "test@email.com",
        password: "1234",
      });

      await createUserUseCase.execute({
        name: "Test User2",
        email: "test@email.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});


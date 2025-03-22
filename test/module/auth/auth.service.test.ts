import AuthService from "../../../src/module/auth/auth.service";
import { User } from "../../../src/module/users/user.entity";
import { UserRepository } from "../../../src/module/users/user.repository";
import AppError from "../../../src/utils/app.error";
import { signToken } from "../../../src/utils/app.jwt";

jest.mock("../../../src/utils/app.jwt", () => ({
  signToken: jest.fn().mockReturnValue("mocked_token"),
}));

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      existsByEmail: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    authService = new AuthService(userRepository);
  });

  describe("login", () => {
    it("should return token and user data if user exists", async () => {
      const email = "test@example.com";
      const mockUser = { id: "user123", email } as unknown as User;

      userRepository.existsByEmail.mockResolvedValue(true);
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await authService.login({ email });

      expect(userRepository.existsByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.findOne).toHaveBeenCalledWith({ email });
      expect(signToken).toHaveBeenCalledWith({ email, id: mockUser.id });
      expect(result).toEqual({
        token: "mocked_token",
        id: "user123",
        email,
      });
    });

    it("should throw error if user does not exist", async () => {
      const email = "notfound@example.com";
      userRepository.existsByEmail.mockResolvedValue(false);

      await expect(authService.login({ email })).rejects.toThrow(AppError);
      await expect(authService.login({ email })).rejects.toThrow(
        "Invalid credentials",
      );
    });
  });

  describe("register", () => {
    it("should register and return token and user data", async () => {
      const email = "newuser@example.com";
      const mockUser = { id: "newId", email } as unknown as User;

      userRepository.existsByEmail.mockResolvedValue(false);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await authService.register({ email });

      expect(userRepository.existsByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.save).toHaveBeenCalledWith({ email });
      expect(signToken).toHaveBeenCalledWith({ email, id: mockUser.id });
      expect(result).toEqual({
        token: "mocked_token",
        id: "newId",
        email,
      });
    });

    it("should throw error if user already exists", async () => {
      const email = "existing@example.com";
      userRepository.existsByEmail.mockResolvedValue(true);

      await expect(authService.register({ email })).rejects.toThrow(AppError);
      await expect(authService.register({ email })).rejects.toThrow(
        "User already exists",
      );
    });
  });
});

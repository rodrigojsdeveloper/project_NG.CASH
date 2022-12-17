import { userRepository } from "../../repositories/user.repository";
import { ISessionRequest } from "../../interfaces/session";
import { AppError } from "../../errors";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const createSessionService = async (user: ISessionRequest): Promise<object> => {
  const findUser = await userRepository.findOneBy({ username: user.username });

  if (!findUser) {
    throw new AppError("Invalid credentials", 401);
  }

  const passwordMatch = await compare(user.password, findUser.password);

  if (!passwordMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    { username: user.username },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "24h",
      subject: findUser.id,
    }
  );

  return { token };
};

export { createSessionService };

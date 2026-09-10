import UserRepository from "../../persistence/mongodb/repositories/user.repository.js";

const DAY = 24 * 60 * 60 * 1000;
const UserMng = new UserRepository();

export const resetAttemptsIfExpired = (user) => {
  const now = Date.now();

  if (user.mailAttemptsAt && now - user.mailAttemptsAt > DAY) {
    user.mailAttempts = 0;
    user.mailAttemptsAt = null;
  }

  if (user.codeAttemptsAt && now - user.codeAttemptsAt > DAY) {
    user.codeAttempts = 0;
    user.codeAttemptsAt = null;
  }
};

export const checkAndInitializeCodeAttempts = async (user) => {

  if (!user.codeAttemptsAt) {
    await UserMng.update(user.id, { codeAttemptsAt: new Date() });
  }

  resetAttemptsIfExpired(user);
}
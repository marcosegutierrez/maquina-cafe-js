export const serializeUser = (user) => ({
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
    id: user.id
});
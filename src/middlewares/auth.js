export const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send('No autorizado');
    }
    next();
};
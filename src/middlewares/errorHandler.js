export const errorHandler = (err, req, res, next) => {
    console.log('Error: ', err);
    const status = err.statusCode || 500;
    const msg = err.message || 'Error interno del servidor';
    res.status(status).json({ success: false, msg});
}
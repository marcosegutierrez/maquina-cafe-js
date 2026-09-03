export const errorHandler = (err, req, res, next) => {
    console.log('Error: ', err);
    const isOperational = err.isOperational;
    const status = err.statusCode || 500;

    const msg = isOperational
        ? err.message
        : "Error interno del servidor";

    return res.status(status).json({
        success: false,
        msg
    });
}
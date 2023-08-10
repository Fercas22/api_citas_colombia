const statusCodes = []

statusCodes.internalErr = {
    statusCode  :   500,
    info        :   'Internal error'  
}

statusCodes.notFount = {
    statusCode  :   404,
    info        :   'Not fount'
}

statusCodes.successOk = {
    statusCode  :   200,
    info        :   'Done!'
}

statusCodes.unauthorized = {
    statusCode  :   401,
    info        :   'Unauthorized'
}

statusCodes.notAvailable = {
    statusCode  : 409,
    info        : 'email not available'
}

module.exports = statusCodes;
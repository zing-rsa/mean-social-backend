class ValidationError extends Error{
}

class NotFoundError extends Error{
}

class ConflictError extends Error{
}

class AuthError extends Error{
}

class AuthorizationError extends Error{
}

module.exports = {
    AuthorizationError,
    ValidationError,
    NotFoundError,
    ConflictError,
    AuthError
}
class ValidationError extends Error{
}

class NotFoundError extends Error{
}

class SignupError extends Error{
}

class AuthError extends Error{
}

class AuthorizationError extends Error{
}

module.exports = {
    AuthorizationError,
    ValidationError,
    NotFoundError,
    SignupError,
    AuthError
}
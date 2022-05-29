class ValidationError extends Error{
}

class NotFoundError extends Error{
}

class SignupError extends Error{
}

class AuthError extends Error{
}

module.exports = {
    ValidationError,
    NotFoundError,
    SignupError,
    AuthError
}
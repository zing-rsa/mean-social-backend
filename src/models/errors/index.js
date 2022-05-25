class SignupError extends Error{
    constructor(message){
        super(message)
    }
}

class ValidationError extends Error{
    constructor(message){
        super(message)
    }
}

class LoginError extends Error{
    constructor(message){
        super(message)
    }
}

class UpdateError extends Error{
    constructor(message){
        super(message)
    }
}

module.exports = {
    SignupError,
    LoginError,
    ValidationError,
    UpdateError
}
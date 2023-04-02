function User(user) {
    this._id = user._id;
    this.name = user.name;
    this.surname = user.surname;
    this.username = user.name + '.' + user.surname;
    this.email = user.email;
    this.bio = user.bio;
}

function UserMapper(user){
    if(user.name) this.name = user.name;
    if(user.surname) this.surname = user.surname;
    if(user.email) this.email = user.email;
    if(user.pass) this.pass = user.pass;
    if(user.bio) this.bio = user.bio;
    if(user.username) {
        this.username = '@' + user.username
    } else {
        this.username = '@' + user.name + '.' + user.surname;
    }
}

function UserEditMapper(user){
    if(user.name) this.name = user.name;
    if(user.surname) this.surname = user.surname;
    if(user.email) this.email = user.email;
    if(user.pass) this.pass = user.pass;
    if(user.bio) this.bio = user.bio;
    if(user.username) this.username = '@' + user.username;
}

module.exports = { 
    User,
    UserMapper,
    UserEditMapper
}
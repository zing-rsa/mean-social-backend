function User(user) {
    this.name = user.name;
    this.surname = user.surname;
    this.username = user.name + '.' + user.surname;
    this.email = user.email;
    this.bio = user.bio;
}

module.exports = User
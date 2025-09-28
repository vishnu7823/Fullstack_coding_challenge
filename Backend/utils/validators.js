const nameValid = name => typeof name === 'string' && name.length >= 20 && name.length <= 60;

const addressValid = address => typeof address === 'string' && address.length <= 400;

const emailValid = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const passwordValid = password => {
    if (typeof password !== 'string') return false;
    if (password.length < 8 || password.length > 16) return false;
    // at least 1 uppercase and 1 special char
    return /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);
};

module.exports = {
    nameValid,
    addressValid,
    emailValid,
    passwordValid
};

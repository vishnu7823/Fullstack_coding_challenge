const validators = require('express-vaildator');

const nameValid = name=> typeof name==='String' && name.length>=20 && name.length<=60;

const addressValid = address=> typeof address == 'String' && address.length<=400;

const emailValid = email=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const passwordValid = password=> {
  if (typeof pwd !== 'string') return false;
  if (pwd.length < 8 || pwd.length > 16) return false;
  // at least 1 uppercase and 1 special char
  return /[A-Z]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);
};

module.exports = {
    nameValid,
    addressValid,
    emailValid,
    passwordValid
}
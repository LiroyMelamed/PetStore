const bcrypt = require('bcrypt');

const passwordToHash = '123456'; // החלף בסיסמה שלך
const saltRounds = 10;

bcrypt.hash(passwordToHash, saltRounds, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Hashed Password:', hash);
});
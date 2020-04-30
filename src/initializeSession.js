const passport = require('passport');
const { compose } = require('compose-middleware');

module.exports = () => compose([
    passport.initialize(),
    passport.session(),
]);

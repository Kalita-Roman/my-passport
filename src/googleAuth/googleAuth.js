const passport = require('passport');
const { Router } = require('express');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const GOOGLE = 'google';

const googleAuth = (options) => {
    const {
        clientID,
        clientSecret,
    } = options;
    
    passport.use(new GoogleStrategy(
        {
            clientID,
            clientSecret,
            callbackURL: '/google/callback',
        },
        (accessToken, secretToken, profile, cb) => {
            cb(null, profile);
        },
    ));

    passport.serializeUser((user, cb) => {
        // console.log('serialize', user);
        cb(null, user);
    });

    passport.deserializeUser((user, cb) => {
        // console.log('deserialize', user);
        cb(null, user);
    });

    const route = new Router();

    route.get(
        '/google/login',
        (req, res, next) => {
            req.session.referer = req.headers.referer;
            next();
        },
        passport.authenticate(GOOGLE, { scope: ['profile'] }),
    );
    route.get(
        '/google/callback',
        passport.authenticate(GOOGLE, {
            failureRedirect: '/fail',
        }),
        (req, res) => {
            // console.log('callback success');
            const { referer } = req.session;
            req.session.referer = null;
            res.redirect(referer);
        },
    );
    route.get(
        '/google/fail',
        (req, res) => res.redirect(req.headers.referer),
    );
    route.get('/google/logout', (req, res) => {
        req.logout();
        res.redirect(req.headers.referer);
    });

    return route;
}

module.exports = googleAuth;
const passport = require('passport');
const { Router } = require('express');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const GOOGLE = 'google';
const callbackURL = '/google/callback';

const googleAuth = (options) => {
    const {
        clientID,
        clientSecret,
        scope,
        verify,
        serialize,
        deserialize
    } = { 
        scope: ['profile'],
        verify: (accessToken, secretToken, profile, cb) => {
            cb(null, profile);
        },
        serialize: (user, cb) => {
            // console.log('serialize', user);
            cb(null, user);
        },
        deserialize: (user, cb) => {
            // console.log('deserialize', user);
            cb(null, user);
        },
        ...options
    };
    
    passport.use(new GoogleStrategy(
        {
            clientID,
            clientSecret,
            callbackURL,
        },
        verify,
    ));

    passport.serializeUser(serialize);

    passport.deserializeUser(deserialize);

    const route = new Router();

    route.get(
        '/google/login',
        (req, res, next) => {
            req.session.referer = req.headers.referer;
            next();
        },
        passport.authenticate(GOOGLE, { scope }),
    );
    route.get(
        callbackURL,
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
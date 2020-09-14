const passport = require('passport');
const { Router } = require('express');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const GOOGLE = 'google';
const callbackURL = '/google/callback';
const loginURL = '/google/login';

const googleAuth = (options) => {
    const {
        clientID,
        clientSecret,
        scope,
        verify,
        serialize,
        deserialize,
        successUrl,
        failUrl,
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
        successUrl: '/success',
        failUrl: '/fail',
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
        loginURL,
        passport.authenticate(GOOGLE, { scope }),
    );
    route.get(
        callbackURL,
        passport.authenticate(GOOGLE, {
            successRedirect: successUrl,
            failureRedirect: failUrl,
        }),
    );
    route.get('/google/logout', (req, res) => {
        req.logout();
        res.redirect(successUrl);
    });

    return route;
}

module.exports = googleAuth;
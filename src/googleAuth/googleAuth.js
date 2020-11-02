const passport = require('passport');
const { Router } = require('express');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const GOOGLE = 'google';

const googleAuth = (options) => {
    const {
        clientID,
        clientSecret,
        scope,
        verify,
        serialize,
        deserialize,
        loginURL,
        callbackURL,
        successURL,
        failURL,
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
        loginURL: '/login',
        callbackURL: '/callback',
        successURL: '/success',
        failURL: '/fail',
        ...options,
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
            successRedirect: successURL,
            failureRedirect: failURL,
        }),
    );

    return route;
}

module.exports = googleAuth;
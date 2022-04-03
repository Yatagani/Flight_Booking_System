import SpeakEasy from 'speakeasy';

/**
 * Generates a token from a secret key.
 *
 * @param {String} secret
 */

export const generateToken = (secret) => {
  const token = SpeakEasy.totp({
    secret: secret.base32,
    encoding: 'base32',
  });

  return token;
};

/**
 * Verifies a given token.
 *
 * @param {String} secret: User secret key stored on the db
 * @param {String} userToken: Token provided by the user request.
 */

export const validateToken = (secret, userToken) => SpeakEasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: userToken,
});

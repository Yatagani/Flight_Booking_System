/* eslint-disable import/prefer-default-export */
import Path from 'path';
import Ejs from 'ejs';
import InlineCss from 'inline-css';

import { sendEmail } from '../../config/mail';

export const sendConfirmationEmail = async ({ user, redirectUrl }) => {
  const confirmationURL = `${redirectUrl}?token=${user.confirmationToken}`;
  const name = user.firstName;

  const emailContent = await Ejs.renderFile(
    Path.resolve(__dirname, '../../../templates/mail/account_confirmation.ejs'),
    {
      user: name || '',
      confirmationLink: confirmationURL,
    },
  );
  const html = await InlineCss(emailContent, {
    url: ' ',
    applyStyleTags: true,
  });

  await sendEmail({
    to: user.email,
    from: 'kostandin.dervishaj@gmail.com',
    subject: 'Account Confirmation',
    html,
  });
};

export const sendEmailWithResetPasswordLink = async ({ user, redirectUrl }) => {
  const emailContent = await Ejs.renderFile(
    Path.resolve(__dirname, '../../../templates/mail/reset_password_instructions.ejs'),
    {
      user: user.firstName,
      resetPasswordUrl: `${redirectUrl}?token=${user.confirmationToken}`,
    },
  );
  const html = await InlineCss(emailContent, {
    url: ' ',
    applyStyleTags: true,
  });

  await sendEmail({
    to: user.email,
    from: 'kostandin.dervishaj@gmail.com',
    subject: 'Reset Password Instructions',
    html,
  });
};

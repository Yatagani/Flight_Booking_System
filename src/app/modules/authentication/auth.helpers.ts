import sendEmail from '../../config/mail';

export const sendConfirmationEmail = async ({ user, redirectUrl }) => {
  const confirmationURL = `${redirectUrl}?token=${user.confirmationToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Account Confirmation',
    text: confirmationURL,
  });
};

export const sendEmailWithResetPasswordLink = async ({ user, redirectUrl }) => {
  const resetPasswordUrl = `${redirectUrl}?token=${user.confirmationToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Reset Password Instructions',
    text: resetPasswordUrl,
  });
};

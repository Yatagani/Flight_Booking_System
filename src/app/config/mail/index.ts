/* eslint-disable import/prefer-default-export */
import Sendgrid from '@sendgrid/mail';

import config from '../var';

Sendgrid.setApiKey(config.mailServiceApiKey);

export const sendEmail = (params) => new Promise((resolve, reject) => {
  const body = {
    ...params,
    from: {
      email: params.from || config.mailServiceSender,
      name: config.appName,
    },
  };

  if (params.attachments) {
    body.attachments = params.attachments;
  }

  Sendgrid.send(body, false, (error, info) => {
    if (error) {
      reject(error);
    } else {
      resolve(info);
    }
  });
});

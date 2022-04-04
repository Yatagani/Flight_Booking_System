import Sendgrid from '@sendgrid/mail';

import config from '../var';

Sendgrid.setApiKey(config.mailServiceApiKey);

const sendEmail = (params) => new Promise((resolve, reject) => {
  const body = {
    ...params,
    from: {
      email: params.from || config.mailServiceSender,
      name: config.appName,
    },
  };

  Sendgrid.send(body, false, (error, info) => {
    if (error) {
      reject(error);
    } else {
      resolve(info);
    }
  });
});

export default sendEmail;

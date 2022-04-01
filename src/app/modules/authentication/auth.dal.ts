//  Data access layer

import User from './user.model';

export const findUser = async ({ query }) => {
  const result = await User.findOne(query);
  return result;
};

export const createUser = async ({ content }) => {
  const result = await User.create(content);
  return result;
};

export const updateUser = async ({ query, content }) => {
  // Why options are needed here???

  const result = await User.findOneAndUpdate(query, content);
  return result;
};

export const deleteUser = async ({ query }) => {
  await User.deleteMany(query);
};

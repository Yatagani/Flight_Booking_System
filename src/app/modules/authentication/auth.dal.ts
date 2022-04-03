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
  /**
   * If you set `new: true`, `findOneAndUpdate()` will
   * give you the object after `update` was applied.
   */
  const options = { new: true };

  const result = await User.findOneAndUpdate(query, options, content);
  return result;
};

export const deleteUser = async ({ query }) => {
  await User.deleteMany(query);
};

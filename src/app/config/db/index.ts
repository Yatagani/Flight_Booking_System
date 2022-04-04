import mongoose from 'mongoose';

export default mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('Mongoose connected');
}).catch((e) => {
  console.log(e);
});

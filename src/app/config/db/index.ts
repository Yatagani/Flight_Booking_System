import mongoose from 'mongoose';

export default mongoose.connect(process.env.MONGODB_URL).then(() => {
}).catch((e) => {
  console.log(e);
});

export default {
  port: process.env.PORT || 3000,
  databaseUrl: 'mongodb+srv://m001-student:dmk9v3rgA7Abahp@sandbox.rvmbw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  jwtSecretKey: 'process.env.JWT_SECRET_KEY',
  apiDocsUsername: 'username',
  apiDocsPassword: 'password',
};

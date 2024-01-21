// Helper function for errors in signin.js and signup.js
module.exports = {
  getError(errors, prop) {
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      return "";
    }
  },
};

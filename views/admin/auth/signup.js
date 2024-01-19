const layout = require("../layout");

// Helper function for error
const getError = (error, prop) => {
  try {
    return error.mapped()[prop].msg;
  } catch (error) {
    return "";
  }
};

// Used Object destructuring below and not just 'req'  to note that it might be possible to want to recieve more than one argument. Which later happened
module.exports = ({ req, errors }) => {
  return layout({
    content: `
  <div>
    Your id is : ${req.session.userId}
    <form method="POST">
                <input name="email" type="email" placeholder="email">
                ${getError(errors, "email")}
                <input name="password" type="password" placeholder="password">
                ${getError(errors, "password")}
                <input name="passwordConfirmation" type="password" placeholder="password confirmation">
                ${getError(errors, "passwordConfirmation")}
                <button>Sign Up</button>
    </form>
  </div>
  `,
  });
};

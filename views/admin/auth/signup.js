const layout = require("../layout");
const { getError } = require("../../helpers");

// Used Object destructuring below and not just 'req'  to note that it might be possible to want to recieve more than one argument. Which later happened
module.exports = ({ req, errors }) => {
  return layout({
    content: `
    <div>
      Your id is: ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" type="email" />
        ${getError(errors, "email")}
        <input name="password" placeholder="password" type="password"/>
        ${getError(errors, "password")}
        <input name="passwordConfirmation" placeholder="password confirmation" type="password" />
        ${getError(errors, "passwordConfirmation")}
        <button>Sign Up</button>
      </form>
    </div>
  `,
  });
};

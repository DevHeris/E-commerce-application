// Used Object destructuring below and not just 'req'  to note that it might be possible to want to recieve more than one argument
module.exports = ({ req }) => {
  return `
    <div>
        Your id is : ${req.session.userId}
          <form method="POST">
                <input name="email" type="email" placeholder="email">
                <input name="password" type="password" placeholder="password">
                <input name="passwordConfirmation" type="password" placeholder="password confirmation">
                <button>Sign Up</button>
          </form>
    </div>
    `;
};

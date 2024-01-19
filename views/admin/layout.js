module.exports = ({ content }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
     <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-commerce App</title>
     </head>
     <body>
      ${content}
     </body>
    </html>
    `;
};

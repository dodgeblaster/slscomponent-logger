const http = require("./httpIO");

module.exports.hello = async (event, context, cb) => {
  console.log("Time: ", Date.now());
  return http.out({
    message: "hello"
  });
};

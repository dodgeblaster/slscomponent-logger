const http = {
  in: event => JSON.parse(event.body),

  out: data => ({
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify(data)
  }),

  error400: x => ({
    statusCode: 400,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(x)
  }),

  error500: x => ({
    statusCode: 500,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(x)
  })
};

module.exports = http;

const logger = (request, response, next) => {
  console.log(`Request Method: ${request.method}`);

  console.log(`Request Headers :${JSON.stringify(request.headers)}`);
  console.log(`Request Query :${JSON.stringify(request.query)}`);
  console.log(`Request Params :${JSON.stringify(request.params)}`);
  console.log(`Request Body :${JSON.stringify(request.body)}`);
  console.log(`Request Cookies :${JSON.stringify(request.cookies)}`);

  next();
};


module.exports = logger;
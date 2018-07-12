const https = require('https')

//Swiped from node docs: https://nodejs.org/api/http.html#http_http_get_options_callback
exports.retrieve = function(url) {
  return new Promise ((resolve, reject) => {
    https.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = `Request Failed.\nStatus Code: ${statusCode}`;
        //TODO IF 403, repo DNE
      } else if (!/^application\/json/.test(contentType)) {
        error = `Invalid content-type.\nExpected application/json but received ${contentType}`
      }

      if (error) {
        // consume response data to free up memory
        res.resume();
        reject(error);
      }

      let rawData = ''
      res.setEncoding('utf8');
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          resolve(rawData);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      reject(`Got error: ${e.message}`);
    });
  })
}

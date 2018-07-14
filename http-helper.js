const axios = require('axios')

//Promise wrapper cleans up usage
exports.retrieve = function(repoName, uagent) {
  return new Promise((resolve, reject) => {
    console.log(`Request issues from github for ${repoName}`)
    axios({
        method: 'get',
        baseURL: `https://api.github.com/repos/${repoName}/issues`,
        timeout: 10000,
        headers: { 'User-Agent': uagent },
        maxContentLength: 2000000
      })
      .then(response => {
        // console.log('Status: ' + response.status)
        // console.log('Data: ' + JSON.stringify(inspect(response.data)));
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      });
  })
}
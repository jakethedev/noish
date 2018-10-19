const axios = require('axios')

//Promise wrapper cleans up usage
exports.retrieve = function(repoName, uagent, maxCount) {
  return new Promise((resolve, reject) => {
    axios({
        method: 'get',
        baseURL: `https://api.github.com/repos/${repoName}/issues?per_page=${maxCount}`,
        timeout: 10000,
        headers: { 'User-Agent': uagent },
        maxContentLength: 2000000
      })
      .then(response => {
        // console.log('Status: ' + response.status)
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      });
  })
}
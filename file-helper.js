const fs = require('fs')
const { die } = require('./util')
const cacheFolder = require('os').homedir() + require('path').sep + ".noish"

prepareRepoName = function(repoName) {
  if (!repoName || repoName === true) {
    // The 'true' case is due to minimist, this catches cases of "noish -r" with no repo provided
    die(`ERR: No repo was provided, please use '-r user/repo' or cd into a local Github project`)
  }
  if (!fs.existsSync(cacheFolder)){
    try {
      fs.mkdirSync(cacheFolder)
    } catch (e) {
      die(`ERR: Could not create cache folder ${cacheFolder}! Check permissions on it maybe?\n\nStacktrace:\n${e}`)
    }
  }
  // Turn all slashes to underscores for happier saving
  let safeRepoName = repoName.replace(/[\/\\]+/g, '_')
  return `${cacheFolder}/${safeRepoName}.json`
}

// This should be the last call made if called, async is fine.
exports.writeCacheForRepo = function(jsonData, repoName) {
  const targetFile = prepareRepoName(repoName)
  const writeableData = JSON.stringify(jsonData)
  fs.writeFile(targetFile, writeableData, 'utf8', (err) =>{
    if (err) {
      console.log(`ERR: Something went wrong updating cache for ${repoName}!\n${err}`)
    } else {
      console.log(`Local cache for ${repoName} updated successfully!`)
    }
  });
}

// As the first call for several operations, sync is important here.
// Returning an empty array if there's a problem to represent no data
exports.readCacheForRepo = function(repoName) {
  const targetFile = prepareRepoName(repoName)
  if (fs.existsSync(targetFile)){
    let issuesRaw = fs.readFileSync(targetFile, 'utf8')
    return JSON.parse(issuesRaw)
  } else {
    return []
  }
}
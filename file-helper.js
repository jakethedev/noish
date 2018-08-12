const fs = require('fs')
const cacheFolder = require('os').homedir() + require('path').sep + ".noish";

prepareRepoName = function(repoName) {
  if (!fs.existsSync(cacheFolder)){
    try {
      fs.mkdirSync(cacheFolder)
    } catch (e) {
      console.log(`ERR: Could not create cache folder ${cacheFolder}! Stack:\n${e}`)
      process.exit(1)
    }
  }
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
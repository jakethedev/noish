const { execSync } = require('child_process')
const { die } = require('./util')

// Grab local remote info using system git for use when a repo param isn't provided
exports.getLocalRepoName = function() {
  let rawRemoteOutput;
  try {
    rawRemoteOutput = execSync(`git remote -v 2>/dev/null`).toString()
    if (!rawRemoteOutput.includes('github')){
      throw new Error()
    }
  } catch (err) {
    die('ERR: Only public Github repos (and *nix environments) are currently supported. Did you mean to use "-r user/repo"?')
  }
  //This is a bit wild, but works well enough, and might just work on windows too?
  let remoteUrl = rawRemoteOutput.split(/\s+/)[1]
  let repoName = remoteUrl.split(/[\/:]/).slice(-2).join('/').toLowerCase()
  return repoName
}

// Output full issue information
exports.printFullIssueById = function(issueId, issueCache){
  const issueById = issueCache.find((item) => item.number == issueId)
  if (issueById){
    console.log(exports.issueFullText(issueById))
  } else {
    die(`Issue ${issueId} not found locally - might be the cache, or it might not exist`)
  }
}

exports.username = function(){
  return 'user'
}

exports.issueSummaryText = function(issue) {
  let result = `#${issue.number} ${issue.title} `
  if (issue.milestone){
    result += `(milestone: '${issue.milestone.title}')`
  }
  return result
}

exports.issueFullText = function(issue) {
  let baseResult = exports.issueSummaryText(issue)
  baseResult += `\n\nDESC:\n${issue.body}\n`
  return baseResult
}

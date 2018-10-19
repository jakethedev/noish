const { execSync } = require('child_process')
const { die } = require('./util')

// Grab local remote info using system git for use when a repo param isn't provided
exports.getLocalRepoName = function() {
  let remoteOutput = undefined
  try {
    remoteOutput = execSync(`git remote -v | head -n 1`).toString()
    if (!remoteOutput.includes('github')){
       throw new Error('Only public Github repos are currently supported')
    }
    let remoteUrl = remoteOutput.split(/\s+/)[1]
    let repoName = remoteUrl.split(/[\/:]/).slice(-2).join('/').toLowerCase()
    return repoName
  } catch (err) {
    die(`Error parsing git remote [${remoteOutput}], message: '${err.message}' - please file an issue at jakethedev/noish`)
  }
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

// Simple utils to store off duped code
exports.die = function(msg, exitCode = 1){
  console.log(msg)
  process.exit(exitCode)
}

exports.issueSummaryText = function(issue) {
  return `#${issue.number} ${issue.title} [State: ${issue.state}]`
}

exports.issueFullText = function(issue) {
  return `#${issue.number}: ${issue.title} [State: ${issue.state}]\n\nBody:\n${issue.body}\n`
}
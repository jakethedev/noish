/*
noish: Node Issues Viewer, by @jakethedev

One thing and one thing well: This little app
will let you search and print info about github
issues for a project. To work correctly, you
have to call noish from inside a git repo, and
it handles the magic from there
*/

//Custom libs
const httphelper = require('./http-helper')
const filehelper = require('./file-helper')
const { die, issueSummaryText, issueFullText } = require('./util')
//Externals
const minimist = require('minimist')
//Stdlib
const { execSync } = require('child_process')
const { inspect } = require('util')
// For help command
const helptext = `Welcome to Noish v${process.env.npm_package_version}

Noish runs on the repo containing the current directory:
> \`noish command [option]\`.

You can override the repo for all repo-based commands with -r:
> \`noish -r username/reponame command [option]\`

Below is a list of commands Noish recognizes, both forms work the same:
  -h = --help, -f = --savefile, -i = --id, -l = --list, -r = --repo,
  -s = --search, and -u = --update

-h: Prints version and usage info then dies
-f $filepath: Force read or write from $filepath instead of ~/.noish/$repo.json
-i $id: Print detailed information about an issue with issue number $id for $repo
-l: List id, title, and status of $repo's cached issues
-r $override: Set $repo to a $override, must be in the form of 'username/reponame'
-s: Caseless search of local $repo cache by issue title and description
-u: Updates cache for $repo, there is no merge, it's a complete overwrite

Bug reports and feature requests go here: https://github.com/jakethedev/noish

Cheers :)
`

// Grab local remote info using system git when a reponame isn't provided
function getLocalRepoName() {
  let remoteOutput = undefined
  try {
    remoteOutput = execSync('git remote -v | head -n 1').toString()
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

// Returns data from github
async function updateLocalCache(repoName) {
  if (repoName) {
    console.log(`Updating noish cache for ${repoName}...`)
    return httphelper.retrieve(repoName, 'noish-cli').then((data) => {
      return data
    }).catch((err) => {
      die(`ERR: Either ${repoName} isn't on github or you don't have permission!\n${err}`)
    })
  } else {
    die(`Use the source, Luke (Err: this is not a public github repo)`)
  }
}

// Output full issue information
function printFullIssueById(issueId, issueCache){
  const issueById = issueCache.find((item) => item.number == issueId)
  if (issueById){
    console.log(issueFullText(issueById))
  } else {
    die(`Issue ${issueId} not found locally - might be the cache, or it might not exist`)
  }
}

// Search across titles and descriptions in the cache, case insensitive
function printSearchResultsOnCacheForInput(issueCache, searchInput = 'Egg') {
  let titleMatchOutput = [], descMatchOutput = [], cleanInput = searchInput.trim().toLowerCase()
  // Single pass to catch em all
  for (issue of issueCache) {
    let lowerTitle = issue.title.toLowerCase(), lowerDesc = issue.body.toLowerCase()
    if (lowerTitle.includes(cleanInput)){
      titleMatchOutput.push(issueSummaryText(issue))
    }
    if (lowerDesc.includes(cleanInput)){
      descMatchOutput.push(issueSummaryText(issue))
    }
  }
  // Print what we've got, if anything
  if (titleMatchOutput.length + descMatchOutput.length == 0) {
    console.log(`We got nothin', no issues found for that search input`)
  } else {
    console.log(`Results for '${searchInput}', use noish -i ID for more info:\n`)
    if (titleMatchOutput.length) {
      console.log(`TITLE MATCHES`)
      titleMatchOutput.map((data) => console.log(data))
      console.log()
    }
    if (descMatchOutput.length) {
      console.log(`DESCRIPTION MATCHES`)
      descMatchOutput.map((data) => console.log(data))
      console.log()
    }
  }
}

///////////////////
//  Send it
///////////////////
async function main(){
  let args = minimist(process.argv.slice(2), {
    alias: {
      h: 'help',
      f: 'savefile',
      i: 'id',
      l: 'list',
      r: 'repo',
      s: 'search',
      u: 'update'
    }
  })

  //Killer output brah
  if (args.help) {
    die(helptext)
  }

  const repoName = args.repo ? args.repo : getLocalRepoName()
  if (args.update) {
    // Smash and grab and cache
    let issueData = await updateLocalCache(repoName)
    console.log(`We found ${issueData.length} item(s) on github! Caching now...`)
    filehelper.writeCacheForRepo(issueData, repoName)
  } else {
    // Everything else relies on the issue cache, this else cleans things up
    const issueCache = filehelper.readCacheForRepo(repoName).sort((a,b) => a.number >= b.number)
    if (issueCache.length < 1) {
      die(`No local issues found for ${repoName}, make sure the repo is a public Github repo then try 'noish -u'`)
    }
    if (args.id) {
      printFullIssueById(args.id, issueCache)
    } else if (args.list) {
      for (issue of issueCache){
        console.log(issueSummaryText(issue))
      }
    } else if (args.search.length > 0) {
      printSearchResultsOnCacheForInput(issueCache, args.search)
    } else {
      console.log(`Command not recognized or your search was empty, noish -h for more info`)
    }
  }
}

// Lets us await like fancy people
main()

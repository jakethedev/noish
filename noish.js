/*
noish: Node Issues Viewer, by @jakethedev

One thing and one thing well: This little app
will let you search and print info about github
issues for a project. To work correctly, you
have to call noish from inside a git repo, and
it handles the magic from there
*/

//Custom libs
const { die } = require('./util')
const filehelper = require('./file-helper')
const gitHelper  = require('./git-helper')
const httphelper = require('./http-helper')
//Externals
const minimist = require('minimist')
// For help command
const helptext = `Welcome to Noish v${process.env.npm_package_version}

Noish runs on the repo containing the current directory:
> \`noish command [option]\`.

You can override the repo for all repo-based commands with -r:
> \`noish -r username/reponame command [option]\`

Below is a list of commands Noish recognizes, both forms work the same:
  -h/--help, -c/issueCount, -f/--savefile, -i/--id, -l/--list,
  -r/--repo, -s/--search, and -u/--update

-h: Prints version and usage info then dies
-c: Specifies issue count (for update only)
-f $filepath: Force read or write from $filepath instead of ~/.noish/$repo.json
-i $id: Print detailed information about an issue with issue number $id for $repo
-l: List id, title, and status of $repo's cached issues
-r $override: Set $repo to a $override, must be in the form of 'username/reponame'
-s: Caseless search of local $repo cache by issue title and description
-u: Updates cache for $repo, there is no merge, it's a complete overwrite. Defaults to 50 most recent open issues

Bug reports and feature requests go here: https://github.com/jakethedev/noish

Cheers :)
`

// Returns data from github
async function updateLocalCache(repoName, issueCount) {
  if (repoName) {
    console.log(`Updating noish cache for ${repoName} [up to ${issueCount} open issues]...`)
    return httphelper.retrieve(repoName, 'noish-cli', issueCount).then((data) => {
      return data
    }).catch((err) => {
      die(`ERR: Either ${repoName} isn't on github or you don't have permission!\n${err}`)
    })
  } else {
    die(`Use the source, Luke (Err: this is not a public github repo)`)
  }
}

// Search across titles and descriptions in the cache, case insensitive
function printSearchResultsOnCacheForInput(issueCache, searchInput) {
  let titleMatchOutput = [], descMatchOutput = [], cleanInput = searchInput.trim().toLowerCase()
  // Single pass to catch em all
  for (issue of issueCache) {
    let lowerTitle = issue.title.toLowerCase(), lowerDesc = issue.body.toLowerCase()
    if (lowerTitle.includes(cleanInput)){
      titleMatchOutput.push(gitHelper.issueSummaryText(issue))
    }
    if (lowerDesc.includes(cleanInput)){
      descMatchOutput.push(gitHelper.issueSummaryText(issue))
    }
  }
  // Print what we've got, if anything
  if (titleMatchOutput.length + descMatchOutput.length == 0) {
    console.log(`We got nothin', no issues found matching your search`)
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

////////////////////////////////////////////
//  Send it - async'd to work with promises
////////////////////////////////////////////
async function main(){
  let args = minimist(process.argv.slice(2), {
    alias: {
      c: 'issueCount',
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

  const repoName = args.repo ? args.repo : gitHelper.getLocalRepoName()
  if (args.update) {
    // Smash and grab, sort and cache
    let issueCount = args.issueCount ? args.issueCount : 50 // Sane default issue number
    let issueData = await updateLocalCache(repoName, issueCount)
    let sortedIssues = issueData.sort((a,b) => a.number >= b.number)
    console.log(`We found ${issueData.length} item(s) on github! Caching now...`)
    filehelper.writeCacheForRepo(issueData, repoName)
  } else {
    // Everything else relies on the issue cache, this else cleans things up
    const issueCache = filehelper.readCacheForRepo(repoName)
    if (issueCache.length < 1) {
      die(`No local issues found for ${repoName}, make sure the repo is a public Github repo then try 'noish -u'`)
    }
    if (args.id) {
      gitHelper.printFullIssueById(args.id, issueCache)
    } else if (args.list) {
      for (issue of issueCache){
        console.log(gitHelper.issueSummaryText(issue))
      }
    } else if (args.search && args.search.length > 0) {
      printSearchResultsOnCacheForInput(issueCache, args.search)
    } else {
      console.log(`Command not recognized or your search was empty, noish -h for more info`)
    }
  }
}

// Lets us await like fancy people
main()

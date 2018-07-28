/*
noish: Node Issues Viewer, by @jakethedev

One thing and one thing well: This little app
will let you search and print info about github
issues for a project. To work correctly, you
have to call noish from inside a git repo, and
it handles the magic from there
*/

//Util
const httphelper = require('./http-helper')
//Externals
const minimist = require('minimist')
//Stdlib
const { execSync } = require('child_process')
const { inspect } = require('util')

//Grab local remote info using system git, tries to provide clear output on failure events
function getLocalRepoName() {
  let remoteOutput = undefined
  try {
    remoteOutput = execSync('git remote -v | head -n 1').toString()
    let remoteUrl = remoteOutput.split(/\s+/)[1]
    let repoName = remoteUrl.split(/[\/:]/).slice(-2).join('/').toLowerCase()
    return repoName
  } catch (err) {
    console.log(`Error parsing git remote [${remoteOutput}], message: '${err.message}' - please file an issue at jakethedev/noish`)
    process.exit(1)
  }
}

//Sets local cache-per-repo with updated github data
function updateLocalCache(repoName, cacheFilePath) {
  if (repoName) {
    console.log(`Updating noish cache for ${repoName}...`)
    httphelper.retrieve(repoName, 'noish-cli').then((data) => {
      // console.log(`Data got: \n${JSON.stringify(data)}`)
      //TODO Write to file here.
      console.log('Data is got. TODO: Write to a repo-specific cache file')
    }).catch((err) => {
      console.log(err.message + ` (either ${repoName} isn't on github or you don't have permission)`)
      process.exit(1)
      //TODO Simplify error output and exit process
    })
  } else {
    console.log(`Find the source, luke (this is not a git repo)`)
  }
}

///////////////////
//  noish.main()
///////////////////

let args = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    f: 'savefile',
    i: 'id',
    l: 'list',
    r: 'repo',
    s: 'search',
    u: 'update'
  }
})

//Simple output commands first
if (args.help) {
  console.log('Have a help')
} else if (args.version) {
  console.log('Noish v1.0!')
} else {
  const cacheFilePath = args.savefile ? args.savefile : './cache.json'
  const repoName = args.repo ? args.repo : getLocalRepoName()
  if (args.update) {
    updateLocalCache(repoName, cacheFilePath)
  } else if (args.id) {
    console.log(`Printing issue #${args.id} within (${cacheFilePath})`)
    //TODO Open cache and lookie
  } else if (args.list) {
    console.log(`Listing issues within (${cacheFilePath})`)
    //TODO Open cache and lookie
  } else if (args.search) {
    console.log(`Searching locally (${cacheFilePath}) for issues matching '${args.search}' in ${repoName}`)
    //TODO Open cache and lookie
  }
}
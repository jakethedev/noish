/*
nish: Node Issues Viewer, by @jakethedev

One thing and one thing well: This little app
will let you search and print info about github
issues for a project. To work correctly, you
have to call nish from inside a git repo, and
it handles the magic from there
*/

//Util
const httphelper = require('./http-helper')
//Externals
const minimist = require('minimist')
//Stdlib
const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function remotes(args) {
  const { stdout, stderr } = await exec('git remote -v | head -n 1')
  if (stderr) {
    console.log(`stderr: ${stderr}`)
    exit(1)
  }
  let fetchRemote = stdout.split(/\s+/)[1]
  let repoName = fetchRemote.split(/[\/:]/).slice(-2).join('/')
  console.log(`Issues for ${repoName}`)
  httphelper.retrieve(repoName, 'jakethedev/nish').then((data) => {
    console.log(`Data got: \n${JSON.stringify(data)}`)
  }).catch((err) => {
    console.log(err)
  })
}

function main() {
  let args = minimist(process.argv.slice(2), {
    alias: {
      h: 'help',
      v: 'version',
      d: 'directory'
    }
  })
  if (args.help) {
    console.log('Have a help')
  } else if (args.version) {
    console.log('v1.0!')
  } else {
    //TODO Parse args here
    remotes(args)
  }
}

main()
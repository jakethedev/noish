/*
nish: Node Issues Viewer, by @jakethedev

One thing and one thing well: This little app
will let you search and print info about github
issues for a project. To work correctly, you
have to call nish from inside a git repo, and
it handles the magic from there
*/
const request = require('request');
const git = require('simple-git')() //Assuming cwd is in git

async function getRemotes() {
  let results;
  await git.getRemotes(true, (err, data) => {
    if (err){
      console.log(err)
    } else {
      results = data
    }
  })
  return results
}

getRemotes().then(remotes => {
  const repoId = remotes[0].refs.fetch.split('/').filter((val) => val).slice(-2).join('/')
  console.log(`Issues for ${repoId}:`)
  //http.get(theThing) //use args somehow
})

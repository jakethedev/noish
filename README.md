# Noish: The Github Issue Viewer

Let's cut out the noise and just see what needs done today. Noish is here to help! I built it to hit public github repos for issues and store them locally, so you can list them out or search through them by title or description. Currently only tested on Ubuntu, but this should work on any system with Node 8+ installed

## Usage

Noish works best globally installed. Make sure you have node 8+, then give it a whirl with `npm install --global noish`, and if your path is set up correctly, `noish -h` should work for you after that.

Noish runs on the repo containing the current directory: `noish command [option]`. You can override the repo Noish looks at for all repo-based commands with -r: `noish -r username/reponame command [option]`

Below is a list of commands Noish recognizes. Each is in shorthand but can be spelled out: *-h/--help, -c/--issueCount, -f/--savefile, -i/--id, -l/--list, -r/--repo, -s/--search, and -u/--update*

- -h: Prints version and usage info
- -f $filepath: Force read or write from $filepath instead of ~/.noish/$repo.json
- -i $id: Print detailed information about an issue with issue number $id for $repo
- -l: List id, title, and status of $repo's cached issues
- -r $override: Set $repo to $override, must be in the form of 'username/reponame'
- -s: Caseless search of local $repo cache by issue title and description
- -u: Updates cache for $repo. Currently there is no merge, it rewrites the local cache. Defaults to 50 most recent open issues

## Development

There's not much to know. Just make sure you're running node 8+, and if you add anything to this repo or a fork, please make sure to keep minimal dependencies in mind. Axios is really tiny compared to requests, for instance, and minimalism is important here

## Comments, suggestions, feature requests, and feedback

[Drop me an issue](https://github.com/jakethedev/noish/issues) or ping me [on Twitter](https://twitter.com/jakethedev_)


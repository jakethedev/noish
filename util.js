// Simple utils to store off duped code
exports.die = function(msg, exitCode = 1){
  console.log(msg)
  process.exit(exitCode)
}

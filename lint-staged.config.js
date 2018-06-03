const tasks = [
  'prettier --single-quote --no-semi --trailing-comma=all --write',
  'git add',
]

module.exports = {
  'src/**/*.js': tasks,
  'test/index.test.js': tasks,
  'test/**/code.js': tasks,
  '*.md': tasks,
}

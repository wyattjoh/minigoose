workflow "Lint and test" {
  on = "push"
  resolves = ["Build"]
}

action "Build" {
  uses = "actions/npm@master"
  args = "install"
}

action "Lint" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "run lint"
}

action "Master" {
  needs = "Lint"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Publish" {
  uses = "actions/npm@master"
  needs = "Master"
  args = "publish"
}


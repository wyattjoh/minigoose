workflow "Lint and Publish" {
  on       = "push"

  resolves = [
    "Publish"
  ]
}

action "Build" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Lint" {
  needs = "Build"
  uses  = "Borales/actions-yarn@master"
  args  = "lint"
}

action "Test" {
  needs = "Build"
  uses  = "Borales/actions-yarn@master"
  args  = "test"
}

# Filter for master branch
action "Master" {
  uses  = "actions/bin/filter@master"
  args  = "branch master"

  needs = [
    "Lint",
    "Test"
  ]
}

action "Publish" {
  needs   = "Master"
  uses    = "Borales/actions-yarn@master"
  args    = "publish"

  secrets = [
    "NPM_AUTH_TOKEN"
  ]
}

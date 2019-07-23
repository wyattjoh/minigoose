workflow "Lint and test" {
  on = "push"
  resolves = ["GitHub Action for npm-1"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "lint"
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@0dbb077f64d0ec1068a644d25c71b1db66148a24"
  needs = ["GitHub Action for npm"]
  args = "branch master"
}

action "GitHub Action for npm-1" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Filters for GitHub Actions"]
  args = "publish"
  env = {
    NPM_AUTH_TOKEN = "3647cd9f-508b-4f57-9f80-486c4bd42451"
  }
}

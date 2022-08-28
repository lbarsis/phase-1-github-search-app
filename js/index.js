document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#github-form')
  const input = document.querySelector('#search')
  const userList = document.querySelector('#user-list')
  const searchRepoButton = document.createElement('button')

  searchRepoButton.textContent = 'Search Repos'
  searchRepoButton.id = 'toggle-search'
  form.appendChild(searchRepoButton)

  let searchUsers = true

  // main form that searches GitHub's API for users or repos based on users requirements
  form.addEventListener('submit', e => {
    e.preventDefault()
    const inputField = input.value
    if (searchUsers) {
      fetch(`https://api.github.com/search/users?q=${inputField}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      })
      .then(resp => resp.json())
      .then(getUserName)
      .catch(error => {
        alert(error)
      })
    } else {
      fetch(`https://api.github.com/search/repositories?q=${inputField}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      })
      .then(resp => resp.json())
      .then(getRepositories)
      .catch(error => {
        alert(error)
      })
    }

    // Toggles between searching Users and Repos
    searchRepoButton.addEventListener('click',() => {
      const toggle = document.querySelector('#toggle-search')
      if (searchUsers) {
        toggle.textContent = 'Search Users'
        searchUsers = false
      } else {
        toggle.textContent = 'Search Repos'
        searchUsers = true
      }
    })
  })

  function getRepositories(repos) {
    removeAllChildNodes(userList)
    const header = document.createElement('h2')
    header.textContent = `Github repos that contain: ${input.value}`
    userList.append(header)

    for (let repo of repos.items) {
      
      const repoData = document.createElement('li')
      repoData.classList.add('repo-name')
      repoData.id = repo.name
      repoData.textContent = repo.name

      userList.appendChild(repoData)
    }
    form.reset()
  }

  function getUserName(users) {
    removeAllChildNodes(userList)
    const userNameHeader = document.createElement('h2')
    userNameHeader.textContent = `Github users that contain: ${input.value}`
    userList.append(userNameHeader)

    for (let user of users.items) {
      const userData = document.createElement('li')
      userData.classList.add('user-name')
      userData.id = user.login
      userData.textContent = user.login

      userList.appendChild(userData)
      

      userData.addEventListener('click', () => {
        fetch(`https://api.github.com/users/${user.login}/repos`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        })
        .then(resp => resp.json())
        .then(repos => {
          removeAllChildNodes(userList)

          const userNameHeader = document.createElement('h2')
          userNameHeader.textContent = `${user.login}'s Repositories`
          userList.append(userNameHeader)

          repos.forEach(repo => {
            const userRepos = document.createElement('li')
            userRepos.classList.add('user-repos')
            userRepos.id = repo.name
            userRepos.textContent = repo.name
      
            userList.appendChild(userRepos)
          })
        })
      })
    }
    form.reset()
  }

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  }
})
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#github-form')
  const input = document.querySelector('#search')
  const userList = document.querySelector('#user-list')
  const reposList = document.querySelector('#repos-list')
  const githubContainer = document.querySelector('#github-container')

  form.addEventListener('submit', e => {
    e.preventDefault()
    const user = input.value
    fetch(`https://api.github.com/search/users?q=${user}`)
    .then(resp => resp.json())
    .then(getUserName)

  })

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
        fetch(`https://api.github.com/users/${user.login}/repos`)
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
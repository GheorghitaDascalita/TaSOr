const onNavigate = (pathname) => {
    window.history.pushState(
      {},
      pathname,
      window.location.origin + pathname
    )
  
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].pathname === pathname) {
        const target = document.getElementById("target")
        target.innerHTML = routes[i].htmlTemplate
        let jsScript = document.createElement('script');
        jsScript.innerHTML = routes[i].controller;
        target.appendChild(jsScript);
      }
    }
  }

const onLogout = () => {
  fetch("http://localhost:3000/logout",
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
    }).then((res) => {
      console.log(res)
    })
}
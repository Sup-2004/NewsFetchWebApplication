const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

if (showSignup) {
  showSignup.onclick = () => { loginForm.style.display="none"; signupForm.style.display="block"; };
  showLogin.onclick = () => { signupForm.style.display="none"; loginForm.style.display="block"; };
}

if (signupForm) {
  signupForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = signupEmail.value;
    const pass = signupPassword.value;
    const selected = [...document.querySelectorAll(".interest-tags input:checked")].map(i=>i.value);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPass", pass);
    localStorage.setItem("nf_user_interests", JSON.stringify(selected));
    alert("Account created! Please login.");
    signupForm.style.display="none"; loginForm.style.display="block";
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = loginEmail.value;
    const pass = loginPassword.value;
    if(email === localStorage.getItem("userEmail") && pass === localStorage.getItem("userPass")){
      localStorage.setItem("nf_logged_in", "true");
      window.location="news.html";
    } else alert("Invalid credentials");
  });
}


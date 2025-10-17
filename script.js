const showSignup=document.getElementById("showSignup");
const showLogin=document.getElementById("showLogin");
const loginForm=document.getElementById("loginForm");
const signupForm=document.getElementById("signupForm");

if(showSignup){
  showSignup.onclick=()=>{loginForm.style.display="none";signupForm.style.display="block";}
  showLogin.onclick=()=>{signupForm.style.display="none";loginForm.style.display="block";}
}

if(signupForm){
  signupForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    localStorage.setItem("userEmail",signupEmail.value);
    localStorage.setItem("userPass",signupPassword.value);
    alert("Account created! Please login.");
    signupForm.style.display="none";loginForm.style.display="block";
  });
}

if(loginForm){
  loginForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const email=loginEmail.value,pass=loginPassword.value;
    if(email===localStorage.getItem("userEmail")&&pass===localStorage.getItem("userPass")){
      localStorage.setItem("loggedIn","true");
      window.location="news.html";
    }else alert("Invalid credentials");
  });
}

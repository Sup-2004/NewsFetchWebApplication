// auth.js
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

if (showSignup)
  showSignup.addEventListener('click', e => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  });

if (showLogin)
  showLogin.addEventListener('click', e => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  const pass = document.getElementById('signupPassword').value;
  const checked = Array.from(document.querySelectorAll('.interest-tags input:checked')).map(cb => cb.value);

  if (!email || pass.length < 6) return alert('Enter valid credentials.');
  if (checked.length === 0) return alert('Select at least one interest.');

  localStorage.setItem('nf_user_email', email);
  localStorage.setItem('nf_user_pass', pass);
  localStorage.setItem('nf_user_interests', JSON.stringify(checked));
  localStorage.setItem('nf_logged_in', '1');

  // Optional EmailJS Welcome Email
  if (window.emailjs) {
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      to_email: email,
      subject: "Welcome to NewsFetch Pro",
      message: `Hi ${email.split('@')[0]}, you've subscribed to ${checked.join(', ')} updates!`
    });
  }

  alert('Account created! Redirecting...');
  location.href = 'news.html';
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const storedEmail = localStorage.getItem('nf_user_email');
  const storedPass = localStorage.getItem('nf_user_pass');

  if (email === storedEmail && pass === storedPass) {
    localStorage.setItem('nf_logged_in', '1');
    location.href = 'news.html';
  } else alert('Invalid credentials.');
});

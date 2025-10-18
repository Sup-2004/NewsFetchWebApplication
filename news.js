const NEWS_API_KEY = "576f2e330db841ec902261a3a331a37c";
const newsContainer = document.getElementById('newsContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const logoutBtn = document.getElementById('logoutBtn');
const toggleThemeBtn = document.getElementById('toggleTheme');
const favoritesBtn = document.getElementById('favoritesBtn');
const statusMessage = document.getElementById('statusMessage');
const categoryBar = document.getElementById('categoryBar');

if(!localStorage.getItem('nf_logged_in')) location.href='index.html';

const categories = ['general','technology','business','sports','health','science','entertainment'];

categories.forEach((c,i)=>{
  const btn = document.createElement('button');
  btn.className = 'category-btn' + (i===0?' active':'');
  btn.textContent = c[0].toUpperCase()+c.slice(1);
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.category-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    fetchTopHeadlines(c);
  });
  categoryBar.appendChild(btn);
});

logoutBtn.addEventListener('click',()=>{
  localStorage.removeItem('nf_logged_in');
  location.href='index.html';
});

toggleThemeBtn.addEventListener('click',()=>{
  document.body.classList.toggle('dark-mode');
  toggleThemeBtn.textContent = document.body.classList.contains('dark-mode')?'☀️':'🌙';
});

favoritesBtn.addEventListener('click', showFavorites);
searchBtn.addEventListener('click', ()=>{if(searchInput.value.trim()) searchEverything(searchInput.value.trim())});
searchInput.addEventListener('keypress', e=>{if(e.key==='Enter') searchEverything(searchInput.value.trim())});

async function fetchTopHeadlines(category='general'){
  showMessage('Loading...');
  try{
    const realUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=12&apiKey=${NEWS_API_KEY}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(realUrl)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();
    if(data.status!=='ok') return showMessage('Error: '+data.message);
    renderArticles(data.articles);
    showMessage('');
  }catch(e){showMessage('Network error.')}
}

async function searchEverything(query){
  showMessage(`Searching "${query}"...`);
  try{
    const realUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=12&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(realUrl)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();
    if(data.status!=='ok') return showMessage('Error: '+data.message);
    renderArticles(data.articles);
    showMessage('');
  }catch(e){showMessage('Error loading search results.')}
}

function renderArticles(articles){
  newsContainer.innerHTML='';
  const tpl = document.getElementById('cardTemplate');
  if(!articles || articles.length===0) return showMessage('No articles found.');
  articles.forEach(article=>{
    const clone = tpl.content.cloneNode(true);
    const img = clone.querySelector('.card-img');
    const title = clone.querySelector('.card-title');
    const desc = clone.querySelector('.card-desc');
    const readBtn = clone.querySelector('.read-btn');
    const favBtn = clone.querySelector('.fav-btn');

    img.src = article.urlToImage||'https://via.placeholder.com/400x200?text=No+Image';
    title.textContent = article.title||'';
    desc.textContent = article.description||'';
    readBtn.href = article.url;

    favBtn.addEventListener('click',()=>toggleFavorite(article,favBtn));
    newsContainer.appendChild(clone);
  });
}

function toggleFavorite(article,btn){
  const favs = JSON.parse(localStorage.getItem('nf_favs')||'[]');
  const exists = favs.find(f=>f.url===article.url);
  if(exists){
    localStorage.setItem('nf_favs',JSON.stringify(favs.filter(f=>f.url!==article.url)));
    btn.textContent='☆';
  }else{
    favs.unshift(article);
    localStorage.setItem('nf_favs',JSON.stringify(favs));
    btn.textContent='★';
  }
}

function showFavorites(){
  const favs = JSON.parse(localStorage.getItem('nf_favs')||'[]');
  if(!favs.length) return showMessage('No favorites yet.');
  renderArticles(favs);
}

function showMessage(msg){
  statusMessage.hidden = !msg;
  statusMessage.textContent = msg;
}

function showNotification(msg){
  const box = document.getElementById('notificationBox');
  const text = document.getElementById('notificationText');
  text.textContent='🔔 '+msg;
  box.hidden=false;
  setTimeout(()=>box.hidden=true,5000);
}

// Personalized feed
const interests = JSON.parse(localStorage.getItem('nf_user_interests')||'[]');
if(interests.length>0){
  fetchTopHeadlines(interests[0]);
  setTimeout(()=>showNotification(`New articles in ${interests.join(', ')}`),4000);
}else fetchTopHeadlines('general');


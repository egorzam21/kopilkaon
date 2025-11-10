
// Common script for multi-page site: auth via localStorage, UTM capture, data-event pushes
(function(){
  'use strict';
  const AUTH_KEY = 'kopilka_auth_v1';

  // Utilities
  function $(sel){return document.querySelector(sel)}
  function $all(sel){return Array.from(document.querySelectorAll(sel))}

  // Auth helpers
  function isAuthenticated(){ return !!localStorage.getItem(AUTH_KEY) }
  function getUser(){ try{ return JSON.parse(localStorage.getItem(AUTH_KEY)) }catch(e){return null} }
  function loginUser(user){ localStorage.setItem(AUTH_KEY, JSON.stringify(user)); dispatchAuthChange(); }
  function logoutUser(){ localStorage.removeItem(AUTH_KEY); dispatchAuthChange(); }

  function dispatchAuthChange(){ document.dispatchEvent(new CustomEvent('authchange')) }

  // DOM init (if present)
  document.addEventListener('DOMContentLoaded', function(){
    // Navigation active link
    $all('nav a').forEach(a=>{
      if(location.pathname.endsWith(a.getAttribute('href')) || (location.pathname==='/' && a.getAttribute('href').endsWith('index.html'))){
        a.classList.add('active')
      }
      // append UTM params to register links if present in current location
      const utm = getStoredUtm();
      if(utm && a.dataset.utmAppend==='true'){
        const url = new URL(a.href, location.origin);
        Object.keys(utm).forEach(k=> url.searchParams.set(k, utm[k]));
        a.href = url.toString();
      }
    });

    // Hook auth UI (if present)
    const authButtons = $('#auth-buttons');
    const userInfo = $('#user-info');
    const userName = $('#user-name');
    if(authButtons && userInfo){
      function refresh(){
        if(isAuthenticated()){
          const u = getUser();
          authButtons.classList.add('hidden');
          userInfo.classList.remove('hidden');
          userName.textContent = u && u.name? u.name : u.email.split('@')[0];
        } else {
          authButtons.classList.remove('hidden');
          userInfo.classList.add('hidden');
        }
      }
      refresh();
      document.addEventListener('authchange', refresh);
    }

    // Forms
    const loginForm = $('#login-form');
    if(loginForm){
      loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const email = (this.querySelector('[name="email"]').value || '').trim();
        const user = {name: email.split('@')[0], email: email, created: Date.now()};
        loginUser(user);
        // redirect back to origin or home
        const back = new URLSearchParams(location.search).get('back') || 'index.html';
        location.href = back;
      });
    }

    const registerForm = $('#register-form');
    if(registerForm){
      registerForm.addEventListener('submit', function(e){
        e.preventDefault();
        const name = (this.querySelector('[name="name"]').value || '').trim();
        const email = (this.querySelector('[name="email"]').value || '').trim();
        const user = {name: name || email.split('@')[0], email: email, created: Date.now()};
        loginUser(user);
        const back = new URLSearchParams(location.search).get('back') || 'index.html';
        location.href = back;
      });
    }

    const logoutBtn = $('#logout-btn');
    if(logoutBtn) logoutBtn.addEventListener('click', function(){ logoutUser(); location.href='index.html' })

    // Protected page behavior
    const protectedWrappers = $all('[data-protected="true"]');
    if(protectedWrappers.length){
      if(!isAuthenticated()){
        // show protected message and provide login redirect
        protectedWrappers.forEach(w=>{
          w.innerHTML = `<div class="protected"><h3>Доступ ограничен</h3><p>Для доступа необходимо войти в систему.</p><p style="margin-top:12px"><a class="btn btn-primary" id="to-login" href="login.html?back=${encodeURIComponent(location.pathname.split('/').pop())}" data-event="click_login_from_protected">Войти</a></p></div>`
        })
      }
    }

    // Data-event wiring: simple console push; in real-world integrate with analytics
    $all('[data-event]').forEach(el=>{
      el.addEventListener('click', function(e){
        const ev = this.dataset.event;
        try{ window.dataLayer = window.dataLayer || []; window.dataLayer.push({event:ev, href: location.href}) }catch(err){}
        console.log('Event:', ev);
      });
    });

    // Capture UTM params on first load and store for session
    captureUtmToSession();

  }); // DOMContentLoaded

  // UTM functions
  function captureUtmToSession(){
    const params = new URLSearchParams(location.search);
    const utmKeys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
    const found = {};
    utmKeys.forEach(k=>{ if(params.get(k)){ found[k]=params.get(k) } });
    if(Object.keys(found).length){
      sessionStorage.setItem('kopilka_utm', JSON.stringify(found));
    }
  }
  function getStoredUtm(){ try{ return JSON.parse(sessionStorage.getItem('kopilka_utm')||'null') }catch(e){return null} }

  // Expose helpers to window for debugging
  window.kopilka = { isAuthenticated, getUser, loginUser, logoutUser, getStoredUtm }
})();

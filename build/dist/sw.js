if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const d=e=>n(e,o),c={module:{uri:o},exports:t,require:d};i[o]=Promise.all(s.map((e=>c[e]||d(e)))).then((e=>(r(...e),t)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CagbndLb.css",revision:null},{url:"assets/index-WZOkFPBv.js",revision:null},{url:"index.html",revision:"116ea3fa29ab3d1510a26aa3255028d7"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/icon-192x192.png",revision:"0cdb0fd93dd2b7836a5281181c8f6004"},{url:"icons/icon-512x512.png",revision:"0cdb0fd93dd2b7836a5281181c8f6004"},{url:"manifest.webmanifest",revision:"e56c5cbbec046f075607b47e5298983d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

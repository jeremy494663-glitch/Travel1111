const gijangSource='https://www.visitbusan.net/index.busan?lang_cd=en&menuCd=DOM_000000303011001000&uc_seq=292';
const gijangPlace={id:'gijang-market',name:'機張市場吃海鮮',en:'GIJANG MARKET',area:'機張郡',cat:'美食',img:null,ko:'기장시장',desc:'逛機張市場，挑一餐當日海鮮或蒸蟹。先確認重量、每公斤價格、料理與座位費，再決定點餐。'};
if(!places.some(p=>p.id===gijangPlace.id))places.push(gijangPlace);
coordinates['gijang-market']=[35.24384,129.21512];
routeSeeds[2]=['hotel','yonggungsa','gijang-market','hotel'];
const gijangMealNote='海鮮／蒸蟹依當日時價。先確認重量、每公斤價格、料理費、座位費及總價；可選熟食。每人 ₩40,000 為規劃預留，不是店家報價。';
if(!state.gijangMarketAdded){
  if(!state.days.flat().some(s=>s.place==='gijang-market'||/機張市場/.test(s.name))){
    state.days[2].push({id:Date.now(),time:'13:30',name:gijangPlace.name,note:'龍宮寺後搭車前往，非步行串接。'+gijangMealNote,cat:'美食',place:'gijang-market'});
    state.days[2].sort((a,b)=>a.time.localeCompare(b.time));
  }
  const meals=state.logistics.meals[2];
  if(!meals.some(m=>/機張市場/.test(m.name))){const old=meals.findIndex(m=>m.name==='機張／松亭午餐');const m={time:'13:30',name:gijangPlace.name,note:gijangMealNote,cost:40000,place:'gijang-market'};if(old>=0)meals[old]=m;else meals.push(m);}
  const marketStop=state.days[2].find(s=>s.place==='gijang-market');if(marketStop&&!marketStop.logKey)marketStop.logKey='meals-2-'+meals.findIndex(m=>/機張市場/.test(m.name));
  const t=state.logistics.transport[2].find(t=>t.name==='南浦 → 海東龍宮寺 → 南浦');
  if(t){t.name='南浦 → 海東龍宮寺 → 機張市場 → 南浦';t.note='先往海東龍宮寺，結束後用下方地圖查往機張市場的公車或計程車，兩地非步行串接；行程自訂預留 45–75 分鐘轉乘。回程從市場步行至東海線機張站，往釜田方向，依當日導航轉乘回住宿。費用為每人公共交通預留，若搭計程車另計。';t.cost=15000;}
  state.gijangMarketAdded=true;try{localStorage.setItem('busan-days-v1',JSON.stringify(state))}catch{}
}
function googlePlace(q){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)}
function googleLeg(a,b){return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(coordinates[a].join(','))+'&destination='+encodeURIComponent(coordinates[b].join(','))+'&travelmode=transit'}
function marketTwd(){return money(Math.round(40000/(state.krwPerTwd||40)))}
const gijangCard=document.createElement('section');gijangCard.className='gijang-card';gijangCard.innerHTML=`<div class="eyebrow">GIJANG SEAFOOD MARKET</div><h2>機張市場，留一餐給海鮮。</h2><p>建議 Day 3：海東龍宮寺 → 搭車 → 機張市場海鮮午餐 → 返回住宿。市場新增至行程與餐食預算，時間可在行程頁修改。</p><div class="gijang-facts"><span>東海線・機張站 1 號出口<br><b>步行約 6 分鐘</b></span><span>海鮮／蒸蟹依時價<br><b id="gijang-twd"></b></span></div><p>市場韓文：기장시장<br>地址：부산 기장군 기장읍 읍내로104번길 16<br>各攤營業與供應不同，出發前請查目的店家。</p><p>先問總價：活體重量、每公斤單價、料理費、座位費、加點與結帳總額。機張市場與札嘎其市場是不同地點。</p><div class="gijang-actions"><a class="outline" href="https://map.naver.com/p/search/${encodeURIComponent('기장시장 부산')}" target="_blank" rel="noopener">NAVER Map ↗</a><a class="outline" href="${googlePlace('기장시장 부산')}" target="_blank" rel="noopener">Google Maps ↗</a><button class="primary" data-gijang-day>查看 Day 3 行程</button><a href="${gijangSource}" target="_blank" rel="noopener">Visit Busan 官方市場介紹 ↗</a></div><small>交通及特色查核：2026/11/20。每人預留 ₩40,000 是 App 自訂預算；台幣按手動規劃匯率換算，非即時報價。</small>`;
$('#home-view .discover').before(gijangCard);
const marketExplore=gijangCard.cloneNode(true);marketExplore.removeAttribute('id');marketExplore.querySelector('#gijang-twd').removeAttribute('id');$('#food-section .food-intro').after(marketExplore);
function updateMarketBudget(){for(const box of [gijangCard,marketExplore])box.querySelector('.gijang-facts span:last-child b').textContent=`每人暫留約 NT$${marketTwd()}`;}
function enhanceGoogleLinks(){
  for(const host of [$('#food-list'),$('#saved-food-list')])if(host)for(const article of host.querySelectorAll('.food-card')){if(article.querySelector('[data-google-map]'))continue;const p=foodPicks.find(p=>p.name===article.querySelector('h3')?.textContent);if(p){const a=document.createElement('a');a.dataset.googleMap='true';a.className='outline';a.href=googlePlace(p.query);a.target='_blank';a.rel='noopener';a.textContent='Google Maps ↗';article.querySelector('.food-actions').append(a);}}
  for(const article of $$('#hotel-cards .hotel-card')){if(article.querySelector('[data-google-map]'))continue;const h=hotelOptions.find(h=>h.name===article.querySelector('h2')?.textContent);if(h){const a=document.createElement('a');a.dataset.googleMap='true';a.href=googlePlace(h.kr+' '+h.address);a.target='_blank';a.rel='noopener';a.textContent='Google Maps 找飯店 ↗';article.querySelector('.hotel-detail-links').append(a);}}
  updateMarketBudget();
}
const mapsPriorRoute=renderNaverRoute;renderNaverRoute=function(){mapsPriorRoute();const ids=routeItems();$('#route-map').insertAdjacentHTML('beforeend','<p class="dual-map-note">雙地圖：每站可用 NAVER Map 或 Google Maps 查看；各段交通請點選對應導航，依當日班次安排。</p>');const rows=$$('#route-stops>.route-stop');rows.forEach((row,i)=>{const id=ids[i];if(!id)return;row.insertAdjacentHTML('beforeend',`<a href="${googlePlace(naverQuery(id)+' 부산')}" target="_blank" rel="noopener" class="google-map-link">Google 地點 ↗</a>${i<ids.length-1?`<a href="${googleLeg(id,ids[i+1])}" target="_blank" rel="noopener" class="google-map-link">Google 搭車 ↗</a>`:''}`)});const scheduled=state.days[day].filter(s=>s.foodId);for(const s of scheduled){const p=foodPicks.find(p=>p.id===s.foodId);if(p)$('#route-stops .food-route-meals')?.insertAdjacentHTML('beforeend',`<a href="${googlePlace(p.query)}" target="_blank" rel="noopener">Google Maps・${esc(p.name)} ↗</a>`);}};
const mapsPriorDetail=detail;detail=function(id){mapsPriorDetail(id);const p=places.find(p=>p.id===id);if(p)$('#modal-body .detail-links').insertAdjacentHTML('beforeend',`<a href="${googlePlace(p.ko+' 부산')}" target="_blank" rel="noopener">在 Google Maps 開啟 ↗</a>`);if(id==='gijang-market')$('#modal-body .detail-links').insertAdjacentHTML('beforeend',`<a href="${gijangSource}" target="_blank" rel="noopener">官方市場資訊 ↗</a>`)};
const mapsPriorFood=renderFood;renderFood=function(){mapsPriorFood();enhanceGoogleLinks()};
const mapsPriorHotels=renderHotels;renderHotels=function(){mapsPriorHotels();enhanceGoogleLinks()};
const mapsPriorRender=render;render=function(){mapsPriorRender();enhanceGoogleLinks()};
document.addEventListener('click',e=>{if(e.target.closest('[data-gijang-day]')){day=2;show('route')}});
render();

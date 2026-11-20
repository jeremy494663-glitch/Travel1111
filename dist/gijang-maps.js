const gijangSource='https://www.visitbusan.net/index.busan?lang_cd=en&menuCd=DOM_000000303011001000&uc_seq=292';
const gijangPlace={id:'gijang-market',name:'機張市場吃海鮮',en:'GIJANG MARKET',area:'機張郡',cat:'美食',img:null,ko:'기장시장',desc:'逛機張市場，挑一餐當日海鮮或蒸蟹。先確認重量、每公斤價格、料理與座位費，再決定點餐。'};
if(!places.some(p=>p.id===gijangPlace.id))places.push(gijangPlace);
coordinates['gijang-market']=[35.24384,129.21512];
routeSeeds[2]=['hotel','yonggungsa','hotel'];
routeSeeds[3]=['hotel','gijang-market','hotel','airport'];
const gijangMealNote='海鮮／蒸蟹依當日時價。先確認重量、每公斤價格、料理費、座位費及總價；可選熟食。每人 ₩40,000 為規劃預留，不是店家報價。';
function isGijangMarket(item){return item.place==='gijang-market'||/^(機張市場|機張市場吃海鮮|機張市場海鮮午餐)$/.test(item.name||'')}
function replaceMarketMeals(index,next){const before=state.logistics.meals[index];for(const stop of state.days[index]){const match=stop.logKey?.match(new RegExp('^meals-'+index+'-(\\d+)$'));if(!match)continue;const updated=next.indexOf(before[Number(match[1])]);if(updated>=0)stop.logKey='meals-'+index+'-'+updated;else delete stop.logKey;}state.logistics.meals[index]=next;}
function migrateGijangToLastDay(){
  if(state.gijangMarketDayVersion===2)return false;
  const existingStop=state.days.flat().find(isGijangMarket);
  const existingMeal=state.logistics.meals.flat().find(isGijangMarket);
  state.days=state.days.map(items=>items.filter(s=>!isGijangMarket(s)));
  state.logistics.meals.forEach((items,index)=>{
    const removed=items.some(isGijangMarket),next=items.filter(m=>!isGijangMarket(m));
    if(index===2&&removed&&!next.some(m=>m.time>='11:00'&&m.time<'15:00')){next.push(structuredClone(logisticsDefaults.meals[2][1]));next.sort((a,b)=>a.time.localeCompare(b.time));}
    replaceMarketMeals(index,next);
  });
  const lastMeals=state.logistics.meals[3];for(const breakfast of lastMeals)if(breakfast.name==='慢慢吃早餐'&&breakfast.time==='08:30')breakfast.time='07:30';const defaultLunch=lastMeals.findIndex(m=>m.name==='南浦洞午餐');
  const meal={...existingMeal,time:'11:00',name:gijangPlace.name,note:'最後一天海鮮午餐；12:30 前離開市場，返回飯店取行李後前往機場。'+gijangMealNote,cost:existingMeal?.cost??40000,place:'gijang-market'};
  const nextLastMeals=[...lastMeals];if(defaultLunch>=0)nextLastMeals[defaultLunch]=meal;else nextLastMeals.push(meal);nextLastMeals.sort((a,b)=>a.time.localeCompare(b.time));replaceMarketMeals(3,nextLastMeals);
  state.days[3].push({...existingStop,id:existingStop?.id??Date.now(),time:'11:00',name:gijangPlace.name,note:meal.note,cat:'美食',place:'gijang-market',logKey:'meals-3-'+nextLastMeals.indexOf(meal)});state.days[3].sort((a,b)=>a.time.localeCompare(b.time));
  state.logistics.transport[2]=state.logistics.transport[2].map(t=>t.name==='南浦 → 海東龍宮寺 → 機張市場 → 南浦'?structuredClone(logisticsDefaults.transport[2][0]):t);
  const lastTransfers=state.logistics.transport[3].filter(t=>!t.gijangTransfer&&t.name!=='南浦 → 金海機場');
  lastTransfers.push({time:'08:30',name:'退房寄放行李 → 機張市場',note:'先與飯店確認可寄放行李，再從南浦前往機張；以 NAVER 或 Google Maps 查當日轉乘，行程自訂預留約 90–120 分鐘。11:00 海鮮午餐，12:30 前離開市場。',cost:5000,gijangTransfer:true},{time:'12:30',name:'機張市場 → 飯店取行李 → 金海機場',note:'從機張站搭東海線往釜田方向，再依導航轉乘回飯店取行李；先預留約 90–120 分鐘，加 30 分鐘取行李。目標 15:00 前離開飯店去機場，另預留 75–100 分鐘交通及國際航班報到時間。此為規劃緩衝，非班次保證；20:00 前起飛請提早或改餐。',cost:10000,gijangTransfer:true});
  lastTransfers.sort((a,b)=>a.time.localeCompare(b.time));state.logistics.transport[3]=lastTransfers;
  state.gijangMarketAdded=true;state.gijangMarketDayVersion=2;
  try{localStorage.setItem('busan-days-v1',JSON.stringify(state))}catch{}
  return true;
}
migrateGijangToLastDay();
$('.planning-note').textContent='規劃假設：4 天 3 夜・2 人共住一間・南浦站住宿。首日交通仍為示範；最後一天機張市場方案以 20:00 後回程為前提，請依實際航班及航空公司報到時間調整。所有時間與花費為規劃估算。';
const marketPreviousRouteItems=routeItems;routeItems=function(){const ids=marketPreviousRouteItems();if(day===3&&ids.includes('gijang-market')){const airport=ids.lastIndexOf('airport');if(airport>0&&ids[airport-1]!=='hotel')ids.splice(airport,0,'hotel');}return ids;};
function googlePlace(q){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)}
function googleLeg(a,b){return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(coordinates[a].join(','))+'&destination='+encodeURIComponent(coordinates[b].join(','))+'&travelmode=transit'}
function marketTwd(){return money(Math.round(40000/(state.krwPerTwd||40)))}
const gijangCard=document.createElement('section');gijangCard.className='gijang-card';gijangCard.innerHTML=`<div class="eyebrow">GIJANG SEAFOOD MARKET</div><h2>機張市場，留一餐給海鮮。</h2><p>最後一天 Day 4：08:30 退房寄放行李 → 11:00 機張市場海鮮午餐 → 12:30 離開市場 → 回飯店取行李 → 金海機場。市場已從 Day 3 移到 Day 4，時間可在行程頁修改。</p><p data-gijang-flight></p><div class="gijang-facts"><span>東海線・機張站 1 號出口<br><b>步行約 6 分鐘</b></span><span>海鮮／蒸蟹依時價<br><b id="gijang-twd"></b></span></div><p>市場韓文：기장시장<br>地址：부산 기장군 기장읍 읍내로104번길 16<br>各攤營業與供應不同，出發前請查目的店家。</p><p>先問總價：活體重量、每公斤單價、料理費、座位費、加點與結帳總額。機張市場與札嘎其市場是不同地點。</p><div class="gijang-actions"><a class="outline" href="https://map.naver.com/p/search/${encodeURIComponent('기장시장 부산')}" target="_blank" rel="noopener">NAVER Map ↗</a><a class="outline" href="${googlePlace('기장시장 부산')}" target="_blank" rel="noopener">Google Maps ↗</a><button class="primary" data-gijang-day>查看最後一天 Day 4</button><a href="${gijangSource}" target="_blank" rel="noopener">Visit Busan 官方市場介紹 ↗</a></div><small>交通及特色查核：2026/11/20。每人預留 ₩40,000 是 App 自訂預算；台幣按手動規劃匯率換算，非即時報價。</small>`;
$('#home-view .discover').before(gijangCard);
const marketExplore=gijangCard.cloneNode(true);marketExplore.removeAttribute('id');marketExplore.querySelector('#gijang-twd').removeAttribute('id');$('#food-section .food-intro').after(marketExplore);
function updateMarketBudget(){for(const box of [gijangCard,marketExplore]){const q=flightQuotes.find(q=>q.id===state.airTravel?.selected),early=q&&q.back<'20:00';box.querySelector('[data-gijang-flight]').textContent=(q?'目前比較航班回程 '+q.back+'（查價快照，非已訂航班）。':'')+(early?'此航班早於 20:00 起飛，無法照此行程走；請提前市場用餐與離開時間，或調整回程航班。':'此安排以 20:00 後回程為前提；實際航班與日期未確定前，請依報到截止時間倒推交通，提早回程需縮短市場停留。');box.querySelector('.gijang-facts span:last-child b').textContent=`每人暫留約 NT$${marketTwd()}`;}}
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
document.addEventListener('click',e=>{if(e.target.closest('[data-gijang-day]')){day=3;show('route')}});
render();

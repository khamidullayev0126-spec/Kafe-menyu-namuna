// Tillar tartibi: uz | ru | en. Namuna: backend yo’q, buyurtma haqiqatda yuborilmaydi.
const D={
cur:"so’m|сум|UZS",demo:"Namuna|Демо|Demo",sub:"Har kuni 09:00–23:00|Ежедневно 09:00–23:00|Daily 09:00–23:00",
tm:"Menyu|Меню|Menu",tp:"Aksiyalar|Акции|Deals",tq:"Topshiriqlar|Задания|Quests",
c0:"Issiq ichimliklar|Горячие напитки|Hot drinks",c1:"Sovuq ichimliklar|Холодные напитки|Cold drinks",c2:"Taomlar|Блюда|Meals",c3:"Shirinliklar|Десерты|Desserts",
cart:"Savat|Корзина|Cart",empty:"Savat bo’sh|Корзина пуста|Cart is empty",dine:"Choyxonada|В чайхане|Dine in",del:"Uyga yetkazish|Доставка домой|Delivery",
tbl:"Stol raqami|Номер стола|Table number",adr:"Manzil|Адрес|Address",need:"Manzilni kiriting|Укажите адрес|Enter your address",
st:"Jami|Сумма|Subtotal",ds:"Topshiriq chegirmasi|Скидка за задания|Quest discount",fee:"Yetkazish|Доставка|Delivery fee",free:"bepul|бесплатно|free",tot:"Umumiy|Итого|Total",
ord:"Buyurtma berish|Заказать|Place order",ok:"Buyurtma qabul qilindi!|Заказ принят!|Order received!",num:"Buyurtma raqami|Номер заказа|Order number",
okn:"Bu namuna sahifa: buyurtma haqiqatda yuborilmaydi.|Это демо-страница: заказ реально не отправляется.|This is a demo page: no order is actually sent.",
lg:"Kirish|Войти|Log in",out:"Chiqish|Выйти|Log out",lt:"Hisobga kirish|Вход в аккаунт|Sign in",
g:"Google bilan davom etish|Продолжить с Google|Continue with Google",ph:"Telefon raqam bilan|По номеру телефона|With phone number",tg:"Telegram bilan|Через Telegram|With Telegram",em:"Email (namuna)|Email (демо)|Email (demo)",
dm:"Namuna: bu usul hozircha ishlamaydi. Email tugmasidan foydalaning.|Демо: этот способ пока не работает. Используйте Email.|Demo: this method is not active. Use Email.",
eph:"Email manzilingiz|Ваш email|Your email",go:"Davom etish|Продолжить|Continue",bad:"Email noto’g’ri|Неверный email|Invalid email",wel:"Xush kelibsiz|Добро пожаловать|Welcome",
qt:"Topshiriqlarni bajaring, chegirma oling|Выполняйте задания и получайте скидку|Complete quests, get a discount",
qi:"Har bir topshiriq: −2% (eng ko’pi −10%).|Каждое задание: −2% (максимум −10%).|Each quest: −2% (max −10%).",
ql:"Topshiriqlar uchun avval kiring.|Сначала войдите, чтобы выполнять задания.|Log in first to complete quests.",
do:"Bajarish|Выполнить|Do it",dn:"Bajarildi|Готово|Done",pr:"Sizning chegirmangiz|Ваша скидка|Your discount",close:"Yopish|Закрыть|Close",
p1t:"Choy + somsa|Чай + самса|Tea + samsa",p1d:"Har qanday choy va somsa birga: −15%|Любой чай и самса вместе: −15%|Any tea with samsa: −15%",
p2t:"Bepul yetkazish|Бесплатная доставка|Free delivery",p2d:"100 000 so’mdan yuqori buyurtmada yetkazish bepul|При заказе от 100 000 сум доставка бесплатно|Free delivery on orders over 100,000 UZS",
p3t:"Kunduzgi aksiya|Дневная акция|Daytime deal",p3d:"Hafta kunlari 14:00–17:00: ikkinchi choynak sovg’a|Будни 14:00–17:00: второй чайник в подарок|Weekdays 14:00–17:00: second pot of tea free",
p4t:"Tug’ilgan kun|День рождения|Birthday",p4d:"Tug’ilgan kunda barcha taomlarga −20%|В день рождения −20% на все блюда|−20% on all dishes on your birthday",
q1:"Instagram’da bizni kuzating|Подпишитесь на нас в Instagram|Follow us on Instagram",q2:"Telegram kanalimizga obuna bo’ling|Подпишитесь на наш Telegram-канал|Join our Telegram channel",
q3:"Sharh qoldiring|Оставьте отзыв|Leave a review",q4:"Do’stingizni taklif qiling|Пригласите друга|Invite a friend",q5:"Menyuni do’stingizga yuboring|Отправьте меню другу|Share the menu with a friend"};
// [bo’lim, emoji, nomi (uz|ru|en), narx]
const ITEMS=[[0,"🍵","Ko’k choy|Зелёный чай|Green tea",8000],[0,"🍵","Qora choy|Чёрный чай|Black tea",8000],[0,"☕","Kapuchino|Капучино|Cappuccino",20000],
[1,"🍋","Limonad|Лимонад|Lemonade",18000],[1,"🥤","Kompot|Компот|Compote",10000],
[2,"🍚","Osh|Плов|Plov",38000],[2,"🍜","Lag’mon|Лагман|Lagman",32000],[2,"🥟","Manti|Манты|Manti",28000],[2,"🥮","Somsa|Самса|Samsa",12000],
[3,"🍰","Medovik|Медовик|Honey cake",18000],[3,"🍯","Chak-chak|Чак-чак|Chak-chak",15000]];
const L=["uz","ru","en"],$=s=>document.querySelector(s);
let lg=0,user=null,cart={},mode="dine",tbl=1,adr="",tab="menu",done=new Set(),modal=null,emailOpen=false,no=0,tt;
try{lg=+localStorage.getItem("lg")||0;const th=localStorage.getItem("th");if(th)document.documentElement.dataset.theme=th}catch(e){}
document.documentElement.lang=L[lg];
const sv=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const t=k=>D[k].split("|")[lg];
const fmt=n=>n.toLocaleString("ru-RU").replace(/[\u00a0\u202f]/g," ")+" "+t("cur");
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nm=x=>x[2].split("|")[lg];
function tots(){let s=0;for(const i in cart)s+=ITEMS[i][3]*cart[i];const d=Math.round(s*.02*done.size);const f=mode==="del"&&s>0&&s<100000?10000:0;return{s,d,f,T:s-d+f}}
function toast(m){const e=$("#toast");e.textContent=m;e.hidden=false;clearTimeout(tt);tt=setTimeout(()=>e.hidden=true,2600)}
const card=(x,i)=>{const q=cart[i]||0;return `<div class="card"><span class="em">${x[1]}</span><div class="nm"><b>${nm(x)}</b><span class="pr">${fmt(x[3])}</span></div>${q?`<div class="qty"><button data-a="sub" data-v="${i}" aria-label="−">−</button><b>${q}</b><button data-a="add" data-v="${i}" aria-label="+">+</button></div>`:`<button class="add" data-a="add" data-v="${i}" aria-label="+">+</button>`}</div>`};
const menuV=()=>[0,1,2,3].map(c=>`<h2>${t("c"+c)}</h2><div class="grid">${ITEMS.map((x,i)=>x[0]===c?card(x,i):"").join("")}</div>`).join("");
const promoV=()=>`<h2>${t("tp")}</h2>`+[["🥟",1],["🚚",2],["🍵",3],["🎂",4]].map(([e,n])=>`<div class="card"><span class="em">${e}</span><div><b>${t("p"+n+"t")}</b><p>${t("p"+n+"d")}</p></div></div>`).join("");
function questV(){const n=done.size;return `<h2>${t("qt")}</h2><p class="mut">${t("qi")}</p>
<div class="card col"><div class="row"><b>${t("pr")}: −${n*2}%</b><span class="mut">${n}/5</span></div><div class="prog"><i style="width:${n*20}%"></i></div></div>
${user?"":`<div class="lock"><span>${t("ql")}</span><button class="btn sm" data-a="acct">${t("lg")}</button></div>`}
${[1,2,3,4,5].map(i=>`<div class="card"><span class="em">${["📸","✈️","⭐","👥","🔗"][i-1]}</span><span class="grow">${t("q"+i)}</span><button class="btn sm${done.has(i)?" ok":""}" data-a="quest" data-v="${i}" ${user?"":"disabled"}>${done.has(i)?"✓ "+t("dn"):t("do")}</button></div>`).join("")}`}
function render(){
 const c=Object.values(cart).reduce((a,b)=>a+b,0),T=tots();
 $("#app").innerHTML=`<header class="wrap top"><div><span class="badge">${t("demo")}</span><h1>Choyxona “Nur”</h1><p class="sub">${t("sub")}</p></div>
 <div class="ctl"><div class="seg">${L.map((x,i)=>`<button data-a="lang" data-v="${i}" aria-pressed="${i===lg}">${x.toUpperCase()}</button>`).join("")}</div>
 <button class="ic" data-a="theme" aria-label="Theme">◐</button><button class="ic" data-a="acct" aria-label="Account">${user?esc(user[0].toUpperCase()):"👤"}</button></div></header>
 <nav><div class="wrap tabs">${[["menu","tm"],["promo","tp"],["quests","tq"]].map(([k,l])=>`<button data-a="tab" data-v="${k}" aria-pressed="${tab===k}">${t(l)}</button>`).join("")}</div></nav>
 <main class="wrap">${tab==="menu"?menuV():tab==="promo"?promoV():questV()}</main>
 ${c?`<div class="bar"><button class="btn" data-a="cart">🛒 ${t("cart")} · ${c} · ${fmt(T.T)}</button></div>`:""}`}
function modalHTML(){
 if(modal==="done")return `<h3>✅ ${t("ok")}</h3><p>${t("num")}: #${no}</p><p class="mut">${t("okn")}</p>`;
 if(modal==="login"){
  if(user)return `<h3>${esc(user)}</h3><button class="btn full" data-a="logout">${t("out")}</button>`;
  return `<h3>${t("lt")}</h3><button class="btn alt full" data-a="demo"><b>G</b> ${t("g")}</button><button class="btn alt full" data-a="demo">📞 ${t("ph")}</button><button class="btn alt full" data-a="demo">✈️ ${t("tg")}</button><button class="btn full" data-a="emailopen">✉️ ${t("em")}</button>${emailOpen?`<input id="em" type="email" placeholder="${t("eph")}" autocomplete="email"><button class="btn full" data-a="emailgo">${t("go")}</button>`:""}`}
 const ks=Object.keys(cart);if(!ks.length)return `<h3>${t("cart")}</h3><p class="mut">${t("empty")}</p>`;
 const T=tots();
 return `<h3>${t("cart")}</h3>${ks.map(i=>`<div class="line"><span>${ITEMS[i][1]} ${nm(ITEMS[i])}</span><span class="qty"><button data-a="csub" data-v="${i}" aria-label="−">−</button><b>${cart[i]}</b><button data-a="cadd" data-v="${i}" aria-label="+">+</button></span><b>${fmt(ITEMS[i][3]*cart[i])}</b></div>`).join("")}
 <div class="seg wide"><button data-a="mode" data-v="dine" aria-pressed="${mode==="dine"}">🍽 ${t("dine")}</button><button data-a="mode" data-v="del" aria-pressed="${mode==="del"}">🛵 ${t("del")}</button></div>
 ${mode==="dine"?`<label>${t("tbl")}<select id="tbl">${Array.from({length:12},(_,i)=>`<option${tbl===i+1?" selected":""}>${i+1}</option>`).join("")}</select></label>`:`<label>${t("adr")}<input id="adr" value="${esc(adr)}" placeholder="${t("adr")}"></label>`}
 <div class="sum"><div class="row"><span>${t("st")}</span><span>${fmt(T.s)}</span></div>${T.d?`<div class="row ok"><span>${t("ds")} (−${done.size*2}%)</span><span>−${fmt(T.d)}</span></div>`:""}${mode==="del"?`<div class="row"><span>${t("fee")}</span><span>${T.f?fmt(T.f):t("free")}</span></div>`:""}<div class="row big"><b>${t("tot")}</b><b>${fmt(T.T)}</b></div></div>
 <button class="btn full" data-a="order">${t("ord")}</button>`}
function openM(m){modal=m;$("#ov").innerHTML=`<div class="sheet" role="dialog" aria-modal="true"><button class="x" data-a="close" aria-label="${t("close")}">✕</button>${modalHTML()}</div>`;$("#ov").hidden=false}
function closeM(){modal=null;$("#ov").hidden=true}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-a]");
 if(!b){if(e.target.id==="ov")closeM();return}
 const a=b.dataset.a,v=b.dataset.v;
 if(a==="lang"){lg=+v;sv("lg",lg);document.documentElement.lang=L[lg];render();if(modal)openM(modal)}
 else if(a==="theme"){const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;r.dataset.theme=dark?"light":"dark";sv("th",r.dataset.theme)}
 else if(a==="tab"){tab=v;render()}
 else if(a==="add"||a==="cadd"){cart[v]=(cart[v]||0)+1;render();if(a==="cadd")openM("cart")}
 else if(a==="sub"||a==="csub"){cart[v]--;if(!cart[v])delete cart[v];render();if(a==="csub")openM("cart")}
 else if(a==="cart")openM("cart");
 else if(a==="acct")openM("login");
 else if(a==="close")closeM();
 else if(a==="mode"){mode=v;render();openM("cart")}
 else if(a==="order"){if(mode==="del"&&!adr.trim()){toast(t("need"));return}no=1000+Math.floor(Math.random()*9000);cart={};render();openM("done")}
 else if(a==="quest"){const n=+v;done.has(n)?done.delete(n):done.add(n);render()}
 else if(a==="demo")toast(t("dm"));
 else if(a==="emailopen"){emailOpen=true;openM("login");const i=$("#em");if(i)i.focus()}
 else if(a==="emailgo")emailGo();
 else if(a==="logout"){user=null;done.clear();emailOpen=false;closeM();render()}
});
function emailGo(){const v=($("#em").value||"").trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){toast(t("bad"));return}user=v;emailOpen=false;closeM();render();toast(t("wel")+", "+v)}
document.addEventListener("input",e=>{if(e.target.id==="adr")adr=e.target.value;if(e.target.id==="tbl")tbl=+e.target.value});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeM();if(e.key==="Enter"&&e.target.id==="em")emailGo()});
render();
/* cards.js — CardMax benefit dataset (source of truth for card definitions).
   Card values reflect published 2025–2026 terms. Do not re-research; edit only
   on the user's instruction. Each item: [id, name, value, frequency, category, howToText].
   Per-user PROGRESS lives in Firestore; only these DEFINITIONS live in the client.
   (Future v2: move definitions server-side so they update without a redeploy.) */
window.CARDS = [
 {name:"Capital One Venture X",fee:395,color:"#004977",items:[
  ["vx1","Annual Travel Credit",300,"Annual","Travel","Book ANY travel through the Capital One Travel portal. First $300 auto-credited. No enrollment."],
  ["vx2","Anniversary Bonus Miles",100,"Annual","Points","10,000 miles (~$100) post automatically each account anniversary. Redeem against travel."],
  ["vx3","Global Entry / TSA PreCheck",120,"4-Year","Travel","Pay the GE ($120) / TSA ($85) app fee with the card; credit posts automatically."],
  ["vx4","Priority Pass + Cap One & Plaza Lounges",0,"Perk","Lounge","Enroll Priority Pass in your Capital One account. Free for you + 2 guests."],
  ["vx5","Hertz President's Circle Status",0,"Perk","Travel","Enroll via the Capital One / Hertz benefit page for free upgrades."],
  ["vx6","Cell Phone Protection",0,"Perk","Insurance","Pay your phone bill with the card; up to $800/claim (deductible applies)."],
  ["vx7","10x hotels & cars / 5x flights (portal)",0,"Perk","Earning","Book travel through Capital One Travel to stack miles on top of the $300 credit."]
 ]},
 {name:"Chase Sapphire Reserve",fee:795,color:"#117ACA",items:[
  ["cs1","Annual Travel Credit",300,"Annual","Travel","Auto-applies to first $300 of travel (flights, hotels, parking, tolls, rideshare). No enrollment."],
  ["cs2","The Edit Hotel Credit",500,"Semi-annual","Travel","Prepaid 2+ night stay via 'The Edit by Chase Travel'. Up to $250, usable twice/yr."],
  ["cs3","2026 Chase Travel Hotel Credit",250,"2026 only","Travel","Prepaid Chase Travel booking at IHG, Montage, Pendry, Omni, Virgin, Minor, Pan Pacific."],
  ["cs4","Dining Credit (Exclusive Tables)",300,"Semi-annual","Dining","Dine at Sapphire Reserve Exclusive Tables via OpenTable. $150 Jan–Jun + $150 Jul–Dec."],
  ["cs5","StubHub / viagogo Credit",300,"Semi-annual","Entertainment","Activate in your Chase account, then buy event tickets. $150 each half-year."],
  ["cs6","DoorDash Credit + DashPass",300,"Monthly","Lifestyle","Activate complimentary DashPass, then use the monthly in-app promo credits."],
  ["cs7","Lyft Credit",120,"Monthly","Transport","Set the Reserve as preferred payment in Lyft. $10 in-app credit each month — use or lose."],
  ["cs8","Peloton Membership Credit",120,"Monthly","Lifestyle","Link the card to an eligible Peloton membership; $10/mo statement credit (thru 2027)."],
  ["cs9","Apple TV+ & Apple Music",288,"Annual","Entertainment","Activate the complimentary subscriptions via chase.com/sapphire (thru 6/2027)."],
  ["cs10","Global Entry / TSA PreCheck",120,"4-Year","Travel","Pay the application fee with the card; credit posts automatically."],
  ["cs11","Priority Pass + Sapphire Lounges",0,"Perk","Lounge","Enroll Priority Pass via Chase. 1,300+ lounges + Sapphire Lounges (you + 2 guests)."],
  ["cs12","Points = 1.5x / transfer partners",0,"Perk","Earning","Redeem UR at 1.5c via Chase Travel, or transfer to Hyatt/United for more."]
 ]},
 {name:"Amex Platinum",fee:895,color:"#006FCF",items:[
  ["ax1","Hotel Credit (FHR / Hotel Collection)",600,"Semi-annual","Travel","Prepaid FHR or Hotel Collection (2-night min) via Amex Travel. Up to $300 back, twice/yr."],
  ["ax2","Resy Dining Credit",400,"Quarterly","Dining","Enroll, then pay at eligible U.S. Resy restaurants. $100 each quarter — no rollover."],
  ["ax3","Airline Fee Credit",200,"Annual","Travel","Pick ONE airline in your Amex account. Incidental fees (bags, seats) only — not airfare."],
  ["ax4","Digital Entertainment Credit",300,"Monthly","Entertainment","Enroll. Disney+, Hulu, ESPN, NYT, Paramount+, Peacock, WSJ, YouTube. $25/mo."],
  ["ax5","Uber Cash",200,"Monthly","Transport","Add the Platinum in the Uber app. $15/mo (+$20 in Dec) for U.S. rides & Eats."],
  ["ax6","Uber One Membership Credit",120,"Annual","Lifestyle","Up to $120/yr for an auto-renewing Uber One membership charged to the card."],
  ["ax7","lululemon Credit",300,"Quarterly","Lifestyle","Enroll, then shop U.S. lululemon stores / lululemon.com. $75 each quarter."],
  ["ax8","CLEAR+ Credit",209,"Annual","Travel","Pay your CLEAR+ membership with the card; up to $209 credit."],
  ["ax9","Walmart+ Credit",155,"Monthly","Lifestyle","Enroll, then pay the monthly Walmart+ membership. Covers a full year."],
  ["ax10","Oura Ring Credit",200,"Annual","Wellness","Buy an Oura Ring at ouraring.com with the card; up to $200 credit."],
  ["ax11","Equinox Credit",300,"Annual","Wellness","Enroll, then charge an eligible Equinox / Equinox+ membership. Up to $300/yr."],
  ["ax12","Saks Fifth Avenue Credit",100,"ENDS 6/30/26","Lifestyle","Enroll, then use at Saks. ENDING after June 30, 2026 — grab the H1 $50 before it's gone."],
  ["ax13","Global Entry / TSA PreCheck",120,"4-Year","Travel","Pay the application fee with the card; credit posts automatically."],
  ["ax14","Marriott Gold & Hilton Gold status",0,"Perk","Travel","Enroll both elite statuses via your Amex benefits page."],
  ["ax15","Centurion / Priority Pass / Delta Sky Club",0,"Perk","Lounge","Enroll Priority Pass. Centurion Lounges; Delta Sky Club when flying Delta."]
 ]}
];

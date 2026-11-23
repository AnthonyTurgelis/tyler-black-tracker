const test=require('node:test'),assert=require('node:assert/strict'),S=require('../scanner-utils');
const cards=[{id:'tcdb:1',subject:'Ryan Blaney',year:'2024',product:'Panini Select',cardNumber:'55',cardSet:'Gold',printRun:10},{id:'tcdb:2',subject:'Alex Palou',year:'2025',product:'Parkside',cardNumber:'1',cardSet:'Base'}];
const title='2024 Panini Select Gold #55 Ryan Blaney 7/10';
test('eBay auction rows preserve current-bid meaning and distinct shipping currency and receipt identifiers',()=>{
 const text=title+'\nOpens in a new window or tab\nCurrent bid: C $123.45\n7 bids\n+US $4.99 shipping\nhttps://www.ebay.ca/itm/123456789012\nItem ID: 123456789012\nSeller: fastcards\nCondition: Ungraded\nAccount: buyer-one';
 const [r]=S.parseListings(text,{cards,source:'eBay'});assert.equal(r.price,'123.45');assert.equal(r.currency,'CAD');assert.equal(r.kind,'current_bid');assert.equal(r.priceBasis,'item');assert.equal(r.shippingNum,4.99);assert.equal(r.shippingCurrency,'USD');assert.equal(r.itemId,'123456789012');assert.equal(r.seller,'fastcards');assert.equal(r.account,'buyer-one');assert.equal(r.condition,'Ungraded');assert.equal(r.bids,'7');
});
test('synthetic eBay purchase-history summary totals remain order totals, never paid per-card prices',()=>{
 const text=title+'\nDelivered\nOrder date:July 16, 2025Order total:US $32.40Order number:00-00000-00102\nView order details\n'+title+'\nUS $32.40\nSold by:\nfixture-consignment\nhttps://www.ebay.ca/itm/900000000102';
 const rows=S.parseListings(text,{cards,source:'eBay'});assert.equal(rows.length,1);const r=rows[0];assert.equal(r.kind,'purchase');assert.equal(r.price,'32.4');assert.equal(r.priceBasis,'order_total');assert.equal(r.originalPriceBasis,'order_total');assert.match(r.rawOrderTotal,/32.40/);assert.equal(r.orderNum,'00-00000-00102');assert.equal(r.date,'July 16, 2025');assert.equal(r.sourceItemId,'900000000102');assert.equal(r.needsReview,true);
});
test('explicit item price remains distinct from order total and converted settlement',()=>{
 const text=title+'\nItem price: US $25.00\nShipping: US $4.00\nOrder total: US $32.40\nCharged: C $43.20\nOrder number: 00-00000-00102\nQuantity: 1';
 const [r]=S.parseListings(text,{cards,source:'eBay',recordType:'purchase'});assert.equal(r.price,'25');assert.equal(r.currency,'USD');assert.equal(r.priceBasis,'item');assert.equal(r.orderTotal.amount,32.40);assert.equal(r.quantity,'1');
});
test('COMC CSV preserves exact quantities, serial, paid currency, account and quoted description',()=>{
 const csv='Set Name,Card No,Description,Serial No,Qty Manufactured,Purchase Price,Currency,Date Sold,Purchased From,Item ID,Item URL,Quantity Purchased,Account\n2024 Panini Select - Gold,55,"Ryan Blaney, NASCAR",7,10,12.25,USD,2025-07-16,seller-one,777,https://www.comc.com/item/777,1,buyer-one';
 const [r]=S.parseListings(csv,{cards});assert.equal(r.source,'COMC');assert.equal(r.subject,'Ryan Blaney');assert.equal(r.cardNo,'55');assert.equal(r.variant,'Gold');assert.equal(r.serial,'7');assert.equal(r.printRun,'10');assert.equal(r.price,'12.25');assert.equal(r.kind,'purchase');assert.equal(r.currency,'USD');assert.equal(r.sourceItemId,'777');assert.equal(r.quantity,'1');assert.equal(r.account,'buyer-one');assert.equal(r.seller,'seller-one');
});
test('tab-separated receipt fields and UTF8 BOM parse without item/order/account loss',()=>{
 const t='\uFEFFItem Title\tItem Price\tCurrency\tOrder Number\tItem ID\tBuyer Account\tQuantity\tOrder Date\n'+title+'\tC $5.25\tCAD\torder-a\t123\tsecond-buyer\t2\t2026-11-18';
 const [r]=S.parseListings(t,{cards,source:'eBay',recordType:'purchase'});assert.equal(r.currency,'CAD');assert.equal(r.orderNum,'order-a');assert.equal(r.itemId,'123');assert.equal(r.account,'second-buyer');assert.equal(r.quantity,'2');assert.equal(r.eventDate,'2026-11-18');
});
test('plausible unknown-subject rows are retained for explicit manual review and cannot match by another subject',()=>{
 const rows=S.parseListings('2024 Panini Select Gold #55 Mystery Driver /10\nUS $8.25\n'+title+'\nUS $10.25',{cards,source:'eBay'});assert.equal(rows.length,2);assert.equal(rows[0].subject,'');assert.equal(rows[0].needsIdentityReview,true);assert.equal(rows[0].price,'8.25');assert.equal(S.match(rows[0],cards),null);assert.equal(rows[1].price,'10.25');
});
test('SportLots availability is not purchase quantity, including unknown subjects',()=>{
 const rows=S.parseListings('2024 Panini Select Gold\n#55 Mystery Driver\nTotal Quantity: 18\nLow Price: $3.25',{cards,source:'SportLots'});assert.equal(rows.length,1);assert.equal(rows[0].quantity,undefined);assert.equal(rows[0].kind,'asking');assert.equal(rows[0].currency,'USD');assert.equal(rows[0].needsIdentityReview,true);
});
test('130point sold price and current bids remain separate from this owner purchases',()=>{
 const text=title+' Auction\nList Price: US $99\nSale Price: US $12.25\nEnd Date: 2026-11-12\nSold Via: eBay\n2025 Parkside #1 Alex Palou Auction\nCurrent Price: C $5.50\nCurrent Number of Bids: 2';
 const rows=S.parseListings(text,{cards,source:'130point',recordType:'purchase'});assert.equal(rows.length,2);assert.equal(rows[0].kind,'sold');assert.equal(rows[0].price,'12.25');assert.equal(rows[0].recordType,'sold');assert.equal(rows[1].kind,'current_bid');assert.equal(rows[1].currency,'CAD');
});
test('Whatnot preserves grade and certificate as reported metadata without authenticating it',()=>{
 const [r]=S.parseListings(title+' SGC 9.5 10\nAU $17.50\nFree shipping\nCert number: 123456\nSeller: racingstore',{cards,source:'Whatnot'});assert.equal(r.kind,'asking');assert.equal(r.currency,'AUD');assert.equal(r.shippingNum,0);assert.deepEqual(r.grading,{company:'SGC',cardGrade:'9.5',autoGrade:'10',certNumber:'123456'});assert.equal(r.imageVerified,undefined);assert.equal(r.seller,'racingstore');
});
test('recommendation guards survive parsing mixed source metadata and unknown subjects',()=>{
 const rows=S.parseListings(title+'\nUS $9\nYou may also like\n2024 Panini Select #66 Mystery Driver\nC $99\nOrder total\nUS $9',{cards,source:'eBay',recordType:'purchase'});assert.equal(rows.length,1);assert.equal(rows[0].price,'9');assert.equal(rows[0].currency,'USD');
});
test('malformed CSV fails before returning partial receipt rows',()=>{
 assert.throws(()=>S.parseListings('Item Title,Purchase Price\n"'+title+',US $5',{cards}),/Unclosed/);
 assert.throws(()=>S.parseListings('Item Title,Purchase Price\n'+title+',US $5,extra',{cards}),/row width/);
});
test('native COMC export ItemID headers and sales lifecycle preserve distinct price meanings',()=>{
 const header='ItemID,Sport,Set Name,Card No,Description,Serial No,Qty Manufactured,Purchase Price,Date Sold,Purchased From,Is Return';
 const [purchase]=S.parseListings(header+'\n900000103,MultiSport,2024 Panini Select - Gold,55,Ryan Blaney,7,10,1.2500,06/13/2025 10:30:00 AM,fixture-seller-c,False',{cards,account:'comc-owner'});
 assert.equal(purchase.itemId,'900000103');assert.equal(purchase.price,'1.25');assert.equal(purchase.kind,'purchase');assert.equal(purchase.isReturn,false);assert.equal(purchase.account,'comc-owner');assert.equal(purchase.date,'06/13/2025 10:30:00 AM');assert.equal(purchase.dateFormat,'MM/DD/YYYY');assert.equal(purchase.rawEventDate,purchase.date);
 const sales='ItemID,Sport,Set Name,Card No,Description,Serial No,Qty Manufactured,Purchase Price,Sale Price,COMC Credit,Transaction Fee,Promotion Fee,Date Sold,Batch #,Acquisition Date,Purchased By,Is Return\n900000104,Racing,2024 Panini Select - Gold,55,Ryan Blaney,7,10,2.0000,4.0000,3.8000,0.2000,0.0000,07/14/2025 11:45:00 AM,900000105,05/15/2025 8:20:00 AM,fixture-buyer-c,False';
 const [sale]=S.parseListings(sales,{cards,recordType:'purchase'});assert.equal(sale.itemId,'900000104');assert.equal(sale.price,'4');assert.equal(sale.kind,'sold');assert.equal(sale.recordType,'sold');assert.equal(sale.acquisitionPrice,'2.0000');assert.equal(sale.acquisitionDate,'05/15/2025 8:20:00 AM');assert.equal(sale.buyer,'fixture-buyer-c');assert.equal(sale.lifecycleStatus,'sold');
 const [returned]=S.parseListings(header+'\n900000103,Racing,2024 Panini Select - Gold,55,Ryan Blaney,7,10,1.2500,06/13/2025 10:30:00 AM,fixture-seller-c,True',{cards});assert.equal(returned.needsSourceReview,true);assert.equal(returned.needsReview,true);
});
test('eBay detail headers preserve USD unit price and separate CAD settlement and exchange rate',()=>{
 const text='Time placed\tJune 12, 2025 at 2:15 p.m.\nOrder number\t00-00000-00101\nTotal\tUS $24.00 (1 item)\nSold by\tfixture-seller\n2023 Panini Select Sample Driver Gold Autograph #17 /25\nUS $20.00\nUnit price US $20.00\nhttps://www.ebay.ca/itm/900000000101\nShipping\nUS $3.00\nTax*\nUS $1.00\nOrder total\tUS $24.00\nPayment info\nC $32.00\nThis was the exchange rate from the time of the transaction: C $1.00 = US $0.7500';
 const rows=S.parseListings(text,{source:'eBay',account:'fixture-buyer'});assert.equal(rows.length,1);const r=rows[0];assert.equal(r.kind,'purchase');assert.equal(r.price,'20');assert.equal(r.currency,'USD');assert.equal(r.priceBasis,'item');assert.equal(r.orderNum,'00-00000-00101');assert.equal(r.date,'June 12, 2025');assert.equal(r.seller,'fixture-seller');assert.equal(r.itemId,'900000000101');assert.equal(r.orderTotal.amount,24);assert.equal(r.shippingNum,3.00);assert.equal(r.orderTax.amount,1.00);assert.equal(r.settlement.amount,32.00);assert.equal(r.settlement.currency,'CAD');assert.equal(r.exchangeRate.fromCurrency,'CAD');assert.equal(r.exchangeRate.toCurrency,'USD');assert.equal(r.exchangeRate.toAmount,0.7500);
});
test('page-level receipt headers never bleed across different orders',()=>{
 const text='Time placed\tJune 12, 2025\nOrder number\torder-a\n'+title+'\nUS $20.00\nTime placed\tJune 13, 2025\nOrder number\torder-b\n2025 Parkside #1 Alex Palou\nUS $17.50';
 const rows=S.parseListings(text,{source:'eBay',cards});assert.equal(rows.length,2);assert.equal(rows[0].orderNum,'order-a');assert.equal(rows[0].date,'June 12, 2025');assert.equal(rows[1].orderNum,'order-b');assert.equal(rows[1].date,'June 13, 2025');assert.equal(rows[1].price,'17.5');
});

test('CSV item shipping reaches the headline price without changing the original amount',()=>{
 const csv='Item Title,Item Price,Currency,Item Shipping,Shipping Currency\n'+title+',10,CAD,2.49,CAD';
 const [r]=S.parseListings(csv,{cards,source:'eBay'});
 assert.equal(r.price,'10');assert.equal(require('../market-utils').scanPrice(r).amount,12.49);
});

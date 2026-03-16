/* ==============================
GET SEARCH DATA FROM URL
============================== */

const params = new URLSearchParams(window.location.search)

let destination = params.get("destination") || "manali"
let checkin = params.get("checkin")
let checkout = params.get("checkout")

let rooms = parseInt(params.get("rooms")) || 1
let adults = parseInt(params.get("adults")) || 2
let childBed = parseInt(params.get("childBed")) || 0
let childNoBed = parseInt(params.get("childNoBed")) || 0


/* ==============================
CALCULATE NIGHTS
============================== */

function getNights(){

let checkinDate = new Date(checkin)
let checkoutDate = new Date(checkout)

let diff = checkoutDate - checkinDate

let nights = diff / (1000 * 60 * 60 * 24)

if(nights <= 0){
nights = 1
}

return nights

}


/* ==============================
CHECK SEASON
============================== */

function getSeason(){

let date = new Date(checkin)

let peakStart = new Date("2026-04-20")
let peakEnd = new Date("2026-07-15")

let peak2Start = new Date("2026-12-16")
let peak2End = new Date("2027-01-05")

if(
(date >= peakStart && date <= peakEnd) ||
(date >= peak2Start && date <= peak2End)
){

return "peak"

}

return "off"

}

/*==========================================
Calculate Starting Price
==========================================*/

function getStartingPrice(hotel){

let season = getSeason(checkin)

let prices = []

hotel.rooms.forEach(room=>{

let priceData = season === "peak" ? room.peak : room.off

prices.push(priceData.EP)

})

return Math.min(...prices)

}


/* ==============================
HOTEL DATABASE
============================== */
let hotels=[

{name:"The Allure Grand Resort Manali",destination:"manali",star:5,location:"Naggar Road, Manali",image:"https://images.unsplash.com/photo-1582719508461-905c673771fd",

rooms:[
{name:"Valley View Room",peak:{EP:7000,CP:7900,MAP:9400},off:{EP:5000,CP:5900,MAP:6900}},
{name:"River Front Room",peak:{EP:9000,CP:9900,MAP:11400},off:{EP:6500,CP:7400,MAP:8400}},
{name:"Rohtang Suite",peak:{EP:11000,CP:11900,MAP:13400},off:{EP:8000,CP:8900,MAP:9900}}
]

},

{name:"Sun Park Boutique Manali",destination:"manali",star:4,location:"Hadimba Temple Road, Manali",image:"images/sunpark.jpg",

rooms:[
{name:"Premium Room",peak:{EP:5200,CP:6000,MAP:7000},off:{EP:3100,CP:3600,MAP:4300}},
{name:"Superior Room",peak:{EP:6200,CP:7000,MAP:8000},off:{EP:3600,CP:4100,MAP:4800}},
{name:"Elite Honeymoon Room",peak:{EP:7200,CP:8000,MAP:9000},off:{EP:4600,CP:5100,MAP:5800}}
],

extraBed:{EP:1000,CP:1400,MAP:1800},
childWithoutBed:{EP:500,CP:900,MAP:1300}

},

{name:"Sun Park Resort Manali",destination:"manali",star:4,location:"Hadimba Temple Road, Manali",image:"images/sunparkm.jpg",

rooms:[
{name:"Super Deluxe Room",peak:{EP:4700,CP:5200,MAP:6000},mid:{EP:2100,CP:2600,MAP:3200},off:{EP:1900,CP:2400,MAP:3000}},
{name:"Honeymoon Room",peak:{EP:5700,CP:6200,MAP:7000},mid:{EP:2700,CP:3200,MAP:3800},off:{EP:2500,CP:3000,MAP:3600}},
{name:"Luxury Room",peak:{EP:6200,CP:6700,MAP:7500},mid:{EP:2900,CP:3400,MAP:4000},off:{EP:2700,CP:3200,MAP:3800}},
{name:"Royal Honeymoon Room",peak:{EP:6700,CP:7200,MAP:8000},mid:{EP:3100,CP:3600,MAP:4200},off:{EP:2900,CP:3400,MAP:4000}},
{name:"Maharaja Honeymoon Room",peak:{EP:7500,CP:8000,MAP:8800},mid:{EP:3600,CP:4100,MAP:4700},off:{EP:3400,CP:3900,MAP:4500}},
{name:"Family Room without balcony",peak:{EP:7200,CP:8100,MAP:9500},mid:{EP:3600,CP:4400,MAP:5500},off:{EP:3200,CP:4000,MAP:5100}},
{name:"Premium Family Suite",peak:{EP:8200,CP:9100,MAP:10500},mid:{EP:4100,CP:4900,MAP:6000},off:{EP:3700,CP:4500,MAP:5600}},
{name:"Duplex Suite",peak:{EP:9200,CP:10100,MAP:11500},mid:{EP:4600,CP:5400,MAP:6500},off:{EP:4200,CP:5000,MAP:6100}}
],

extraBed:{peak:{EP:1000,CP:1300,MAP:1700},mid:{EP:700,CP:900,MAP:1200},off:{EP:500,CP:700,MAP:1000}},
childWithoutBed:{peak:{EP:500,CP:700,MAP:1000},mid:{EP:300,CP:500,MAP:800},off:{EP:200,CP:400,MAP:700}}

}

];

/* ==============================
DISPLAY HOTEL LIST
============================== */

function displayHotels(){

let container = document.getElementById("hotelList")

container.innerHTML=""

let filteredHotels = hotels.filter(h => h.destination === destination)

filteredHotels.forEach(hotel=>{

let div = document.createElement("div")

div.className="hotel-card"

let startingPrice = getStartingPrice(hotel)

div.innerHTML = `

<img src="${hotel.image}" class="hotel-img">

<div class="hotel-info">

<h3>${hotel.name}</h3>

<p>⭐ ${hotel.star} Star | 📍 ${hotel.location}</p>

<p class="starting-price">
Starting From <strong>₹${startingPrice}</strong> / night
</p>

<button class="book-btn"
onclick="openBookingPopup('${hotel.name}')">
Book Now
</button>

</div>

`

container.appendChild(div)

})

}


/* ==============================
OPEN BOOKING POPUP
============================== */

function openBookingPopup(hotelName){

let hotel = hotels.find(h => h.name === hotelName)

let popup = document.getElementById("bookingPopup")
let popupHotel = document.getElementById("popupHotelName")
let roomList = document.getElementById("roomPopupList")

popupHotel.innerText = hotel.name

roomList.innerHTML=""

let nights = getNights()

let season = getSeason()

hotel.rooms.forEach(room => {

let priceData = season === "peak" ? room.peak : room.off

let mealPlans = [
{code:"EP", name:"Only Room"},
{code:"CP", name:"Breakfast"},
{code:"MAP", name:"Breakfast + Dinner"},
{code:"AP", name:"Breakfast + Lunch + Dinner"}
]

let roomCard = document.createElement("div")

roomCard.className = "room-card"

let mealHTML = ""

mealPlans.forEach(plan=>{

let price = priceData[plan.code] || priceData.MAP + 1000

let childBedCost = childBed * 1000
let childNoBedCost = childNoBed * 500

let total =
(price + childBedCost + childNoBedCost)
* nights
* rooms

mealHTML += `

<div class="meal-plan">

<div class="meal-left">
<h4>${plan.name}</h4>
<p>Price Per Night ₹${price}</p>
</div>

<div class="meal-right">

<h3>₹${total}</h3>
<p>${nights} Nights | ${rooms} Rooms</p>

<button class="select-btn"
onclick="openGuestPopup(${total},'${room.name}','${hotel.name}')">
Select
</button>

</div>

</div>

`

})

roomCard.innerHTML = `

<div class="room-header">

<h2>${room.name}</h2>
<p>Luxury mountain view room</p>

</div>

<div class="meal-container">

${mealHTML}

</div>

`

roomList.appendChild(roomCard)

})

popup.style.display="flex"

}

let selectedPrice = 0
let selectedHotel = ""
let selectedRoom = ""

function openGuestPopup(price,room,hotel){

selectedPrice = price
selectedRoom = room
selectedHotel = hotel

document.getElementById("totalPrice").innerText = price

let advance = 1000
document.getElementById("advancePrice").innerText = advance

document.getElementById("guestPopup").style.display="flex"


startOfferTimer()


}

function closeGuestPopup(){

document.getElementById("guestPopup").style.display="none"

}


/* ==============================
CLOSE POPUP
============================== */

function closePopup(){

document.getElementById("bookingPopup").style.display="none"

}


/* ==============================
PAGE LOAD
============================== */

displayHotels()

function payNow(){

let name = document.getElementById("guestName").value
let mobile = document.getElementById("guestMobile").value
let email = document.getElementById("guestEmail").value
let guests = document.getElementById("guestCount").value
let ages = document.getElementById("guestAge").value

if(name=="" || mobile=="" || email==""){
alert("Please fill guest details")
return
}

let payType = document.querySelector('input[name="payType"]:checked').value

let amount = 0

if(payType=="1000"){
amount = 1000
}
else if(payType=="half"){
amount = Math.round(selectedPrice * 0.50)
}
else{
amount = selectedPrice
}

var options = {

"key": "rzp_live_SDczvDy9TjqECm",

"amount": amount * 100,

"currency": "INR",

"name": "LuxuryStay",

"description": selectedHotel,

"handler": function (response){

saveBooking(response.razorpay_payment_id,name,mobile,email,guests,ages,amount)

alert("Payment Successful!")

},

"prefill": {
"name": name,
"email": email,
"contact": mobile
},

"theme": {
"color": "#ff6b00"
}

}

var rzp = new Razorpay(options)

rzp.open()

}

function saveBooking(paymentId,name,mobile,email,guests,ages,amount){

advance:amount,

fetch("https://script.google.com/macros/s/AKfycbwFygSkXJuncQ9dfK_OfXZU6ZMgtfjjpNWcBoPob6vyBa5Nna0HEHNvVnNOwHPw7Eoi/exec",{

method:"POST",

body:JSON.stringify({

hotel:selectedHotel,
room:selectedRoom,
name:name,
mobile:mobile,
email:email,
guests:guests,
ages:ages,
total:selectedPrice,
advance:amount,
payment:paymentId

})

})

}

/* =========================
2 HOUR OFFER TIMER
========================= */

let offerEndTime = null

function startOfferTimer(){

offerEndTime = new Date().getTime() + (2 * 60 * 60 * 1000)

updateTimer()

}

function updateTimer(){

let now = new Date().getTime()

let distance = offerEndTime - now

if(distance <= 0){

document.getElementById("offerTimer").innerText = "Expired"

return

}

let hours = Math.floor(distance / (1000 * 60 * 60))
let minutes = Math.floor((distance % (1000*60*60)) / (1000*60))
let seconds = Math.floor((distance % (1000*60)) / 1000)

document.getElementById("offerTimer").innerText =
String(hours).padStart(2,'0') + ":" +
String(minutes).padStart(2,'0') + ":" +
String(seconds).padStart(2,'0')

setTimeout(updateTimer,1000)

}

function searchHotel(){

let destination = document.getElementById("destination").value.toLowerCase()

let checkin = document.getElementById("checkin").value
let checkout = document.getElementById("checkout").value
let rooms = document.getElementById("rooms").value
let adults = document.getElementById("adults").value
let childBed = document.getElementById("childBed").value
let childNoBed = document.getElementById("childNoBed").value


if(destination === "" || checkin === "" || checkout === "" || rooms === "" || adults === ""){
alert("Please fill all required fields")
return
}


if(destination !== "manali" && destination !== "goa" && destination !== "jaipur"){

alert("Currently we deal only in Manali, Goa and Jaipur")

return

}


let url = "resultpage.html?destination="+destination+
"&checkin="+checkin+
"&checkout="+checkout+
"&rooms="+rooms+
"&adults="+adults+
"&childBed="+childBed+
"&childNoBed="+childNoBed

window.location.href = url

}
var infoPage = document.getElementById("account-page");
var mainPage = document.getElementById("booking-page");
var loginInfo = document.getElementById("login-box");
var signupPage = document.getElementById("signup-page");
var signupSubmit = document.getElementById("signup-submit");
var loginReturn = document.getElementById("login-return");
var signup = document.getElementById("signup");
var newUser = document.getElementById("new-user");
var newPassword = document.getElementById("new-password");
var confirmPassword = document.getElementById("confirm-password");
var mismatch = document.getElementById("feedback");
var searchButton = document.getElementById("search-button");
var citySelectionPage = document.getElementById("city-selection-page");
var listOfBusesPage = document.getElementById("list-of-bus-page");
var busList = document.getElementById("bus-list");
var ticketPage = document.getElementById("ticket-selection-page");
var travelerInfoPage = document.getElementById("traveler-info-page");
var travelerList = document.getElementById("traveler-column");
var paymentPage = document.getElementById("payment-page");
var detailList = document.getElementById("traveler-detail-display");
var upiPage = document.getElementById("upi-page");
var cardPaymentPage = document.getElementById("card-payment-page");
var noBusCard = document.getElementById("no-bus");
var conformModal = document.getElementById("conform-modal");
var fromCity = document.getElementById("selected-from-city");
var toCity = document.getElementById("selected-to-city");
var dateOfJourney = document.getElementById("selected-date");
var myTicketPage = document.getElementById("my-ticket-page");
var myTicketList = document.getElementById("my-ticket-list");
var datePicker = document.getElementById("selected-date");
var homeButton = document.getElementById("home-button");
var username, password, selectedId;
var selectedCity;
var selectedBus, selectedDate, selectedStart, selectedTicketPrice, noOfTickets;

function checkLogin() {
	var inputname = document.getElementById("username");
	var inputpassword = document.getElementById("password");
	getLoginData(inputname, inputpassword);
}

var signup = document.getElementById("signup");
signup.addEventListener("click", navigateToSignupPage);

// Function to navigate the user to sign up page.
function navigateToSignupPage() {
	loginInfo.style = "display:none";
	signupPage.style = "display:flex";
	newUser.value = "";
	newPassword.value = "";
	confirmPassword.value = "";
}

// Function to add a new user when the submit button is clicked.
signupSubmit.addEventListener("click", async () => {
	if (!(newUser.value.length == 0)) {
		if (!(newPassword.value.length == 0 || confirmPassword.value == 0)) {
			if (newPassword.value == confirmPassword.value) {
				await addNewUser(newUser, newPassword);
			} else {
				mismatch.innerHTML = "Password mismatch";
			}
		} else {
			alert("Enter password");
		}
	} else {
		alert("Enter username");
	}
});

(function setDatepickerLimit() {
	let today = new Date(),
		day = today.getDate(),
		month = today.getMonth() + 1,
		year = today.getFullYear();
	if (day < 10) {
		day = "0" + day;
	}
	if (month < 10) {
		month = "0" + month;
	}
	today = year + "-" + month + "-" + day;

	var endMonth,
		endYear,
		endDate = day - 1;
	endMonth = month + 1;
	if (month == 12) {
		endYear = year + 1;
		endMonth = "01";
	} else {
		endYear = year;
	}
	var endDay = endYear + "-" + endMonth + "-" + endDate;

	datePicker.setAttribute("min", today);
	datePicker.setAttribute("max", endDay);
})();

async function clickOnSearch() {
	if (
		fromCity.value.toLowerCase() in fromData &&
		toCity.value.toLowerCase() in toData
	) {
		if (fromCity.value != toCity.value) {
			searchForBuses(fromCity.value, toCity.value, dateOfJourney.value);
		} else {
			toCity.value = "";
			toCity.placeholder = "   Enter another city";
		}
	} else {
		alert("Select the city from the dropdown");
	}
}

function searchForBuses(from, to, date) {
	citySelectionPage.style = "display:none";
	listOfBusesPage.style = "display:flex";
	mainPage.style.backgroundColor = "white";
	var busRoute = from + to;
	var listOfBus = buses[busRoute];
	var listHeader = document.getElementById("list-header");
	listHeader.innerHTML = `${from} TO ${to}`;
	busList.replaceChildren();
	if (busRoute in buses) {
		selectedCity = `${from} TO ${to}`;
		for (let i = 0; i < listOfBus.length; i++) {
			createBusList(i, listOfBus, date);
		}
	} else {
		createNoBusCard(from, to);
	}
}

var myTicketsButton = document.getElementById("my-tickets");
myTicketsButton.addEventListener("click", showMyTickets);
var buttonCount = 0;

homeButton.addEventListener("click", returnBackToHome);
function returnBackToHome() {
	buttonCount = 1;
	showMyTickets();
	clearAllInput();
}

function showMyTickets() {
	if (buttonCount == 0) {
		citySelectionPage.style = "display : none";
		listOfBusesPage.style = "display:none";
		paymentPage.style = "display:none";
		upiPage.style = "display:none";
		ticketPage.style = "display:none";
		travelerInfoPage.style = "display:none";
		cardPaymentPage.style = "display:none";
		myTicketPage.style = "display:flex";
		mainPage.style.backgroundColor = "rgb(163, 226, 255)";
		getMyTickets(username);
		buttonCount = 1;
		myTicketsButton.innerHTML = "Home Page";
	} else {
		myTicketPage.style = "display:none";
		listOfBusesPage.style = "display:none";
		paymentPage.style = "display:none";
		upiPage.style = "display:none";
		ticketPage.style = "display:none";
		travelerInfoPage.style = "display:none";
		cardPaymentPage.style = "display:none";
		citySelectionPage.style = "display : flex";
		mainPage.style.backgroundColor = "rgb(163, 226, 255)";
		myTicketsButton.innerHTML = "My Tickets";
		buttonCount = 0;
	}
}

async function displayMyTickets(myListOfTickets) {
	let tickets = await myListOfTickets.json();
	myTicketList.replaceChildren();
	var ticketBoxList = tickets.tickets.reverse();
	for (let i = 0; i < ticketBoxList.length; i++) {
		createMyTicketList(ticketBoxList, i);
	}
}

function createMyTicketList(list, i) {
	var ticket = document.createElement("div");
	var busName = document.createElement("h1");
	var dateOfTravel = document.createElement("h2");
	var locations = document.createElement("div");
	var ticketCount = document.createElement("div");
	var singleTicket = document.createElement("div");
	var totalTicketPrice = document.createElement("div");
	myTicketList.appendChild(ticket);
	ticket.setAttribute("class", "user-ticket");
	ticket.setAttribute("id", "user-ticket");
	busName.setAttribute("class", "bus-detail");
	dateOfTravel.setAttribute("class", "bus-travel-details");
	locations.setAttribute("class", "bus-travel-details");
	ticketCount.setAttribute("class", "bus-travel-details");
	singleTicket.setAttribute("class", "bus-travel-details");
	totalTicketPrice.setAttribute("class", "bus-travel-details");
	ticket.appendChild(busName);
	ticket.appendChild(dateOfTravel);
	ticket.appendChild(locations);
	ticket.appendChild(ticketCount);
	ticket.appendChild(singleTicket);
	ticket.appendChild(totalTicketPrice);
	busName.append(`${list[i].bus}`);
	dateOfTravel.append(list[i].date);
	locations.append(list[i].location);
	ticketCount.append(`Number of Tickets : ${list[i].noOfTicket}`);
	singleTicket.append(list[i].ticketPrice);
	totalTicketPrice.append(`Total Price : Rs${list[i].totalPrice}`);
}

var logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", logoutUser);

function logoutUser() {
	var logoutComfirmation = document.getElementById("logout-container");
	logoutComfirmation.style = "display: flex";
}

function confirmLogout(clickedButton) {
	var logoutComfirmation = document.getElementById("logout-container");
	if (clickedButton == "yes") {
		infoPage.style = "display:block";
		loginInfo.style = "display:block";
		mainPage.style = "display:none";
		logoutComfirmation.style = "display: none";
		username = "";
		clearAllInput();
	} else {
		logoutComfirmation.style = "display: none";
	}
}

function clearAllInput() {
	selectedCity = "";
	selectedBus = "";
	selectedDate = "";
	selectedStart = "";
	selectedTicketPrice = "";
	noOfTickets = "";
	fromCity.value = "Coimbatore";
	toCity.vlaue = "Banglore";
	dateOfJourney.value = "";
	document.getElementById("ticket-number").value = "1";
	for (let i = 0; i < noOfTickets; i++) {
		clearInput(i);
	}
	document.getElementById("payment").vlaue = "UPI";
	document.getElementById("upi-id").value = "";
	document.getElementById("card-number").value = "";
	document.getElementById("card-holer-name").value = "";
	document.getElementById("expiry-month").value = "Jan";
	document.getElementById("expiry-year").value = "2023";
	document.getElementById("cvv").value = "";
}
function createNoBusCard(from, to) {
	console.log("hi");
	var noBus = document.createElement("div");
	var imageBox = document.createElement("div");
	var image = document.createElement("img");
	var details = document.createElement("div");
	busList.appendChild(noBus);
	noBus.setAttribute("class", "no-bus");
	noBus.setAttribute("id", "no-bus");
	image.setAttribute("src", "./assets/sorry.gif");
	image.setAttribute("alt", "sorry");
	details.setAttribute("class", "no-bus-details");
	details.setAttribute("id", "no-bus-details");
	noBus.appendChild(imageBox);
	imageBox.appendChild(image);
	noBus.appendChild(details);
	details.append(`No Bus from ${from} to ${to}`);
}
function createBusList(i, listOfBus, date) {
	var busInfo = document.createElement("div");
	var busName = document.createElement("h1");
	var travelDate = document.createElement("h2");
	var startTime = document.createElement("div");
	var endTime = document.createElement("div");
	var travelHours = document.createElement("div");
	var ticketPrice = document.createElement("div");
	var selectButton = document.createElement("button");
	busList.appendChild(busInfo);
	busInfo.setAttribute("class", "bus");
	busInfo.setAttribute("id", `${i}-bus`);
	busName.setAttribute("class", "bus-detail list-bus-name");
	busName.setAttribute("id", `${i}-bus-name`);
	travelDate.setAttribute("class", "bus-detail");
	travelDate.setAttribute("id", `${i}-travel-date`);
	startTime.setAttribute("class", "bus-travel-details");
	startTime.setAttribute("id", `${i}-start-time`);
	endTime.setAttribute("class", "bus-travel-details list-end-time");
	endTime.setAttribute("id", `${i}-end-time`);
	travelHours.setAttribute("class", "bus-travel-details travel-hours");
	travelHours.setAttribute("id", `${i}-travel-hour`);
	ticketPrice.setAttribute("class", "bus-travel-details list-price");
	ticketPrice.setAttribute("id", `${i}-ticket-price`);
	selectButton.setAttribute("class", "select-ticket list-select");
	selectButton.setAttribute("id", `${i}-select-ticket`);
	selectButton.setAttribute("onclick", "getId(this.id)");
	busInfo.appendChild(busName);
	busInfo.appendChild(travelDate);
	busInfo.appendChild(startTime);
	busInfo.appendChild(endTime);
	busInfo.appendChild(travelHours);
	busInfo.appendChild(ticketPrice);
	busInfo.appendChild(selectButton);
	busName.append(listOfBus[i].busName);
	travelDate.append(date);
	startTime.append(`Start Time : ${listOfBus[i].start}`);
	endTime.append(`End Time : ${listOfBus[i].end}`);
	travelHours.append(`${listOfBus[i].hours} Hours`);
	ticketPrice.append(`Ticket Price : ${listOfBus[i].ticketPrice}`);
	selectButton.append(`Select Tickets`);
}

function getId(clickedId) {
	selectTheNoOfTickets(clickedId);
}
function selectTheNoOfTickets(clickedId) {
	listOfBusesPage.style = "display:none";
	ticketPage.style = "display:flex";
	mainPage.style.backgroundColor = "rgb(163,226,255)";
	selectedId = parseInt(clickedId);
	var ticketSubmitButton = document.getElementById("ticket-confirm");
	selectedBus = document.getElementById(`${selectedId}-bus-name`).innerHTML;
	selectedDate = document.getElementById(`${selectedId}-travel-date`).innerHTML;
	selectedStart = document.getElementById(`${selectedId}-start-time`).innerHTML;
	var endTime = document.getElementById(`${selectedId}-end-time`).innerHTML;
	var travelHours = document.getElementById(
		`${selectedId}-travel-hour`
	).innerHTML;
	selectedTicketPrice = document.getElementById(
		`${selectedId}-ticket-price`
	).innerHTML;
	document.getElementById("selected-bus-name").innerHTML = selectedBus;
	document.getElementById("selected-date").innerHTML = selectedDate;
	document.getElementById("selected-start-time").innerHTML = selectedStart;
	document.getElementById("selected-end-time").innerHTML = endTime;
	document.getElementById("selected-hours").innerHTML = travelHours;
	document.getElementById("selected-ticket-price").innerHTML =
		selectedTicketPrice;
}

function getTravelerInfo() {
	ticketPage.style = "display:none";
	travelerInfoPage.style = "display:flex";
	noOfTickets = document.getElementById("ticket-number").value;
	console.log(noOfTickets);
	document.getElementById("conform-location").innerHTML = selectedCity;
	document.getElementById("conform-bus-name").innerHTML = selectedBus;
	document.getElementById("confrom-date").innerHTML = selectedDate;
	document.getElementById("confrom-start").innerHTML = selectedStart;
	document.getElementById(
		"confrom-ticket-no"
	).innerHTML = `Number of Tickets : ${noOfTickets}`;
	document.getElementById("conform-price").innerHTML = selectedTicketPrice;
	travelerList.replaceChildren();
	for (let i = 0; i < noOfTickets; i++) {
		createTravelerInfo(i);
	}
	var travelerButton = document.getElementById("traveler-confrom-button");
	travelerButton.addEventListener("click", displayDetails);
}

function displayDetails() {
	var travelerRegister = validateNameAndAge();
	if (travelerRegister) {
		travelerInfoPage.style = "display:none";
		paymentPage.style = "display:flex";
		selectPayment();
	} else {
		alert("Fill name and age");
	}
}
function selectPayment() {
	detailList.replaceChildren();
	for (let i = 0; i < noOfTickets; i++) {
		createTravelerDetails(i);
	}
	var totalPrice = noOfTickets * selectedTicketPrice.match(/\d+/);
	console.log(totalPrice);
	document.getElementById("bus-confirmation").innerHTML = selectedBus;
	document.getElementById("location-confirmation").innerHTML = selectedCity;
	document.getElementById("date-confirmation").innerHTML = selectedDate;
	document.getElementById("start-confirmation").innerHTML = selectedStart;
	document.getElementById(
		"confirm-ticket-number"
	).innerHTML = `Number of Tickets : ${noOfTickets}`;
	document.getElementById("confirm-ticket-price").innerHTML =
		selectedTicketPrice;
	document.getElementById(
		"total-price"
	).innerHTML = `Total Price : ${totalPrice}`;
	var paymentButton = document.getElementById("payment-button");
	paymentButton.addEventListener("click", paybills);
}

function paybills() {
	var paymentMethod = document.getElementById("payment").value;
	if (paymentMethod == "UPI") {
		openUpiPage();
	} else {
		openCardPaymentPage();
	}
}

function openUpiPage() {
	paymentPage.style = "display:none";
	upiPage.style = "display:flex";
	mainPage.style.backgroundColor = "rgb(221,238,255)";
}
function openCardPaymentPage() {
	paymentPage.style = "display:none";
	cardPaymentPage.style = "display:flex";
	mainPage.style.backgroundColor = "rgb(224,243,255)";
}

function confirmTicket() {
	storeTicketDetails(
		username,
		selectedCity,
		selectedBus,
		selectedDate,
		selectedTicketPrice,
		noOfTickets
	);
	var doneButton = document.getElementById("done-button");
	doneButton.addEventListener("click", completeBooking);
}

function completeBooking() {
	upiPage.style = "display:none";
	cardPaymentPage.style = "display:none";
	mainPage.style.backgroundColor = "rgb(163, 226, 255)";
	conformModal.style = "display:none";
	citySelectionPage.style = "display:flex";
	clearAllInput();
}

function createTravelerDetails(i) {
	var number = i + 1;
	var name = document.getElementById(`${number}-traveler-name-input`).value;
	var age = document.getElementById(`${number}-traveler-age`).value;
	var gender = document.getElementById(`${number}-gender`).value;
	var customerInfo = document.createElement("div");
	var customerNameTag = document.createElement("div");
	var customerName = document.createElement("div");
	var customerAgeTag = document.createElement("div");
	var customerAge = document.createElement("div");
	var customerGenderTag = document.createElement("div");
	var customerGender = document.createElement("div");
	detailList.appendChild(customerInfo);
	customerInfo.setAttribute("class", "payment-page-details");
	customerInfo.setAttribute("id", "traveler-details");
	customerNameTag.setAttribute("class", "bus-travel-details");
	customerName.setAttribute("class", "bus-travel-details");
	customerAgeTag.setAttribute("class", "bus-travel-details");
	customerAge.setAttribute("class", "bus-travel-details");
	customerGenderTag.setAttribute("class", "bus-travel-details");
	customerGender.setAttribute("class", "bus-travel-details");
	customerInfo.appendChild(customerNameTag);
	customerInfo.appendChild(customerName);
	customerInfo.appendChild(customerAgeTag);
	customerInfo.appendChild(customerAge);
	customerInfo.appendChild(customerGenderTag);
	customerInfo.appendChild(customerGender);
	customerNameTag.append(`Name of the Traveler ${number}`);
	customerName.append(name);
	customerAgeTag.append(`Age of the Traveler ${number}`);
	customerAge.append(age);
	customerGenderTag.append(`Gender of the Traveler ${number}`);
	customerGender.append(gender);
}

function validateNameAndAge() {
	let flag = 0;
	for (let i = 0; i < noOfTickets; i++) {
		if (
			document.getElementById(`${i + 1}-traveler-name-input`).value != "" &&
			document.getElementById(`${i + 1}-traveler-age`).value != ""
		) {
			flag = 1;
			continue;
		} else {
			flag = 0;
			break;
		}
	}
	return flag;
}

function createTravelerInfo(i) {
	var number = i + 1;
	var travelerInfo = document.createElement("div");
	var nameOfTraveler = document.createElement("div");
	var nameInput = document.createElement("input");
	var ageOfTraveler = document.createElement("div");
	var ageInput = document.createElement("input");
	var genderOfTraveler = document.createElement("div");
	var genderSelector = document.createElement("select");
	var male = document.createElement("option");
	var female = document.createElement("option");
	var other = document.createElement("option");
	console.log(travelerList);
	travelerList.appendChild(travelerInfo);
	travelerInfo.setAttribute("class", "traveler");
	travelerInfo.setAttribute("id", `${number}-traveler`);
	nameOfTraveler.setAttribute("class", "bus-travel-details");
	nameInput.setAttribute("type", "text");
	nameInput.setAttribute("class", "traveler-input");
	nameInput.setAttribute("id", `${number}-traveler-name-input`);
	nameInput.setAttribute("placeholder", " Name of the Traveler");
	ageOfTraveler.setAttribute("class", "bus-travel-details");
	ageInput.setAttribute("type", "number");
	ageInput.setAttribute("class", "traveler-input");
	ageInput.setAttribute("id", `${number}-traveler-age`);
	ageInput.setAttribute("maxlength", "2");
	ageInput.setAttribute("size", "2");
	ageInput.setAttribute("placeholder", " Age");
	genderOfTraveler.setAttribute("class", "bus-travel-details");
	genderSelector.setAttribute("name", "gender");
	genderSelector.setAttribute("class", "card-input");
	genderSelector.setAttribute("id", `${number}-gender`);
	male.setAttribute("value", "Male");
	female.setAttribute("value", "Female");
	other.setAttribute("value", "Other");
	travelerInfo.appendChild(nameOfTraveler);
	travelerInfo.appendChild(nameInput);
	travelerInfo.appendChild(ageOfTraveler);
	travelerInfo.appendChild(ageInput);
	travelerInfo.appendChild(genderOfTraveler);
	travelerInfo.appendChild(genderSelector);
	genderSelector.appendChild(male);
	genderSelector.appendChild(female);
	genderSelector.appendChild(other);
	nameOfTraveler.append(`Name of Traveler ${number}`);
	ageOfTraveler.append(`Age of Traveler ${number}`);
	genderOfTraveler.append(`Gender of Traveler ${number}`);
	male.append("Male");
	female.append(`Female`);
	other.append(`other`);
}

function clearInput(i) {
	document.getElementById(`${i + 1}-traveler-name-input`).value = "";
	document.getElementById(`${i + 1}-traveler-age`).value = "";
	document.getElementById(`${i + 1}-gender`).value = "Male";
}

function importFromCityDataToDatalist() {
	const cities = document.getElementById("from-city-list");
	for (var city in fromData) {
		var options = document.createElement("OPTION");
		options.value = fromData[city].fromCity;
		cities.appendChild(options);
	}
}
function importToCItyDataToDatalist() {
	const toCities = document.getElementById("to-city-list");
	for (var city in toData) {
		var options = document.createElement("OPTION");
		options.value = toData[city].toCity;
		toCities.appendChild(options);
	}
}

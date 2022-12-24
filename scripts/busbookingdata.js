async function getLoginData(inputname, inputpassword) {
	var fetchUserData = await fetch("http://localhost:8000/userid", {
		method: "POST",
		headers: {
			"content-Type": "application/json",
		},
		body: JSON.stringify({
			username: inputname.value,
			password: inputpassword.value,
		}),
	});
	if (fetchUserData.ok) {
		alert("Login success");
		infoPage.style = "display:none";
		mainPage.style = "display:block";
		username = inputname.value;
		password = inputpassword.value;
		inputname.value = "";
		inputpassword.value = "";
		importFromCityDataToDatalist();
		importToCItyDataToDatalist();
	} else {
		alert("login failed");
	}
}

async function getMyTickets(username) {
	try {
		var myListOfTickets = await fetch("http://localhost:8000/myticket", {
			method: "POST",
			headers: {
				"content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
			}),
		});
		displayMyTickets(myListOfTickets);
	} catch (Error) {
		alert(Error.message);
	}
}
async function storeTicketDetails(
	username,
	selectedCity,
	selectedBus,
	selectedDate,
	selectedTicketPrice,
	noOfTickets
) {
	var ticketDetails = await fetch("http://localhost:8000/book", {
		method: "POST",
		headers: {
			"content-Type": "application/json",
		},
		body: JSON.stringify({
			username: username,
			location: selectedCity,
			busName: selectedBus,
			travelDate: selectedDate,
			ticketNumber: noOfTickets,
			ticketPrice: selectedTicketPrice,
		}),
	});
	if (ticketDetails.ok) {
		conformModal.style = "display:flex";
	} else {
		alert("Booking failed");
	}
}
async function addNewUser(newUser, newPassword) {
	var newUserId = await fetch("http://localhost:8000/signup", {
		method: "POST",
		headers: {
			"content-Type": "application/json",
		},
		body: JSON.stringify({
			username: newUser.value,
			password: newPassword.value,
		}),
	});
	if (newUserId.ok) {
		infoPage.style = "display:none";
		signupPage.style = "display:none";
		mainPage.style = "display:block";
		username = newUser.value;
		importFromCityDataToDatalist();
		importToCItyDataToDatalist();
	} else {
		alert("User already exsists");
	}
}

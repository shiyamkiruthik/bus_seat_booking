var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
let data = fs.readFileSync("usernames.json", "utf8");
data = JSON.parse(data);
app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/userid", (req, res) => {
	if (req.body.username in data) {
		if (req.body.password == data[req.body.username]) {
			res.status(200).json({ data: "success" });
			res.end();
		} else {
			res.status(404).json({ error: "invalid password" });
		}
	} else {
		res.status(404).json({ error: "not found" });
		res.end();
	}
});

app.post("/book", (req, res) => {
	if (req.body.username in data) {
		bookticket(req.body);
		res.status(200).json({ data: "booked" });
		res.end();
	} else {
		res.status(404).json({ error: "ticket can't be booked" });
	}
});

function bookticket(ticket) {
	var ticketBox = fs.readFileSync(`./users/${ticket.username}.json`, "utf8");
	var ticketContent = {};
	var totalPrice = ticket.ticketNumber * ticket.ticketPrice.match(/\d+/);
	ticketContent["location"] = ticket.location;
	ticketContent["bus"] = ticket.busName;
	ticketContent["date"] = ticket.travelDate;
	ticketContent["noOfTicket"] = ticket.ticketNumber;
	ticketContent["ticketPrice"] = ticket.ticketPrice;
	ticketContent["totalPrice"] = totalPrice;
	ticketBox = JSON.parse(ticketBox);
	ticketBox["tickets"].push(ticketContent);
	ticketBox = JSON.stringify(ticketBox);
	fs.writeFile(`./users/${ticket.username}.json`, ticketBox, () => {});
}

app.post("/myticket",(req,res) => {
	var myTicket = fs.readFileSync(`./users/${req.body.username}.json`, "utf8");
	myTicket = JSON.parse(myTicket);
	res.send(myTicket);
	res.end();
})

app.post("/signup", (req, res) => {
	if (!(req.body.username in data)) {
		data[req.body.username] = req.body.password;
		var mailData = JSON.stringify(data);
		fs.writeFile("usernames.json", mailData, () => {});
		var ticketDetails = { tickets: [] };
		ticketDetails = JSON.stringify(ticketDetails);
		fs.writeFile(`./users/${req.body.username}.json`, ticketDetails, () => {});
		res.status(200).json({ data: "success" });
		res.end();
	} else {
		res.status(404).json({ error: "already exists" });
		res.end();
	}
});

app.listen(8000);

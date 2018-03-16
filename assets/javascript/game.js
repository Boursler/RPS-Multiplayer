
// Initialize Firebase
var config = {
	apiKey: "AIzaSyBX2RCAXFTaxgDG2aTsH3GQqSRph-zGyx8",
	authDomain: "rps-multiplayer-8bfc4.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-8bfc4.firebaseio.com",
	projectId: "rps-multiplayer-8bfc4",
	storageBucket: "rps-multiplayer-8bfc4.appspot.com",
	messagingSenderId: "297548366834"
};

firebase.initializeApp(config);
var database = firebase.database();
function Player(name) {
	this.name = name;
	this.wins = 0
	this.losses = 0;
	this.play;
}
var player1;
var player2;
var childrenCount;
var rpsGame = {
	R: 0,
	P: 1,
	S: 2,

	play: function () {
		var outcome = (rpsGame.player2.guess - rpsGame.player1.guess + 3) % 3;
		if (outcome === 1) {
			rpsGame.player2.wins++;
			rpsGame.player1.losses++;
		}
		else if (outcome === 2) {
			rpsGame.player1.wins++;
			rpsGame.player2.losses++;
		}
		else if (outcome === 0) {
			//game is tied
		}
	}
}

function assignPlayer() {
	event.preventDefault();
	var name;
	name = $("#player1Name").val();
	console.log("adding name" + name);
	player1 = new Player(name)
	database.ref('players/' + nextId).set(player1);
}

function makePlay() {
	//check if there has been a play
	//if no:add play based on ID
	//if yes: don't allow play
}

$("#add-player1").click(assignPlayer);
$(".play").click(makePlay);



database.ref().on("value", function (data) {
	childrenCount = data.numChildren();
	var player_list;
	if (data.val() !== null) {
		player_list = data.val().players;
	}
	console.log(player_list);
	if (player_list)
		nextId = player_list.length;
	else
		nextId = 1;

	console.log("Next id: " + nextId);
	console.log(JSON.stringify(data))
	console.log(childrenCount + "numPlayers");
	if (childrenCount === 1) {
		console.log(data.val());

	}
	else if (childrenCount === 2) {
		console.log(data.val());
	}
	else {
		console.log("users full");
	}

}, function (error) {
	//handle error
});

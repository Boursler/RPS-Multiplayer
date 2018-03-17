
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
var playerId;
var rpsGame = {
	R: 0,
	P: 1,
	S: 2,

	play: function () {
		var outcome = (player2.play - player1.play + 3) % 3;
		if (outcome === 1) {
			player2.wins++;
			player1.losses++;
		}
		else if (outcome === 2) {
			player1.wins++;
			player2.losses++;
		}
		else if (outcome === 0) {
			//game is tied
		}
	}
}

function assignPlayer() {
	event.preventDefault();
	var name;
	playerId = nextId;
	name = $("#player1Name").val();
	console.log("adding name" + name);
	player = new Player(name)
	database.ref('players/' + playerId).set(player);
	sessionStorage.setItem("playerName", player.name);
	sessionStorage.setItem("playerWins", player.wins);
	sessionStorage.setItem("playerLosses", player.losses);
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
	if (player_list) {
		nextId = player_list.length;


		console.log("Next id: " + nextId);
		console.log(JSON.stringify(data))
		console.log(childrenCount + "numPlayers");

	}
	else
		nextId = 1;


}, function (error) {
	//handle error
});

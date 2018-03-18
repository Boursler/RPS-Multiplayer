
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
function Player(name, playerId) {
	this.playerId = playerId;
	this.name = name;
	this.wins = 0
	this.losses = 0;
	this.play;
}

var player;
var childrenCount;
var playerId;
var rpsGame = {
	R: 0,
	P: 1,
	S: 2,

	play: function () {
		//TODO get these variables from somewhere
		var player1, player2;

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
	player = new Player(name, playerId)
	database.ref('players/' + playerId).set(player);
	// sessionStorage.setItem("playerName", player.name);
	// sessionStorage.setItem("playerWins", player.wins);
	// sessionStorage.setItem("playerLosses", player.losses);
	// sessionStorage.setItem("playerId", playerId);
	database.ref("players/" + playerId.toString()).onDisconnect().remove();
	// console.log(sessionStorage.getItem("playerName"));

}

function drawScreen() {
	// console.log(sessionStorage.getItem("playerName"));
	// if (sessionStorage.getItem("playerName") !== null) {
	if (player) {
		$("#player1").hide();
		$("#playerName").show();
		$("#playerName").text(player.name);
		$("#player1Wins").show().text(player.wins);
		$("#player1Losses").show().text(player.losses);
		// $("#playerName").text(sessionStorage.getItem("playerName"));
		// $("#player1Wins").show().text(sessionStorage.getItem("playerWins"));
		// $("#player1Losses").show().text(sessionStorage.getItem("playerLosses"));
	}
	else {
		$("#player1").show();
		$("#playerName").hide();
		$("#player1Wins").hide();
		$("#player1Losses").hide();
	}
}

function makePlay() {
	//check if there has been a play
	//if no:add play based on ID
	//if yes: don't allow play

	database.ref("players/" + player.playerId + "/play").set($(this).attr("id"));


}


$(".play").click(makePlay);



database.ref().on("value", function (data) {
	childrenCount = data.numChildren();
	console.log("changed:");
	var player_list;
	if (data.val() !== null) {
		player_list = data.val().players;
	}

	console.log(player_list);
	if (player_list) {
		nextId = player_list.length;


	}
	else
		nextId = 1;

	$("#add-player1").off("click");


	if (nextId < 3 && player === undefined) {
		console.log("huh");
		//prevent third player from joining
		$("#add-player1").click(assignPlayer);
	}

	drawScreen();
	console.log("change end");
}, function (error) {
	//handle error
});

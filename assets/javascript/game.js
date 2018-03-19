
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
	this.play = "";
}


var rpsGame = {
	R: 0,
	P: 1,
	S: 2,
	playerCount: 0,
	player: "",
	opponent: "",
	nextId: 3,

	play: function () {
		var outcome = (parseInt(this.opponent.play) - parseInt(this.player.play) + 3) % 3;
		if (outcome === 1) {
			//submit changes to database
			this.player.losses++;

		}
		else if (outcome === 2) {
			this.player.wins++;
			//submit changes to database

		}
		else if (outcome === 0) {
			//game is tied
		}
		this.player.play = "";
		database.ref("players/" + this.player.playerId).set(this.player);

	},
	submitPlay: function () {
		//check if there has been a play
		//if no:add play based on ID
		//if yes: don't allow play
		rpsGame.player.play = $(this).attr("value");
		database.ref("players/" + rpsGame.player.playerId + "/play").set(rpsGame.player.play);
	},
	assignPlayer: function () {
		event.preventDefault();
		var name;
		playerId = rpsGame.nextId;
		name = $("#player1Name").val();
		rpsGame.player = new Player(name, playerId)
		database.ref('players/' + playerId).set(rpsGame.player);
		database.ref("players/" + playerId.toString()).onDisconnect().remove();
	},
	updateGameState: function (data) {
		var player_list;
		if (data.val() !== null) {
			player_list = data.val().players;
			rpsGame.playerCount = player_list.length - 1;
			if (rpsGame.playerCount === 2) {
				rpsGame.nextId = 3;
			}
			else if (rpsGame.playerCount === 0) {
				rpsGame.nextId = 1;
			}
			else if (rpsGame.playerCount && player_list[1].playerId === 1) {
				rpsGame.nextId = 2;
			}
			else {
				rpsGame.nextId = 1;
			}
		}
		else {
			rpsGame.playerCount = 0;
			rpsGame.nextId = 1;
		}
		if (rpsGame.player) {
			if (rpsGame.playerCount === 2) {
				player_list[0] = player_list[2];
				rpsGame.opponent = player_list[(rpsGame.player.playerId + 1) % 2];


			}
			else if (rpsGame.playerCount === 1) {
				rpsGame.opponent = "";
			}
		}
	}

}



function drawScreen() {
	$("#add-player1").off("click");

	if (rpsGame.nextId < 3 && rpsGame.player === "") {
		$("#add-player1").click(rpsGame.assignPlayer);
	}
	if (rpsGame.player) {
		$("#player1").hide();
		$("#playerName").show();
		$("#playerName").text(rpsGame.player.name);
		$("#player1Wins").show().text(rpsGame.player.wins);
		$("#player1Losses").show().text(rpsGame.player.losses);

	}
	else {
		$("#player1").show();
		$("#playerName").hide();
		$("#player1Wins").hide();
		$("#player1Losses").hide();
	}
}
$(".play").click(rpsGame.submitPlay);

database.ref().on("value", function (data) {
	rpsGame.updateGameState(data);

	if (rpsGame.opponent !== "" && rpsGame.player !== "") {
		if (rpsGame.opponent.play !== "" && rpsGame.player.play !== "") {
			rpsGame.play();
		}
	}
	drawScreen();
}, function (error) {
	//handle error
});

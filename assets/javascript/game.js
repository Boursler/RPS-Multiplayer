
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
var nextMessage;
var message;
//player constructor
function Player(name, playerId) {
	this.playerId = playerId;
	this.name = name;
	this.wins = 0
	this.losses = 0;
	this.play = "";
}

//rps object
var rpsGame = {
	// R: 0,
	// P: 1,
	// S: 2,
	//key for outcomes
	playerCount: 0,
	player: "",
	opponent: "",
	nextId: 3,
	status: "",
	play: function () {

		var outcome = (parseInt(this.opponent.play) - parseInt(this.player.play) + 3) % 3;
		this.player.play = "";

		if (outcome === 1) {

			this.player.losses++;
			this.status = "lose";
		}
		else if (outcome === 2) {
			this.player.wins++;

			this.status = "win";
		}
		else if (outcome === 0) {

			this.status = "tie";
		}
		//update the database with new values
		database.ref("players/" + rpsGame.player.playerId).set(rpsGame.player);

	},
	submitPlay: function () {
		//submit a play to the database from value attribute of rock, paper, or scissors button
		rpsGame.player.play = $(this).attr("value");
		database.ref("players/" + rpsGame.player.playerId + "/play").set(rpsGame.player.play);
	},
	assignPlayer: function () {
		//assigns playerId based on nextId when the database changed, run player constructor on value entered into name form
		//set an onDisconnect listener to remove a node from the database when a player refreshes their browser or leaves the room.
		event.preventDefault();
		var name;
		playerId = rpsGame.nextId;
		name = $("#player1Name").val();
		rpsGame.player = new Player(name, playerId)
		database.ref('players/' + playerId).set(rpsGame.player);
		database.ref("players/" + playerId.toString()).onDisconnect().remove();
	},

	updateGameState: function (data) {
		//update game state
		var player_list;
		if (data.val() !== null) {
			player_list = data.val();
			//firebase gives player_list an extra empty element at the start of the array
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
				//store element 2 of player_list at position 0 to use the remainder operator to find the opponent
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
	//turn off clicks -- they will be turned on when needed
	$("#add-player1").off("click");
	$(".play").off("click");
	drawMessage();
	//turn on ability to assign a player if there are the less than the needed number of players and there isn't one in the room already
	if (rpsGame.nextId < 3 && rpsGame.player === "") {
		$("#add-player1").click(rpsGame.assignPlayer);
	}
	//show the relevant information
	if (rpsGame.player) {
		$("#player1").hide();
		$("#playerName").show();
		$("#playerName").text(rpsGame.player.name);
		$("#player1Wins").show().text(rpsGame.player.wins);
		$("#player1Losses").show().text(rpsGame.player.losses);
		$("#choiceDiv").show();
		$(".play").on("click", rpsGame.submitPlay);

	}
	else {
		$("#player1").show();
		$("#playerName").hide();
		$("#player1Wins").hide();
		$("#player1Losses").hide();
		$("#choiceDiv").hide();
		$(".play").off("click");
	}

	$("#opponent-name").text("");
	$("#playStatus").text("");
	if (rpsGame.opponent !== "") {
		$("#opponent-name").text("Opponent is: " + rpsGame.opponent.name);
		if (rpsGame.opponent.play === "") {
			$("#playStatus").text("Waiting for opponent play.");
		}
		else {
			$("#playStatus").text("");
		}
	} else if (rpsGame.player) {
		$("#opponent-name").text("Waiting for an opponent to join.");
	}
	if (rpsGame.status === "lose")
		$("#playStatus").text("You lost the last game");
	else if (rpsGame.status === "win")
		$("#playStatus").text("You won the last game");
	else if (rpsGame.status === "tie")
		$("#playStatus").text("The last game tied");
}

function makeMessage() {
	event.preventDefault();
	if (rpsGame.player) {
		var message = {
			content: $("#writeMessage").val().trim(),
			sender: rpsGame.player.name
		}
		database.ref("messages/" + nextMessage).set(message);
	}
}

function drawMessage() {
	$("#pastMessages").empty();
	if (rpsGame.player) {
		if (message !== null) {
			for (i = 1; i < message.length; i++) {
				var p = $("<p>");
				p = p.text(message[i].sender + ": " + message[i].content);
				$("#pastMessages").append(p);
			}
		}
	}
	else
		$("#pastMessages").append("Sorry, only players may use the messager.");
}

function messageState(messageData) {
	message = messageData.val();
	if (messageData.val() !== null)
		nextMessage = messageData.val().length;
	else
		nextMessage = 1;
}

$("#sendMessage").click(makeMessage);

//listen to changes at the players node
database.ref("players/").on("value", function (data) {
	rpsGame.updateGameState(data);

	if (rpsGame.opponent !== "" && rpsGame.player !== "") {
		if (rpsGame.opponent.play !== "" && rpsGame.player.play !== "") {
			rpsGame.play();
		}
	}

	drawScreen();
}, function (error) {
	//handle error
	console.log("Encountered error " + error.code);
});
//listen to changes at the messages node
database.ref("messages/").on("value", function (messageData) {
	messageState(messageData);
	drawMessage();
}, function (error) {
	//handle error
	console.log("Encountered error " + error.code);
});

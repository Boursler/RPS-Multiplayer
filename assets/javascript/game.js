
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
var rpsGame = {
	R: 0,
	P: 1,
	S: 2,
	Player: function (name) {
		this.name = name;
		this.wins = 0
		this.losses = 0;
		this.guess = "";
	},
	player1: new Player(player1),
	player2: new Player(player2),
	play: function () {
		var outcome = rpsGame.player2.guess - rpsGame.player1.guess % 3;
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

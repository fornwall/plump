function bid(game) {
	var myBid = Math.ceil(game.myCards.length / game.players.length);
	if (myBid == game.forbiddenBid) {
		myBid = myBid + (myBid != game.myCards.length ? 1 : -1);
	}
	return myBid;
}

function play(game) {
	var me = null;
	game.players.forEach(function(player) {
		if (player.me) {
			me = player;
		}
	});
	var firstOnTable = game.cardsOnTable.length == 0;
	var lastOnTable = game.cardsOnTable.length == game.players.length - 1;
	if (me.bid > me.takenTricks) {
		if (firstOnTable) {
			return playFirstCardToWin(game);
		} else if (lastOnTable) {
			return playLastCardToWin(game);
		} else {
			return playCardToWin(game);
		}
	} else {
		if (firstOnTable) {
			return playFirstCardToLose(game);
		} else {
			return playCardToLose(game);
		}
	}
}

function bestCardOnTable(game) {
	var bestCard = game.cardsOnTable[0].card;
	game.cardsOnTable.forEach(function (onTable) {
		if (onTable.card.suit == bestCard.suit && onTable.card.rank > bestCard.rank) {
			 bestCard = onTable.card;
		}
	});
	return bestCard;
}

function playFirstCardToWin(game) {
	var myBestAlternative = null;
	game.myCards.forEach(function (card) {
		if (myBestAlternative == null || myBestAlternative.rank < card.rank) {
			myBestAlternative = card;
		}
	});
	return myBestAlternative;
}

function playFirstCardToLose(game) {
	var myBestAlternative = null;
	game.myCards.forEach(function (card) {
		if (myBestAlternative == null || myBestAlternative.rank > card.rank) {
			myBestAlternative = card;
		}
	});
	return myBestAlternative;
}

function playCardToWin(game) {
	var bestCard = bestCardOnTable(game);
	var myBestAlternative = null;
	game.myCards.forEach(function (card) {
		if (card.suit == bestCard.suit) {
			if (myBestAlternative == null ||
				myBestAlternative.rank < bestCard.rank && (card.rank > bestCard.rank || card.rank < myBestAlternative.rank) ||
				myBestAlternative.rank > bestCard.rank && card.rank > myBestAlternative.rank) {
				myBestAlternative = card;
			}
		}
	});
	if (myBestAlternative == null) {
		game.myCards.forEach(function (card) {
			if (myBestAlternative == null || myBestAlternative.rank > card.rank) {
				myBestAlternative = card;
			}
		});
	}
	return myBestAlternative;
}

function playCardToLose(game) {
	var bestCard = bestCardOnTable(game);
	var myBestAlternative = null;
	game.myCards.forEach(function (card) {
		if (card.suit == bestCard.suit) {
			if (myBestAlternative == null ||
				myBestAlternative.rank < bestCard.rank && card.rank < bestCard.rank && card.rank > myBestAlternative.rank ||
				myBestAlternative.rank > bestCard.rank && card.rank < bestCard.rank) {
				myBestAlternative = card;
			}
		}
	});
	if (myBestAlternative == null) {
		game.myCards.forEach(function (card) {
			if (myBestAlternative == null || myBestAlternative.rank < card.rank) {
				myBestAlternative = card;
			}
		});
	}
	return myBestAlternative;
}

function playLastCardToWin(game) {
	var bestCard = bestCardOnTable(game);
	var myBestAlternative = null;
	game.myCards.forEach(function (card) {
		if (card.suit == bestCard.suit) {
			if (myBestAlternative == null ||
				myBestAlternative.rank < bestCard.rank && (card.rank > bestCard.rank || card.rank < myBestAlternative.rank) ||
				myBestAlternative.rank > bestCard.rank && card.rank > bestCard.rank && card.rank < myBestAlternative.rank) {
				myBestAlternative = card;
			}
		}
	});
	if (myBestAlternative == null) {
		game.myCards.forEach(function (card) {
			if (myBestAlternative == null || myBestAlternative.rank > card.rank) {
				myBestAlternative = card;
			}
		});
	}
	return myBestAlternative;
}

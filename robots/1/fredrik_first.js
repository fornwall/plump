// fredrik_first.js - first shot at domination!

function bid(game) {
	var valuedCards = computeCardValues(game);
	var totalValue = 0;
	for (var i = 0; i < valuedCards.length; i++) totalValue += valuedCards[i].value;
	totalValue = Math.round(totalValue);
	if (totalValue == game.forbiddenBid) totalValue -= 1;
	if (totalValue == -1) totalValue = 2;
	return totalValue; // game.myCards.length;
}

function play(game) {
	var valuedCards = computeCardValues(game);
	console.log('########### for cardsPerPlayer=' + game.myCards.length + 'valued= ' + valuedCards);
	var me = game.players.filter(function(p) { return p.me; })[0];
	console.log('cardsOnTable=' + game.cardsOnTable.length);
	var cardsFollowingSuit = (game.cardsOnTable.length == 0) ? valuedCards : valuedCards.filter(function(vc) { return vc.card.suit == game.cardsOnTable[0].card.suit; });
	var mayFollowSuit = cardsFollowingSuit.length > 0;
	if (me.bid > me.takenTricks) {
		return mayFollowSuit ? cardsFollowingSuit[cardsFollowingSuit.length-1].card : valuedCards[0].card;
	} else {
		return mayFollowSuit ? cardsFollowingSuit[0].card : valuedCards[valuedCards.length-1].card;
	}
}

var ALL_SUITS = ['CLUBS', 'DIAMONDS', 'HEARTS', 'SPADES'];

function ValuedCard(card, value) {
	this.card = card;
	this.value = value;
}
ValuedCard.prototype.toString = function() { return this.card + ',value=' + this.value; };

function mapCards(cards) {
	var m = {};
	ALL_SUITS.forEach(function(s) { m[s] = []; });
	cards.forEach(function(c) { m[c.suit].push(c.rank); });
	return m;
}

function computeCardValues(game) {
	var allKnownCards = [];
	game.players.forEach(function(p) { p.playedCards.forEach(function(c) { allKnownCards.push(c); }); });
	var unknownCardsRemaining = game.players.length * game.myCards.length - allKnownCards.length;
	console.log('unknownCardsRemaining=' + unknownCardsRemaining);
	game.myCards.forEach(function(c) { allKnownCards.push(c); });
	// Of the unknown cards, how many are in other players hands?
	var remainingRatio = unknownCardsRemaining / 52.0;
	console.log('All known: ' + allKnownCards);

	var valuedCards = [];
	for (var i = 0; i < game.myCards.length; i++) {
		var c = game.myCards[i];
		var higherCardsNotOwnedByMe = 14 - c.rank;
		var lowerCardsNotOwnedByMe = c.rank - 2;
		for (var j = 0; j < allKnownCards.length; j++) {
			var otherCard = allKnownCards[j];
			if (otherCard.suit == c.suit) {
				if (otherCard.rank > c.rank) {
					higherCardsNotOwnedByMe--;
				} else if (otherCard.rank < c.rank) {
					lowerCardsNotOwnedByMe--;
				}
			}
		}
		var poolSize = 52.0 - allKnownCards.length;
		var chanceNoOneHasHigher = 1.0;
		for (j = 0; j < higherCardsNotOwnedByMe; j++) {
			poolSize--;
			chanceNoOneHasHigher *= Math.pow((poolSize - higherCardsNotOwnedByMe) / poolSize, unknownCardsRemaining);
		}
		
		valuedCards.push(new ValuedCard(c, chanceNoOneHasHigher));
	}

	valuedCards.sort(function(a, b) { return a.value - b.value; });
	return valuedCards;
}

function bid(game) {
	var bid = 0;
    	if(game.forbiddenBid == 0) {
        return bid+1;
	}
	var topCard = highLow(game.myCards, 1);
	if(topCard.rank == 14 || topCard.rank == 13) {
		return bid+1;
	}
		return 0;
}

function play(game) {
	if (game.cardsOnTable.length != 0) {
		var firstCardSuit = game.cardsOnTable[0].card.suit;
		var cards = getCardsWithSuit(game.myCards, firstCardSuit);
		if (cards.length != 0) {
		    return cards[0];
			}
			else {
			return highLow(game.myCards, 1);
			}
	}
    return highLow(game.myCards, 0);
}

function highLow(toSort, flag) {
	toSort.sort(sortNumber);
	if(flag == 0) {
	return toSort[0];
	}
	else {
	return toSort[toSort.length-1];
	}
}

function sortNumber(a,b)
{
return a.rank - b.rank;
}

function getCardsWithSuit(cards, suit) {
    cards.sort(cardSorter);
    var suited = [];
    cards.forEach(function(card) {
        if (card.suit == suit) suited.push(card);
    });
    return suited;
}

function cardSorter(a, b) {
    if (a.suit != b.suit) {
        return a.suit < b.suit;
    }
    return a.rank - b.rank;
}


var LOW_CARD_END = 9;
var numberOfCards;

function bid(game) {
    numberOfCards = game.myCards.length;
    var map = getSuitsSortedByLength(game.myCards);
    var bid = 0;
    map.forEach(function(cardsInSuit) {
        cardsInSuit.forEach(function(card) {
            var delta = (card.rank - LOW_CARD_END) / (14 - LOW_CARD_END);
            bid += Math.max(0, delta);
        });
    });
    bid = Math.round(bid);

    if (bid == game.forbiddenBid) {
        if (bid == 0) ++bid;
        else --bid;
    }
    
	return bid;
}

function play(game) {
    var bidSum = 0;
    game.players.forEach(function(player) { bidSum += player.bid; });
    var overTricks = bidSum >= numberOfCards;

    var bidFulfilled = false;
    var busted = false;
    game.players.forEach(function(player) {
        if (player.me) {
            bidFulfilled = player.takenTricks == player.bid;
            busted = player.takenTricks > player.bid;
        }
    });
	if (game.cardsOnTable.length > 0) {
		var firstCard = game.cardsOnTable[0].card;
		var cardsInSuit = getCardsWithSuit(game.myCards, firstCard.suit);
		if (cardsInSuit.length != 0) {
		    var highestCardOnTableInSuit = firstCard;
		    game.cardsOnTable.forEach(function (tableCard) {
		        if (tableCard.card.suit == firstCard.suit
		                && tableCard.card.rank > highestCardOnTableInSuit.rank) {
		            highestCardOnTableInSuit = tableCard.card;
		        }
        	});
		    if (bidFulfilled) {
    		    var cardToPlay = null;

    	        cardsInSuit.reverse();
    	        cardsInSuit.forEach(function(card) {
    	            if (card.rank < highestCardOnTableInSuit.rank) {
    	                cardToPlay = card;
    	            }
    	        });
    	        cardsInSuit.reverse();
    	        
    		    if (cardToPlay) return cardToPlay;
		        else return cardsInSuit[0];
    	        
		    } else {
		        if (!busted) {
		            // Try to take
        		    cardToPlay = null;
        	        cardsInSuit.forEach(function(card) {
        	            if (card.rank > highestCardOnTableInSuit.rank) {
        	                cardToPlay = card;
        	            }
        	        });
        		    if (cardToPlay) return cardToPlay;
    		        else return cardsInSuit[0];
		            
		        } else {
		            // We're busted, destroy for others
		            var players = game.players.sort(function(a, b) {
		                return b.score - a.score;
		            });
	                var highest = null;
                    game.cardsOnTable.forEach(function (tableCard) {
                        if (!highest) highest = tableCard;
        		        else if (tableCard.card.suit == firstCard.suit
        		                && tableCard.card.rank > highest.card.rank) {
        		            highest = tableCard;
        		        }
                    });
	                // 1. Take from another
                    if (highest.player.takenTricks + 1 == highest.player.bid) {
                        for (var i = 0; i < cardsInSuit.length; i++) {
                            if (cardsInSuit[i].rank > highest.card.rank) {
                                return cardsInSuit[i];
                            }
                        }
                    }
	                // 2. Make another take
	                if (highest.player.takenTricks == highest.player.bid) {
                        for (i = 0; i < cardsInSuit.length; i++) {
                            if (cardsInSuit[i].rank < highest.card.rank) {
                                return cardsInSuit[i];
                            }
                        }
	                }
	                // 3. Over or under tricks?
	                if (overTricks) {
	                    return cardsInSuit[0];
	                } else {
	                    return cardsInSuit[cardsInSuit.length - 1];
	                }
		        }
	        }
		} else {
		    // We must discard
	        highest = null;
	        game.myCards.forEach(function(card) {
	            if (!highest) highest = card;
	            else if (card.rank > highest.rank) highest = card;
	        });
	        var lowest = null;
	        game.myCards.forEach(function(card) {
	            if (!lowest) lowest = card;
	            else if (card.rank < lowest.rank) lowest = card;
	        });
		    if (bidFulfilled) {
		        // Highest possible
		        return highest;
		    } else {
		        if (busted) {
	                if (overTricks) {
	                    return lowest;
	                } else {
	                    return highest;
	                }
		        } else {
    		        // Lowest possible
    		        return lowest;
		        }
		    }
		}
	}

	var cardsMap = getSuitsSortedByLength(game.myCards);
	if (bidFulfilled) {
    	// Play lowest possible in the suit with least cards
    	for (var r = 2; r <= 14; r++) {
    	    for (i = 0; i < cardsMap.length; i++) {
    	        for (var c = 0; c < cardsMap[i].length; c++) {
    	            var card = cardsMap[i][c];
    	            if (card.rank == r) {
    	                return card;
    	            }
    	        }
    	    }
    	}
	} else if (!busted) {
	    // Try to take with high card
    	for (r = 14; r >= 2; r--) {
    	    for (i = 0; i < cardsMap.length; i++) {
    	        for (c = 0; c < cardsMap[i].length; c++) {
    	            card = cardsMap[i][c];
    	            if (card.rank == r) {
    	                return card;
    	            }
    	        }
    	    }
    	}
	}
	// We're busted, destroy for others
	highest = null;
    game.myCards.forEach(function(card) {
        if (!highest) highest = card;
        else if (card.rank > highest.rank) highest = card;
    });
    lowest = null;
    game.myCards.forEach(function(card) {
        if (!lowest) lowest = card;
        else if (card.rank < lowest.rank) lowest = card;
    });
    
    if (overTricks) {
        return highest;
    } else {
        return lowest;
    }
}

function getSuitsSortedByLength(cards) {
    var suits = [];
    suits.push(getCardsWithSuit(cards, "HEARTS"));
    suits.push(getCardsWithSuit(cards, "SPADES"));
    suits.push(getCardsWithSuit(cards, "DIAMONDS"));
    suits.push(getCardsWithSuit(cards, "CLUBS"));
    suits.sort(function(a, b) {
        return b.length < a.length;
    });
    return suits;
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

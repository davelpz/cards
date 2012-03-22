
_suites = ["Spades","Hearts","Diamonds","Clubs"]
_ranks = ["Ace","2","3","4","5","6","7","8","9","10","Jack","Queen","King"]

class Card
	constructor: (@rank,@suite,@faceUp=false)->

	equal: (arg) ->
		return @suite is arg.suite and @rank is arg.rank

	isFaceUp: ->
		faceUp is true

	faceUp: (arg=true) ->
		faceUp = arg

	toString: ->
		"Card(#{@rank},#{@suite})"

class Stack
	constructor: (@cards=[])->
	
	shuffle: ->
		newcards =  while @cards.length > 0
			index =  Math.floor(Math.random() * @cards.length) 
			@cards.splice(index,1)[0]
		@cards = newcards
		this

	length: ->
		@cards.length

	takeFromTop: ->
		l = @cards.length
		if l > 0
			t = @cards[l-1]
			@cards.length-=1
		t
	putOnTop: (card)->
		@cards.push(card)
		this
	dump: ->
		for i in [0...@cards.length]
			console.log(""+@cards[i])

class Deck extends Stack
	constructor: (decks=1)->
		super []

		for i in [0...decks]			
			for s in _suites
				for r in _ranks
					t = new Card(r,s)
					@cards.push(t)

window.Card = Card
window.Stack = Stack
window.Deck = Deck
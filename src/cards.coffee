
_suites = ["Spades","Hearts","Clubs","Diamonds"]
_ranks = ["Ace","2","3","4","5","6","7","8","9","10","Jack","Queen","King"]

class Card
	constructor: (@rank,@suite,@faceUp=false)->

	equal: (arg) ->
		return @suite is arg.suite and @rank is arg.rank

	sameSuite: (arg) ->
		return @suite is arg.suite

	sameRank: (arg) ->
		return @rank is arg.rank

	sameColor: (arg) ->
		if @suite is "Spades" or @suite is "Clubs"
			return arg.suite is "Spades" or arg.suite is "Clubs"
		else if @suite is "Hearts" or @suite is "Diamonds"
			return arg.suite is "Hearts" or arg.suite is "Diamonds"

	isLower: (arg) ->
		_ranks.indexOf(arg.rank) < _ranks.indexOf(@rank)

	isFaceUp: ->
		@faceUp is true

	setFaceUp: (arg=true) ->
		@faceUp = arg
		this

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

	clear: ->
		@cards.length=0
		this

	topCard: ->
		l = @cards.length
		if l > 0
			@cards[l-1]
		else
			undefined

	takeFromTop: ->
		l = @cards.length
		if l > 0
			t = @cards[l-1]
			@cards.length--
		t

	putOnTop: (card)->
		@cards.push(card)
		this

	takeFromBottom: ->
		if @cards.length > 0
			t = @cards.shift()
		t

	putOnBottom: (card)->
		@cards.unshift(card)
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

class Board
	constructor: ->
		@init()

	init: ->
		@stock = new Deck()
		@stock.shuffle()
		@waste = new Stack()
		@tableau = [new Stack(),new Stack(),new Stack(),new Stack(),new Stack(),new Stack(),new Stack()]
		@foundation = [new Stack(),new Stack(),new Stack(),new Stack()]

		for i in [0..6]
			for t in [i..6]
				@tableau[t].putOnTop(@stock.takeFromTop())

		for i in [0..6]
			@tableau[i].topCard().setFaceUp()

		this

	deal: ->
		if @stock.length()
			c = @stock.takeFromTop()
			c.setFaceUp()
			@waste.putOnTop(c)

			c = @stock.takeFromTop()
			if c
				c.setFaceUp()
				@waste.putOnTop(c)

			c = @stock.takeFromTop()
			if c
				c.setFaceUp()
				@waste.putOnTop(c)
		else
			for c in @waste.cards
				c.setFaceUp(false)
				@stock.putOnBottom(c)
			@waste.clear()

		this

	wasteToFoundation:(index=0) ->
		if @waste.length()
			c = @waste.takeFromTop()
			c.setFaceUp()
			@foundation[index].putOnTop(c)
			true
		else
			false

window.Card = Card
window.Stack = Stack
window.Deck = Deck
window.Board = Board
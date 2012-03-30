
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
		if @suite is _suites[0] or @suite is _suites[2]
			return arg.suite is _suites[0] or arg.suite is _suites[2]
		else if @suite is _suites[1] or @suite is _suites[3]
			return arg.suite is _suites[1] or arg.suite is _suites[3]

	isLower: (arg) ->
		_ranks.indexOf(arg.rank) < _ranks.indexOf(@rank)

	isHigher: (arg) ->
		_ranks.indexOf(arg.rank) > _ranks.indexOf(@rank)

	isFaceUp: ->
		@faceUp is true

	setFaceUp: (arg=true) ->
		@faceUp = arg
		this

	toString: ->
		"Card(#{@rank},#{@suite})"

class _cardEncode
	@encode: (card) ->
		val = 33 + _suites.indexOf(card.suite) * 13
		val += _ranks.indexOf(card.rank)
		if (card.isFaceUp())
			val += 52

		String.fromCharCode(val)

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

	getState: ->
		val = ""
		for i in [0...@cards.length]
			val += _cardEncode.encode(@cards[i])
		val

	dump: ->
		for i in [0...@cards.length]
			console.log(""+i+": "+@cards[i])
			@cards[i].setFaceUp()


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

	_stackToStack: (stack1,stack2) ->
		if stack1 and stack2 and stack1.length()
			c = stack1.takeFromTop()
			stack2.putOnTop(c)
			c
		else
			false

	wasteToFoundation:(fIndex=0) ->
		if @_stackToStack(@waste,@foundation[fIndex])
			true
		else
			false

	foundationToWaste:(fIndex=0) ->
		if @_stackToStack(@foundation[fIndex],@waste)
			true
		else
			false

	wasteToTableau:(tIndex=0) ->
		if @_stackToStack(@waste,@tableau[tIndex])
			true
		else
			false

	tableauToWaste:(tIndex=0) ->
		if @_stackToStack(@tableau[tIndex],@waste)
			true
		else
			false

	tableauToFoundation: (tIndex=0,fIndex=0) ->
		if @_stackToStack(@tableau[tIndex],@foundation[fIndex])
			true
		else
			false

	tableauToTableau: (tIndex1=0,count=1,tIndex2=0) ->
		return false if @tableau[tIndex1].length() < count 

		s = new Stack()
		for i in [0...count]
			@_stackToStack(@tableau[tIndex1],s)

		for i in [0...count]
			return false if not @_stackToStack(s,@tableau[tIndex2]) 

		true

	foundationToTableau: (fIndex=0,tIndex=0) ->
		if @_stackToStack(@foundation[fIndex],@tableau[tIndex])
			true
		else
			false
		
window.Card = Card
window.Stack = Stack
window.Deck = Deck
window.Board = Board
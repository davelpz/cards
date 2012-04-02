
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

	isOneLower: (arg) ->
		_ranks.indexOf(@rank) - _ranks.indexOf(arg.rank) is 1

	isOneHigher: (arg) ->
		_ranks.indexOf(arg.rank) - _ranks.indexOf(@rank) is 1

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
	@decode: (arg) ->
		faceUp=false
		arg -= 33
		if (arg > 52)
			faceUp = true
			arg -= 52
		suite = Math.floor(arg / 13)
		rank = arg % 13
		new Card(_ranks[rank],_suites[suite],faceUp)

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

	equal: (arg) ->
		arg.getState() is @getState()
	
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

	initFromState: (state) ->
		newcards = for c in state
			_cardEncode.decode(c.charCodeAt(0))
		@cards = newcards
		this

	dump: ->
		for i in [0...@cards.length]
			console.log(""+i+": "+@cards[i])
			@cards[i].setFaceUp()
		for i in [0...@cards.length]
			@cards[i].setFaceUp(false)
		state = @getState()
		for c in state
			console.log(c.charCodeAt(0))
		for i in [0...@cards.length]
			@cards[i].setFaceUp()
		state = @getState()
		for c in state
			console.log(c.charCodeAt(0))


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

class Klondike extends Board
	constructor: ->
		super
		@score = 0
		@undo = []

	wasteToTableau:(tIndex=0) ->
		tab = @tableau[tIndex]
		tTopCard = tab.topCard()
		wTopCard = @waste.topCard()

		if tab.length() > 0 and tTopCard and wTopCard and tTopCard.isOneLower(wTopCard) and not tTopCard.sameColor(wTopCard)
			@score += 5
			super(tIndex)
		else
			false

	wasteToFoundation:(fIndex=0) ->
		tab = @foundation[fIndex]
		fTopCard = tab.topCard()
		wTopCard = @waste.topCard()

		if tab.length() > 0 
			if fTopCard and wTopCard and fTopCard.isOneHigher(wTopCard) and fTopCard.suite is wTopCard.suite
				@score += 10
				return super(fIndex)
		else
			if (wTopCard.rank is "Ace")
				@score += 10
				return super(fIndex)

		false

	foundationToTableau: (fIndex=0,tIndex=0) ->
		fStack = @foundation[fIndex]
		tStack = @tableau[tIndex]
		tTopCard = tStack.topCard()
		fTopCard = fStack.topCard()

		if tTopCard and fTopCard and tTopCard.isOneLower(fTopCard) and not tTopCard.sameColor(fTopCard)
			@score -= 15
			super(fIndex,tIndex)
		else
			false

window.Card = Card
window.Stack = Stack
window.Deck = Deck
window.Board = Board
window.Klondike = Klondike
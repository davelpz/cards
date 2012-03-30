(function() {
  var Board, Card, Deck, Stack, _cardEncode, _ranks, _suites,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  _suites = ["Spades", "Hearts", "Clubs", "Diamonds"];

  _ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

  Card = (function() {

    function Card(rank, suite, faceUp) {
      this.rank = rank;
      this.suite = suite;
      this.faceUp = faceUp != null ? faceUp : false;
    }

    Card.prototype.equal = function(arg) {
      return this.suite === arg.suite && this.rank === arg.rank;
    };

    Card.prototype.sameSuite = function(arg) {
      return this.suite === arg.suite;
    };

    Card.prototype.sameRank = function(arg) {
      return this.rank === arg.rank;
    };

    Card.prototype.sameColor = function(arg) {
      if (this.suite === _suites[0] || this.suite === _suites[2]) {
        return arg.suite === _suites[0] || arg.suite === _suites[2];
      } else if (this.suite === _suites[1] || this.suite === _suites[3]) {
        return arg.suite === _suites[1] || arg.suite === _suites[3];
      }
    };

    Card.prototype.isLower = function(arg) {
      return _ranks.indexOf(arg.rank) < _ranks.indexOf(this.rank);
    };

    Card.prototype.isHigher = function(arg) {
      return _ranks.indexOf(arg.rank) > _ranks.indexOf(this.rank);
    };

    Card.prototype.isFaceUp = function() {
      return this.faceUp === true;
    };

    Card.prototype.setFaceUp = function(arg) {
      if (arg == null) arg = true;
      this.faceUp = arg;
      return this;
    };

    Card.prototype.toString = function() {
      return "Card(" + this.rank + "," + this.suite + ")";
    };

    return Card;

  })();

  _cardEncode = (function() {

    function _cardEncode() {}

    _cardEncode.encode = function(card) {
      var val;
      val = 33 + _suites.indexOf(card.suite) * 13;
      val += _ranks.indexOf(card.rank);
      if (card.isFaceUp()) val += 52;
      return String.fromCharCode(val);
    };

    return _cardEncode;

  })();

  Stack = (function() {

    function Stack(cards) {
      this.cards = cards != null ? cards : [];
    }

    Stack.prototype.shuffle = function() {
      var index, newcards;
      newcards = (function() {
        var _results;
        _results = [];
        while (this.cards.length > 0) {
          index = Math.floor(Math.random() * this.cards.length);
          _results.push(this.cards.splice(index, 1)[0]);
        }
        return _results;
      }).call(this);
      this.cards = newcards;
      return this;
    };

    Stack.prototype.length = function() {
      return this.cards.length;
    };

    Stack.prototype.clear = function() {
      this.cards.length = 0;
      return this;
    };

    Stack.prototype.topCard = function() {
      var l;
      l = this.cards.length;
      if (l > 0) {
        return this.cards[l - 1];
      } else {
        return;
      }
    };

    Stack.prototype.takeFromTop = function() {
      var l, t;
      l = this.cards.length;
      if (l > 0) {
        t = this.cards[l - 1];
        this.cards.length--;
      }
      return t;
    };

    Stack.prototype.putOnTop = function(card) {
      this.cards.push(card);
      return this;
    };

    Stack.prototype.takeFromBottom = function() {
      var t;
      if (this.cards.length > 0) t = this.cards.shift();
      return t;
    };

    Stack.prototype.putOnBottom = function(card) {
      this.cards.unshift(card);
      return this;
    };

    Stack.prototype.getState = function() {
      var i, val, _ref;
      val = "";
      for (i = 0, _ref = this.cards.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        val += _cardEncode.encode(this.cards[i]);
      }
      return val;
    };

    Stack.prototype.dump = function() {
      var i, _ref, _ref2, _results;
      for (i = 0, _ref = this.cards.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        console.log("" + i + ": " + this.cards[i]);
        console.log(_cardEncode.encode(this.cards[i]));
        this.cards[i].setFaceUp();
      }
      _results = [];
      for (i = 0, _ref2 = this.cards.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        console.log("" + i + ": " + this.cards[i]);
        _results.push(console.log(_cardEncode.encode(this.cards[i])));
      }
      return _results;
    };

    return Stack;

  })();

  Deck = (function(_super) {

    __extends(Deck, _super);

    function Deck(decks) {
      var i, r, s, t, _i, _j, _len, _len2;
      if (decks == null) decks = 1;
      Deck.__super__.constructor.call(this, []);
      for (i = 0; 0 <= decks ? i < decks : i > decks; 0 <= decks ? i++ : i--) {
        for (_i = 0, _len = _suites.length; _i < _len; _i++) {
          s = _suites[_i];
          for (_j = 0, _len2 = _ranks.length; _j < _len2; _j++) {
            r = _ranks[_j];
            t = new Card(r, s);
            this.cards.push(t);
          }
        }
      }
    }

    return Deck;

  })(Stack);

  Board = (function() {

    function Board() {
      this.init();
    }

    Board.prototype.init = function() {
      var i, t;
      this.stock = new Deck();
      this.stock.shuffle();
      this.waste = new Stack();
      this.tableau = [new Stack(), new Stack(), new Stack(), new Stack(), new Stack(), new Stack(), new Stack()];
      this.foundation = [new Stack(), new Stack(), new Stack(), new Stack()];
      for (i = 0; i <= 6; i++) {
        for (t = i; i <= 6 ? t <= 6 : t >= 6; i <= 6 ? t++ : t--) {
          this.tableau[t].putOnTop(this.stock.takeFromTop());
        }
      }
      for (i = 0; i <= 6; i++) {
        this.tableau[i].topCard().setFaceUp();
      }
      return this;
    };

    Board.prototype.deal = function() {
      var c, _i, _len, _ref;
      if (this.stock.length()) {
        c = this.stock.takeFromTop();
        c.setFaceUp();
        this.waste.putOnTop(c);
        c = this.stock.takeFromTop();
        if (c) {
          c.setFaceUp();
          this.waste.putOnTop(c);
        }
        c = this.stock.takeFromTop();
        if (c) {
          c.setFaceUp();
          this.waste.putOnTop(c);
        }
      } else {
        _ref = this.waste.cards;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          c.setFaceUp(false);
          this.stock.putOnBottom(c);
        }
        this.waste.clear();
      }
      return this;
    };

    Board.prototype._stackToStack = function(stack1, stack2) {
      var c;
      if (stack1 && stack2 && stack1.length()) {
        c = stack1.takeFromTop();
        stack2.putOnTop(c);
        return c;
      } else {
        return false;
      }
    };

    Board.prototype.wasteToFoundation = function(fIndex) {
      if (fIndex == null) fIndex = 0;
      if (this._stackToStack(this.waste, this.foundation[fIndex])) {
        return true;
      } else {
        return false;
      }
    };

    Board.prototype.foundationToWaste = function(fIndex) {
      if (fIndex == null) fIndex = 0;
      if (this._stackToStack(this.foundation[fIndex], this.waste)) {
        return true;
      } else {
        return false;
      }
    };

    Board.prototype.wasteToTableau = function(tIndex) {
      if (tIndex == null) tIndex = 0;
      if (this._stackToStack(this.waste, this.tableau[tIndex])) {
        return true;
      } else {
        return false;
      }
    };

    Board.prototype.tableauToWaste = function(tIndex) {
      if (tIndex == null) tIndex = 0;
      if (this._stackToStack(this.tableau[tIndex], this.waste)) {
        return true;
      } else {
        return false;
      }
    };

    Board.prototype.tableauToFoundation = function(tIndex, fIndex) {
      if (tIndex == null) tIndex = 0;
      if (fIndex == null) fIndex = 0;
      if (this._stackToStack(this.tableau[tIndex], this.foundation[fIndex])) {
        return true;
      } else {
        return false;
      }
    };

    Board.prototype.tableauToTableau = function(tIndex1, count, tIndex2) {
      var i, s;
      if (tIndex1 == null) tIndex1 = 0;
      if (count == null) count = 1;
      if (tIndex2 == null) tIndex2 = 0;
      if (this.tableau[tIndex1].length() < count) return false;
      s = new Stack();
      for (i = 0; 0 <= count ? i < count : i > count; 0 <= count ? i++ : i--) {
        this._stackToStack(this.tableau[tIndex1], s);
      }
      for (i = 0; 0 <= count ? i < count : i > count; 0 <= count ? i++ : i--) {
        if (!this._stackToStack(s, this.tableau[tIndex2])) return false;
      }
      return true;
    };

    Board.prototype.foundationToTableau = function(fIndex, tIndex) {
      if (fIndex == null) fIndex = 0;
      if (tIndex == null) tIndex = 0;
      if (this._stackToStack(this.foundation[fIndex], this.tableau[tIndex])) {
        return true;
      } else {
        return false;
      }
    };

    return Board;

  })();

  window.Card = Card;

  window.Stack = Stack;

  window.Deck = Deck;

  window.Board = Board;

}).call(this);

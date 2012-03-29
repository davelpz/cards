(function() {
  var Board, Card, Deck, Stack, _ranks, _suites,
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
      if (this.suite === "Spades" || this.suite === "Clubs") {
        return arg.suite === "Spades" || arg.suite === "Clubs";
      } else if (this.suite === "Hearts" || this.suite === "Diamonds") {
        return arg.suite === "Hearts" || arg.suite === "Diamonds";
      }
    };

    Card.prototype.isLower = function(arg) {
      return _ranks.indexOf(arg.rank) < _ranks.indexOf(this.rank);
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

    Stack.prototype.dump = function() {
      var i, _ref, _results;
      _results = [];
      for (i = 0, _ref = this.cards.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        _results.push(console.log("" + this.cards[i]));
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

    Board.prototype.wasteToFoundation = function(index) {
      var c;
      if (index == null) index = 0;
      if (this.waste.length()) {
        c = this.waste.takeFromTop();
        c.setFaceUp();
        this.foundation[index].putOnTop(c);
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

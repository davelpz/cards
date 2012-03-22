(function() {
  var Card, Deck, Stack, _ranks, _suites,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  _suites = ["Spades", "Hearts", "Diamonds", "Clubs"];

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

    Card.prototype.isFaceUp = function() {
      return faceUp === true;
    };

    Card.prototype.faceUp = function(arg) {
      var faceUp;
      if (arg == null) arg = true;
      return faceUp = arg;
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

    Stack.prototype.takeFromTop = function() {
      var l, t;
      l = this.cards.length;
      if (l > 0) {
        t = this.cards[l - 1];
        this.cards.length -= 1;
      }
      return t;
    };

    Stack.prototype.putOnTop = function(card) {
      this.cards.push(card);
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

  window.Card = Card;

  window.Stack = Stack;

  window.Deck = Deck;

}).call(this);

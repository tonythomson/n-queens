(function () {

  var ChessboardModel = Backbone.Model.extend({
    initialize: function (params) {
      if(this.get('solveFor') === undefined) {
        this.set('solveFor', 'rooks');
      } else {
        this.set('solveFor', params.solveFor);
      }
      if (params.n) {
        this.clearPieces();
      } else if (params.sequence) {
        this.setBoardSequence(params.sequence);
      } else {
        this.setSimpleBoard(params.board);
      }
    },

    toggleSolveFor: function () {
      if (this.get('solveFor') === 'rooks') {
        this.set('solveFor', 'queens', {silent:true});
      } else {
        this.set('solveFor', 'rooks', {silent:true});
      }
    },

    clearPieces: function () {
      this.set('board', this.makeEmptyBoard(), {silent:true});
    },

    setSimpleBoard: function (simpleBoard) {
      this.set('board', this.makeBoardFromSimpleBoard(simpleBoard), {silent:true});
      this.set('n', this.get('board').length, {silent:true});
    },

    setBoardSequence: function (boardSequence) {
      this.set('sequence', this.makeBoardFromSequence(boardSequence), {silent:true});
      this.set('n', this.get('board').length, {silent:true});
    },

    makeBoardFromSimpleBoard: function (simpleBoard) {
      var that = this;
      return _.map(simpleBoard, function (cols, r) {
        return _.map(cols, function (hasPiece, c) {
          return {
            row: r,
            col: c,
            piece: hasPiece,
            sign: ((r + c) % 2),
            inConflict: function () {
              // todo: how expensive is this inConflict() to compute?
              if(that.get('solveFor') === 'rooks') {
                return (
                  that.hasRowConflictAt(r) ||
                  that.hasColConflictAt(c)
                  );
              } else {
                return (
                  that.hasRowConflictAt(r) ||
                  that.hasColConflictAt(c) ||
                  that.hasUpLeftConflictAt(that._getUpLeftIndex(r, c)) ||
                  that.hasUpRightConflictAt(that._getUpRightIndex(r, c))
                );
              }
            }
          };
        }, this);
      }, this);
    },

    // Converts a sequence representing a board to a 2D array
    makeBoardFromSequence: function (sequence) {
      chessboardView.model.clearPieces();
      for (var i = 0; i < sequence.length; i++) {
        chessboardView.model.get('board')[sequence[i]][i].piece = true;
      }
      chessboardView.model.trigger('change');
    },

    makeEmptyBoard: function () {
      var board = [];
      _.times(this.get('n'), function () {
        var row = [];
        _.times(this.get('n'), function () {
          row.push(false);
        }, this);
        board.push(row);
      }, this);
      return this.makeBoardFromSimpleBoard(board);
    },

    // we want to see the first row at the bottom, but html renders things from top down
    // So we provide a reversing function to visualize better
    reversedRows: function () {
      return _.extend([], this.get('board')).reverse();
    },

    togglePiece: function (r, c) {
      this.get('board')[r][c].piece = !this.get('board')[r][c].piece;
      this.trigger('change');
    },

    _getUpLeftIndex: function (r, c) {
      return r + c;
    },

    _getUpRightIndex: function (r, c) {
      return this.get('n') - c + r - 1;
    },

    hasConflict: function (sequence) {
      if (chessboardView.model.get('solveFor') === 'rooks') {
        return chessboardView.model.hasRooksConflict(sequence);
      } else {
        return chessboardView.model.hasQueensConflict(sequence);
      }
    },

    hasRooksConflict: function (sequence) {
      if(_.uniq(sequence).length === sequence.length) {
        return false;
      } else {
        return true;
      }
    },

    hasQueensConflict: function (sequence) {
      if (this.hasRooksConflict(sequence) || this.hasAnyUpLeftConflict(sequence, this.get('n')) || this.hasAnyUpRightConflict(sequence, this.get('n'))) {
        return true;
      } else {
        return false;
      }
    },

    _isInBounds: function (r, c) {
      return 0 <= r && r < this.get('n') && 0 <= c && c < this.get('n');
    },

    hasAnyRowConflict: function () {
      var result = false;
      for (var r = 0; r < this.get('n'); r++) {
        if (this.hasRowConflictAt(r)){
          result = true;
        }
      }
      return result;
    },

    hasRowConflictAt: function (r) {
      var pieceCount = 0;
      var result = false;
      for (var c = 0; c < this.get('n'); c++) {
        if(this.get('board')[r][c].piece){
          pieceCount++;
        }
      }
      if (pieceCount > 1) {
          result = true;
        }
      return result;
    },

    hasAnyColConflict: function () {
      var result = false;
      for (var c = 0; c < this.get('n'); c++) {
        if (this.hasColConflictAt(c)){
          result = true;
        }
      }
      return result;
    },

    hasColConflictAt: function (c) {
      var pieceCount = 0;
      var result = false;
      for (var r = 0; r < this.get('n'); r++) {
        if(this.get('board')[r][c].piece){
          pieceCount++;
        }
      }
      if (pieceCount > 1) {
          result = true;
        }
      return result;
    },

    hasUpLeftConflictAt: function (upLeftIndex) {
      var result = false;
      var pieceCount = 0;
      var n = this.get('n');
      for (var r = 0; r < this.get('n'); r++) {
        for (var c = 0; c < this.get('n'); c++) {
          if((this._getUpLeftIndex(r,c)===upLeftIndex)&&(this.get('board')[r][c].piece)){
            pieceCount++;
          }
        }
      }
      if(pieceCount > 1) {
        result = true;
      }
      return result;
    },

    hasUpRightConflictAt: function (upRightIndex) {
      var pieceCount = 0;
      var result = false;
      for (var r = 0; r < this.get('n'); r++) {
        for (var c = 0; c < this.get('n'); c++) {
          if((this._getUpRightIndex(r,c)===upRightIndex)&&(this.get('board')[r][c].piece)){
            pieceCount++;
          }
        }
      }
      if (pieceCount > 1) {
          result = true;
      }
      return result;
    },

    hasAnyUpLeftConflict: function (sequence, n) {
      var hash = [];
      for (var i = 0; i < ((2*(n))-1); i++) {
        hash[i] = 0;
      }
      for (var j = 0; j < sequence.length; j++) {
        if (hash[this._getUpLeftIndex(j, sequence[j])] !== 0) {
          return true;
        } else {
          hash[this._getUpLeftIndex(j, sequence[j])]++;
        }
      }
      return false;
    },

    hasAnyUpRightConflict: function (sequence, n) {
      var hash = [];
      for (var i = 0; i < ((2*(n))-1); i++) {
        hash[i] = 0;
      }
      for (var j = 0; j < sequence.length; j++) {
        if (hash[this._getUpRightIndex(j, sequence[j])] !== 0) {
          return true;
        } else {
          hash[this._getUpRightIndex(j, sequence[j])]++;
        }
      }
      return false;
    }
  });

  this.ChessboardModel = ChessboardModel;

}());

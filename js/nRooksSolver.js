var solveNRooks = function (n) {
  var solutionsArray = [];

  // Create a sequence to represent a board
  // with one piece in each row, all in different columns
  var createBagOColumns = function () {
    var bag = [];
    for (var i = 0; i < n; i++) {
      bag.push(i);
    }
    return bag;
  };

  var branchHasConflict = function (sequence) {
    if (chessboardView.model.get('solveFor')==='queens') {
      if (chessboardView.model.hasAnyUpLeftConflict(sequence, n)) {
        return true;
      } else if (chessboardView.model.hasAnyUpRightConflict(sequence, n)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  var getUpLeftIndex = function (r, c) {
    return r + c;
  };

  var getUpRightIndex = function (r, c) {
    return n - c + r - 1;
  };

  // Permutation function
  var findPermutations = function (prefix, bag, dHash) {
    // var dLeft = diagsLeft.slice(0);
    if (prefix.length === n) {
      // Found a complete permutation; check if it's valid
      if(!chessboardView.model.hasConflict(prefix)) {
        solutionsArray.push(prefix);
      }
      return;
    } else {
      for(var i = 0; i < bag.length; i++) {
        var nextElement = Number(bag.slice(i,i+1));
        var newPrefix = prefix.concat(nextElement);
        var len = newPrefix.length-1;
        var newBag = bag.slice(0);
        newBag.splice(i,1);
        // If this new number has a diagonal we already have in the hash, disregard
        // Prune this branch if it has a diagonal conflict
        // if (!branchHasConflict(newPrefix)) {
        if (chessboardView.model.get('solveFor')==='queens') {
          if(dHash.left[getUpLeftIndex(len, nextElement)] === 0) {
            if(dHash.right[getUpRightIndex(len, nextElement)] === 0) {
              dHash.right[getUpRightIndex(len, nextElement)]++;
              dHash.left[getUpLeftIndex(len, nextElement)]++;
              findPermutations(newPrefix, newBag, dHash);
              dHash.left[getUpLeftIndex(len, nextElement)]--;
              dHash.right[getUpRightIndex(len, nextElement)]--;
            }
          }
        } else {
          findPermutations(newPrefix, newBag, dHash);
        }
      }
    }
  };

  var diagsHash = {
    left: [],
    right: []
  };
  for (var i = 0; i < ((2*n)-1); i++) {
    diagsHash.left[i] = 0;
    diagsHash.right[i] = 0;
  };
  var solutionFound = false;
  console.log("Timer starting...");
  var startTime = new Date();
  var bagOColumns = createBagOColumns();
  findPermutations([],bagOColumns, diagsHash);
  console.log("first solution: "+solutionsArray[0]);
  chessboardView.model.setBoardSequence(solutionsArray[0]);
  var endTime = new Date();
  var elapsedTime = endTime - startTime;
  console.log("Found "+ solutionsArray.length + " solutions for " + n + " " + chessboardView.model.get('solveFor') + " in " + + elapsedTime/1000 + " seconds");
}
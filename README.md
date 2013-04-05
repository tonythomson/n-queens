# N Queens

This repo contains a simple Backbone app that provides solutions to the N Queens problem (and N Rooks, too, since it was easier to start there); it's basically a place for me to try out optimization strategies.

Upon first tackling the problem, I realized I could represent the board as an array of n elements (in which positions on the board were represented by using the index of each element to represent a piece’s column, and the value of the element to represent the row), rather than a matrix:

  var sampleSolution = [1,3,5,0,2,4];

Therefore, a brute-force approach to generating solutions simply required all permutations of the sequence 1 to ‘n’. However, my approach was to generate all possible board permutations in which each column held one queen, and to then iterate over each permutation in the array, convert it to a two-dimensional array that represented the board, and then test that for queens conflicts. So, yeah. Slow.

My first rewrite was almost top-to-bottom. I started by rewriting my validity checking functions to run on the one-dimensional representation of the board, removing the step of converting each permutation to a matrix board when I checked it. This way, I could check boards as they were generated, and only push valid boards into the solutions array. That made a huge difference.

Next, I started looking at ways that I could prune possible board spaces. Since a board permutation is generated column by column, I could run a validity check on the board every time a new element was added to the sequence. If a partial sequence had queens conflicts, then it was safe to ignore any permutations that began with this partial sequence. This change dramatically increased the performance for large boards.

The immediately obvious improvement lay in the way I was testing partial sequences. For each board fragment (e.g. `[1]`, `[1,3]`, `[1,3,5]`, etc.), I would test each element (column) for queens conflicts. In order to reduce the number of checks, I implemented a breadcrumb hash to to track conflicts. I gave each diagonal on the board a number, and hashed a to a simple array for every diagonal on the board that was occupied. This way, every new element added to the candidate board could be checked against the hash, rather than re-checking conflicts for every element in the array so far.

## To Do
Oddly, the above optimization didn’t give me the speed improvement I was expecting. I suspect that’s a factor of my implementation, which is what I’m analyzing right now.

If I can nail that down, I’m going to investigate two more possible optimizations:

* I think I can check for diagonal conflicts using bitwise operations, which should be faster than my current checking method. I know that using buffers in Node.js might provide even faster bitwise operations, but I’m trying to keep things in the browser for now, so we’ll see how that goes…
* Concurrency: I’m also wondering if I can divide the space of potential boards to be generated so that they can be worked on by separate workers. Not too sure about that yet…

## Technologies
This is a pretty simple [Backbone.js](http://backbonejs.org/) app.
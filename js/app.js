$(function () {
	var n = 6;
  window.chessboardView = new ChessboardView({n:n});
  window.controlView = new ControlView();
  $("body").append(controlView.render());
  $("body").append(chessboardView.render());

  solveNRooks(window.chessboardView.model.get('n'));
});

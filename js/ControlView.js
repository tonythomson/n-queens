(function () {

  var ControlView = Backbone.View.extend({
    model: ChessboardModel,
    tagName: "form",
    template: Mustache.compile(
        '<label for = "solveFor">Solve for: </label>'
      + '<select name = "solveFor">'
        + '<option value = "rooks" {{#rooks}} selected {{/rooks}}>Rooks</option>'
        + '<option value = "queens" {{#queens}} selected {{/queens}}>Queens</option>'
        + '</select>'
      + '<label for = "n">Size:</label>'
      // + '<input type = "text" name="nInput" value={{n}}>'
      + '<input type="number" name="nInput" min="1" max="50" value={{n}}>'
    ),
    n: function () {
      return window.chessboardView.model.get('n');
    },
    initialize: function () {
      this.model = window.chessboardView.model;
      var that = this;
      // When the drop-down changes
      this.$el.on('change', 'select', function (e) {
        that.model.toggleSolveFor();
        solveNRooks(that.n());
      });
      // When the text field value changes
      this.$el.on('change', 'input', function (e) {
        that.model.set('n', parseInt($('input').val()), {silent: true});
        solveNRooks(that.n());
      });
      this.model.on('change', this.render.bind(this));
    },

    render: function () {
      this.rooks = (window.chessboardView.model.get('solveFor') === 'rooks');
      this.queens = (window.chessboardView.model.get('solveFor') === 'queens');
      return this.$el.html(this.template(this));
    }

  });

  this.ControlView = ControlView;
}());
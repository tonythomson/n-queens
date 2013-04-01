(function(){

  var ChessboardView = Backbone.View.extend({

    tagName: "table",
    rookTemplate: Mustache.compile(
      "{{#reversedRows}}"
        + "<tr class='row'>"
          + "{{#.}}"
            + "<td class='square {{#inConflict}}inConflict{{/inConflict}} {{#sign}}positive{{/sign}}{{^sign}}negative{{/sign}}' data-row='{{row}}' data-col='{{col}}'>"
              + "{{#piece}}&#9814;{{/piece}}"
            + "</td>"
          + "{{/.}}"
        + "</tr>"
      + "{{/reversedRows}}"
    ),
    queenTemplate: Mustache.compile(
      "{{#reversedRows}}"
        + "<tr class='row'>"
          + "{{#.}}"
            + "<td class='square {{#inConflict}}inConflict{{/inConflict}} {{#sign}}positive{{/sign}}{{^sign}}negative{{/sign}}' data-row='{{row}}' data-col='{{col}}'>"
              + "{{#piece}}&#9813;{{/piece}}"
            + "</td>"
          + "{{/.}}"
        + "</tr>"
      + "{{/reversedRows}}"
    ),

    initialize: function(params) {
      this.model = new ChessboardModel({n: params.n, solveFor: params.solveFor});
      var that = this;
      this.$el.on('click', '.square', function(e){
        that.model.togglePiece($(this).data('row'), $(this).data('col'));
      });
      this.model.on('change', this.render.bind(this));
    },

    render: function() {
      if(this.model.get("solveFor")=== "rooks"){
        return this.$el.html(this.rookTemplate(this.model));
      } else {
        return this.$el.html(this.queenTemplate(this.model));
      }
    }

  });

  this.ChessboardView = ChessboardView;
}());
var React = require('react');
var ScrollbarMixin = require('react-scrollbar').Mixin;
var Scrollbar = require('react-scrollbar').Scrollbar;

require('./vertical-scrollbar.scss');

var VerticalScrollbar = React.createClass({
  mixins: [ScrollbarMixin],

  getInitialState: function() {
    return {
      scrollbarOffset: 2
    };
  },


  render: function() {
    return (
      <div style={this.scrollbarContainerStyle()} className={this.containerClass()}>
        <div style={this.scrollbarContentStyle()} ref="scrollableContent" onScroll={this.handleScroll} className="ScrollbarContent--vertical">
          <img src="http://i.ytimg.com/vi/7RtDlXRkPuE/maxresdefault.jpg" />

          <Scrollbar
            {... this.getScrollbarProps()}
            vertical={true}
            horizontal={true}
          />
          />
        </div>
      </div>
    );
  }
});

module.exports = VerticalScrollbar;

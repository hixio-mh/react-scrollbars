'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react/addons');

var ScrollbarMixin = require('../mixins/scrollbar');
var Scrollbar = require('./scrollbar');

var ScrollbarWrapper = React.createClass({
  displayName: 'ScrollbarWrapper',

  mixins: [ScrollbarMixin],

  componentDidMount: function componentDidMount() {
    window.addEventListener('message', this.handleReceive, false);
  },

  handleReceive: function handleReceive(event) {
    var data = event.data;

    if (typeof this[data.func] === 'function') {
      this[data.func]();
    }
  },

  onResize: function onResize() {
    this.handleContentResize();
  },

  render: function render() {
    return React.createElement(
      'div',
      { style: this.scrollbarContainerStyle(), className: this.containerClass() },
      React.createElement(
        'div',
        { ref: 'scrollableContent', style: this.scrollbarContentStyle(), onScroll: this.handleScroll, className: this.props.className + ' ScrollbarContent' },
        React.createElement(
          'div',
          { className: 'ScrollbarChildren', style: { position: 'relative' } },
          this.props.children,
          React.createElement('iframe', { style: { width: '100%', height: '100%', position: 'absolute', top: '-100%', left: '-100%' }, frameBorder: '0', src: 'javascript:window.onresize=function(){parent.postMessage({\'func\': \'onResize\'}, \'*\')}' })
        ),
        React.createElement(Scrollbar, _extends({}, this.props, this.getScrollbarProps()))
      )
    );
  }
});

module.exports = ScrollbarWrapper;
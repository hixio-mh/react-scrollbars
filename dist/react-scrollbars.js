(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ReactScrollbars = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

var ScrollbarMixin = require('../mixins/scrollbar');
var Scrollbar = require('./scrollbar');



function offsetTop(elm) {
  var test = elm, top = 0;
  while(!!test && test.tagName.toLowerCase() !== "body") {
    top += test.offsetTop;
    test = test.offsetParent;
  }
  return top;
}

function viewportHeight() {
  var de = document.documentElement;
  if(!!window.innerWidth) { 
    return window.innerHeight; 
  } else if( de && !isNaN(de.clientHeight) ) { 
    return de.clientHeight; 
  }
  return 0;
}

function scrollTop() {
  if( window.pageYOffset ) { 
    return window.pageYOffset; 
  }
  return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
}


var ScrollbarWrapper = React.createClass({displayName: "ScrollbarWrapper",
  mixins: [ScrollbarMixin],

  componentDidMount: function() {
    window.addEventListener('message', this.handleReceive, false);
    window.addEventListener('scroll', this.handleWindowScroll, false);
    window.addEventListener('resize', this.handleWindowScroll, false);
    this.handleWindowScroll();
  },

  componentWillUnmount: function() {
    window.removeEventListener('message', this.handleReceive, false);
    window.removeEventListener('scroll', this.handleWindowScroll, false);
    window.removeEventListener('resize', this.handleWindowScroll, false);
  },

  handleReceive: function(event) {
    var data = event.data;

    if (typeof(this[data.func]) === 'function') {
      this[data.func]();
    }
  },

  handleWindowScroll: function (event) {
    if(this.props.scrollbarAffix) {
      this.setState({
        fixedScrollbar: this.isPartiallyVisible()
      });
    }
  },

  onResize: function() {
    this.handleContentResize();
  },

  render: function() {
    return (
      React.createElement("div", {style: this.scrollbarContainerStyle(), className: this.containerClass()}, 
        React.createElement("div", {ref: "scrollableContent", style: this.scrollbarContentStyle(), onScroll: this.handleScroll, className: this.props.className + ' ScrollbarContent'}, 
          React.createElement("div", {className: "ScrollbarChildren", style: {position: 'relative', paddingBottom: this.state.nativeScrollbarWidth}}, 
            this.props.children, 

            React.createElement("iframe", {style: {width: '100%', height: '100%', position: 'absolute', top: '-100%', left: '-100%'}, frameBorder: "0", src: "javascript:window.onresize=function(){parent.postMessage({'func': 'onResize'}, '*')}"})
          ), 

          React.createElement(Scrollbar, React.__spread({}, 
             this.props, 
             this.getScrollbarProps()))
        )
      )
    );
  },

    // returns true if parts, but not the bottom border, of the scroll container are visible in the current viewport
  isPartiallyVisible: function() {
    var containerEl = this.getDOMNode();
    var elTop = offsetTop(containerEl);
    var elBottom = elTop + containerEl.clientHeight;

    var vpTop = scrollTop(); 
    var vpBottom = vpTop + viewportHeight();

    return ((elTop <= vpBottom) && (elBottom >= vpBottom));
  }

});

module.exports = ScrollbarWrapper;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../mixins/scrollbar":4,"./scrollbar":2}],2:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var Scrollbar = React.createClass({displayName: "Scrollbar",
  getDefaultProps: function() {
    return {
      offset: 2,
      fixedScrollbar: false,
      scrollbarThickness: 10,
      stickLength: {
        horizontal: 100,
        vertical: 100
      },
      stickPosition: {
        horizontal: 0,
        vertical: 0
      },
      scrollbarLength: {
        horizontal: 100,
        vertical: 100
      },
      showScrollbar: {
        horizontal: true,
        vertical: false
      },
      vertical: true,
      horizontal: true
    };
  },

  verticalScrollbar: function(style, stickStyle) {
    if (this.props.vertical && this.props.showScrollbar.vertical) {
      return (
        React.createElement("div", {className: "Scrollbar Scrollbar-vertical", style: style}, 
          React.createElement("div", {className: "Scrollbar-stick", style: stickStyle, onMouseDown: this.props.onMouseDown.bind(null, 'y')})
        )
      );
    } else {
      return null;
    }
  },

  horizontalScrollbar: function(style, stickStyle) {
    if (this.props.horizontal && this.props.showScrollbar.horizontal) {
      return (
        React.createElement("div", {className: "Scrollbar Scrollbar-horizontal", style: style}, 
          React.createElement("div", {className: "Scrollbar-stick", style: stickStyle, onMouseDown: this.props.onMouseDown.bind(null, 'x')})
        )
      );
    } else {
      return null;
    }
  },

  render: function() {
    if (!this.props.render) {
      return React.createElement("div", null);
    }

    var verticalScrollbarHeight;
    var horizontalScrollbarWidth;

    if (this.props.scrollbarLength.vertical) {
      verticalScrollbarHeight = this.props.scrollbarLength.vertical;
    }

    if (this.props.scrollbarLength.horizontal) {
      horizontalScrollbarWidth = this.props.scrollbarLength.horizontal;
    }

    var scrollbarStyle = {
      borderRadius: 4,
      background: 'rgba(0, 0, 0, 0.5)',
      position: 'absolute',
      opacity: 1
    };

    var stickStyle = {
      background: 'rgba(255, 255, 255, 0.7)',
      position: 'absolute',
      borderRadius: 4
    };

    // TODO: clean this junk UP

    var scrollbarStyleVertical = _.extend({
      width: this.props.scrollbarThickness,
      top: this.props.offset,
      height: verticalScrollbarHeight || 'auto',
      bottom: verticalScrollbarHeight ? 'auto' : this.props.offset,
      right: this.props.offset,
    }, scrollbarStyle);

    var scrollbarStyleHorizontal = _.extend({
      marginLeft: this.props.offset,
      bottom: this.props.offset,
      width: horizontalScrollbarWidth || 'auto',
      marginRight: horizontalScrollbarWidth ? 'auto' : this.props.offset,
      height: this.props.scrollbarThickness
    }, scrollbarStyle, this.props.fixedScrollbar && {
      position: 'fixed'
    });

    var scrollbarStickStyleVertical = _.extend({
      width: this.props.scrollbarThickness,
      height: this.props.stickLength.vertical,
      right: 0,
      top: this.props.stickPosition.vertical
    }, stickStyle);

    var scrollbarStickStyleHorizontal = _.extend({
      height: this.props.scrollbarThickness,
      width: this.props.stickLength.horizontal,
      left: this.props.stickPosition.horizontal
    }, stickStyle);

    return (
      React.createElement("div", {className: "Scrollbar-wrapper"}, 
        this.verticalScrollbar(scrollbarStyleVertical, scrollbarStickStyleVertical), 
        this.horizontalScrollbar(scrollbarStyleHorizontal, scrollbarStickStyleHorizontal)
      )
    );
  }
});

module.exports = Scrollbar;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
module.exports = {
  Scrollbar: require('./components/scrollbar'),
  ScrollbarWrapper: require('./components/scrollbar-wrapper'),
  Mixin: require('./mixins/scrollbar')
};


},{"./components/scrollbar":2,"./components/scrollbar-wrapper":1,"./mixins/scrollbar":4}],4:[function(require,module,exports){
(function (global){
'use strict';
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

var ScrollbarMixin = {
  getInitialState: function() {
    return {
      fixedScrollbar: false,
      stickPosition: {
        horizontal: 0,
        vertical: 0
      },
      initialScroll: {
        left: 0,
        top: 0
      },
      initialPosition: {
        x: 0,
        y: 0
      },
      axis: null,
      initialMovement: false,
      scrolling: false,
      nativeScrollbarWidth: 0,
      firstRender: null
    };
  },

  getDefaultProps: function() {
    return {
      scrollbarOffset: 2,
      scrollbarAffix: false
    };
  },

  componentDidMount: function() {
    var scrollbarElement = document.createElement('div');
    scrollbarElement.style.width = '100px';
    scrollbarElement.style.height = '100px';
    scrollbarElement.style.overflow = 'scroll';
    scrollbarElement.style.position = 'absolute';
    scrollbarElement.style.top = '-100%';
    scrollbarElement.style.left = '-100%';
    document.body.appendChild(scrollbarElement);

    this.setState({
      nativeScrollbarWidth: scrollbarElement.offsetWidth - scrollbarElement.clientWidth,
      firstRender: true
    }, function() {
      document.body.removeChild(scrollbarElement);
    });
  },

  componentDidUpdate: function() {
    if (this.state.firstRender) {
      this.setState({
        firstRender: false
      });
    }
  },

  getRatio: function() {
    if (!this.refs.scrollableContent) {
      return {};
    }

    var element = this.refs.scrollableContent.getDOMNode();

    return {
      horizontal: this.getContentDimensions().width / element.scrollWidth,
      vertical: this.getContentDimensions().height / element.scrollHeight
    };
  },

  getStickLength: function() {
    if (!this.refs.scrollableContent) {
      return {};
    }

    var scrollbarLength = this.getScrollbarLength();
    var horizontal = scrollbarLength.horizontal * this.getRatio().horizontal;
    var vertical = scrollbarLength.vertical * this.getRatio().vertical;

    return {
      horizontal: horizontal,
      vertical: vertical
    };
  },

  getContentDimensions: function() {
    if (!this.refs.scrollableContent) {
      return {};
    }

    var element = this.refs.scrollableContent.getDOMNode();

    return {
      height: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollWidth: element.scrollWidth,
      width: element.clientWidth,
    };
  },

  getScrollbarLength: function() {
    var horizontal = this.getContentDimensions().width - (this.props.scrollbarOffset * 2);
    var vertical = this.getContentDimensions().height - (this.props.scrollbarOffset * 2);


    if (this.scrollbarRequired().both) {
      horizontal = horizontal - this.state.nativeScrollbarWidth;
      vertical = vertical - this.state.nativeScrollbarWidth;
    }

    return {
      horizontal: horizontal,
      vertical: vertical
    };
  },

  calculateStickPosition: function(left, top) {
    var scrollbarRatioWidth = this.getScrollbarLength().horizontal / this.getContentDimensions().scrollWidth;
    var scrollbarRatioHeight = this.getScrollbarLength().vertical / this.getContentDimensions().scrollHeight;

    return {
      horizontal: left * scrollbarRatioWidth,
      vertical: top * scrollbarRatioHeight
    };
  },

  scrollbarRequired: function() {
    if (!this.refs.scrollableContent) {
      return {};
    }

    return {
      horizontal: this.getRatio().horizontal < 1,
      vertical: this.getRatio().vertical < 1,
      both: this.getRatio().horizontal < 1 && this.getRatio().vertical < 1
    };
  },

  handleScroll: function(event) {
    this.setState({
      stickPosition: this.calculateStickPosition(event.target.scrollLeft, event.target.scrollTop)
    });
  },

  handleMouseDown: function(axis, event) {
    event.preventDefault();

    this.setState({
      axis: axis,
      initialPosition: {
        x: event.pageX,
        y: event.pageY
      },
      initialMovement: true,
      scrolling: true
    });

    document.addEventListener('mousemove', this.handleStickDrag);
    document.addEventListener('mouseup', this.handleMouseUp);
  },

  handleMouseUp: function() {
    this.setState({
      scrolling: false
    });

    document.removeEventListener('mousemove', this.handleStickDrag);
    document.removeEventListener('mouseup', this.handleMouseUp);
  },

  handleStickDrag: function(event) {
    // TODO: this needs refactoring
    var origin = this.state.axis === 'x' ? 'left' : 'top';

    var initialScrollPosition = this.state.initialScroll[origin];

    if (this.state.initialMovement) {
      initialScrollPosition = origin === 'left' ? this.refs.scrollableContent.getDOMNode().scrollLeft : this.refs.scrollableContent.getDOMNode().scrollTop;
      var initialScroll = _.extend({}, this.state.initialScroll);
      initialScroll[origin] = initialScrollPosition;

      this.setState({
        initialScroll: initialScroll,
        initialMovement: false
      });
    }

    var movement = {
      x: (this.state.initialPosition.x - event.pageX) * -1,
      y: (this.state.initialPosition.y - event.pageY) * -1
    };

    var scaledMovement = {
      x: movement.x / this.getRatio().horizontal,
      y: movement.y / this.getRatio().vertical
    };

    if (this.state.axis === 'x') {
      this.refs.scrollableContent.getDOMNode().scrollLeft = initialScrollPosition + scaledMovement.x;
    } else {
      this.refs.scrollableContent.getDOMNode().scrollTop = initialScrollPosition + scaledMovement.y;
    }
  },

  handleContentResize: function() {
    this.forceUpdate();
  },

  getScrollbarProps: function() {
    if (this.state.firstRender !== false) {
      return {
        render: false
      };
    }

    return {
      render: true,
      stickLength: this.getStickLength(),
      scrollbarLength: this.getScrollbarLength(),
      stickPosition: this.state.stickPosition,
      fixedScrollbar: this.state.fixedScrollbar,
      onMouseDown: this.handleMouseDown,
      showScrollbar: this.scrollbarRequired(),
      offset: this.props.scrollbarOffset
    };
  },

  containerClass: function() { // TODO: rename getStyle or something
    var cx = React.addons.classSet;

    return cx({
      'ScrollbarContainer': true,
      'ScrollbarContainer--scrolling': this.state.scrolling
    });
  },

  scrollbarContainerStyle: function() {
    return {
      position: 'relative',
      overflow: 'hidden'
    };
  },

  scrollbarContentStyle: function() {
    var style = {};

    if (this.scrollbarRequired().vertical) {
      style['paddingRight'] = this.state.nativeScrollbarWidth;
    }

    if (this.scrollbarRequired().horizontal) {
      style['marginBottom'] = this.state.nativeScrollbarWidth * -1;
    }

    return style;
  }
};

module.exports = ScrollbarMixin;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[3])(3)
});
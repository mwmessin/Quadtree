(function() {
  var Dot, Node, Quadtree, ctx,
    __slice = Array.prototype.slice;

  ctx = null;

  Dot = (function() {

    function Dot(x, y) {
      this.x = x;
      this.y = y;
    }

    Dot.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, true);
      ctx.closePath();
      return ctx.fill();
    };

    return Dot;

  })();

  Quadtree = (function() {

    function Quadtree() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.node = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Node, args, function() {});
    }

    Quadtree.prototype.add = function(shape) {
      return this.node.add(shape);
    };

    Quadtree.prototype.getShapes = function() {
      var args, node, nodes, shape, shapes, _i, _j, _k, _len, _len2, _len3;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      nodes = [];
      this.node.getNodes(args, nodes);
      ctx.strokeStyle = "red";
      ctx.strokeRect.apply(ctx, args);
      console.log(nodes);
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        ctx.fillStyle = "green";
        ctx.fillRect(node.x, node.y, node.w, node.h);
      }
      shapes = [];
      for (_j = 0, _len2 = nodes.length; _j < _len2; _j++) {
        node = nodes[_j];
        shapes = shapes.concat(node.shapes);
      }
      ctx.fillStyle = "blue";
      for (_k = 0, _len3 = shapes.length; _k < _len3; _k++) {
        shape = shapes[_k];
        shape.draw();
      }
      return shapes;
    };

    return Quadtree;

  })();

  Node = (function() {

    function Node(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      ctx.strokeRect.apply(ctx, arguments);
      this.shapes = [];
      this.children = null;
    }

    Node.prototype.add = function(shape) {
      var node, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
      if (this.shapes) {
        this.shapes.push(shape);
        if (this.shapes.length > 2) {
          this.children = [new Node(this.x, this.y, this.w / 2, this.h / 2), new Node(this.x + this.w / 2, this.y, this.w / 2, this.h / 2), new Node(this.x, this.y + this.h / 2, this.w / 2, this.h / 2), new Node(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2)];
          _ref = this.shapes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            shape = _ref[_i];
            _ref2 = this.children;
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              node = _ref2[_j];
              if (node.contains(shape)) node.add(shape);
            }
          }
          return this.shapes = null;
        }
      } else {
        _ref3 = this.children;
        _results = [];
        for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
          node = _ref3[_k];
          if (node.contains(shape)) {
            _results.push(node.add(shape));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Node.prototype.contains = function(shape) {
      var _ref, _ref2;
      return (this.x < (_ref = shape.x) && _ref < this.x + this.w) && (this.y < (_ref2 = shape.y) && _ref2 < this.y + this.h);
    };

    Node.prototype.overlaps = function(region) {
      return this.x < region[0] + region[2] && this.x + this.w > region[0] && this.y < region[1] + region[3] && this.y + this.h > region[1];
    };

    Node.prototype.getNodes = function(region, nodes) {
      var child, _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.overlaps(region)) {
          console.log("ye", child);
          if (child.shapes) {
            _results.push(nodes.push(child));
          } else {
            _results.push(child.getNodes(region, nodes));
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Node;

  })();

  $(function() {
    var canvas, circle, circles, i, quad, x, y, _i, _len;
    canvas = $("canvas");
    ctx = canvas[0].getContext('2d');
    canvas.attr("width", $(window).width()).attr("height", $(window).height());
    circles = (function() {
      var _results;
      _results = [];
      for (i = 0; i <= 1000; i++) {
        x = Math.random() * 512;
        y = Math.random() * 512;
        _results.push(new Dot(x, y));
      }
      return _results;
    })();
    quad = new Quadtree(0, 0, 512, 512);
    for (_i = 0, _len = circles.length; _i < _len; _i++) {
      circle = circles[_i];
      circle.draw();
      quad.add(circle);
    }
    quad.getShapes(150, 150, 50, 50);
    return console.log(quad);
  });

}).call(this);

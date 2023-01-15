AVLTree = (function () {
  function Pointer(setter, getter) {
    this.Set = setter;
    this.Get = getter;
  }

  function Node() {
    this.Value = null;
    this.Left = null;
    this.Right = null;
    this.Height = 0;
  }

  function AVLTree() {
    this.Root = null;
  }

  Node.prototype.GetBalanceFactor = function () {
    return (
      (this.Left == null ? -1 : this.Left.Height) -
      (this.Right == null ? -1 : this.Right.Height)
    );
  };

  AVLTree.prototype.Balance = function (node) {
    var factor = node.GetBalanceFactor();
    if (factor == 2) {
      if (node.Left.GetBalanceFactor() == -1) this.RotateLeft(node.Left);

      this.RotateRight(node);
    } else if (factor == -2) {
      if (node.Right.GetBalanceFactor() == 1) this.RotateRight(node.Right);

      this.RotateLeft(node);
    }
  };

  AVLTree.prototype.UpdateHeight = function () {
    for (var i = 0; i < arguments.length; i++) {
      var node = arguments[i];

      node.Height =
        Math.max(
          node.Left == null ? -1 : node.Left.Height,
          node.Right == null ? -1 : node.Right.Height
        ) + 1;
    }
  };

  AVLTree.prototype.RotateRight = function (root) {
    var pivot = root.Left;

    var oldRootValue = root.Value;
    var oldRootRight = root.Right;

    root.Value = pivot.Value;
    root.Left = pivot.Left;
    root.Right = pivot;

    pivot.Value = oldRootValue;
    pivot.Left = pivot.Right;
    pivot.Right = oldRootRight;

    this.UpdateHeight(pivot, root);
  };

  AVLTree.prototype.RotateLeft = function (root) {
    var pivot = root.Right;

    var oldRootValue = root.Value;
    var oldRootLeft = root.Left;

    root.Value = pivot.Value;
    root.Right = pivot.Right;
    root.Left = pivot;

    pivot.Value = oldRootValue;
    pivot.Right = pivot.Left;
    pivot.Left = oldRootLeft;

    this.UpdateHeight(pivot, root);
  };

  AVLTree.prototype.Draw = function (canvasId) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext("2d");
    ctx.textAlign = "center";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.Root == null) return;

    var maxNodes = this.Root.Height == 0 ? 1 : Math.pow(2, this.Root.Height);

    var baseWidth = maxNodes * (this.Root.Height <= 3 ? 60 : 35);

    var counter = 0;
    var currentDepth = 0;
    var baseNodeWidth = baseWidth;
    var y = 55;
    var x = (canvas.width - baseWidth) / 2 + baseNodeWidth / 2;

    var queue = [this.Root];

    while (queue.length > 0) {
      var currentNode = queue.shift();
      counter++;

      if (currentDepth + 1 <= this.Root.Height) {
        queue.push(currentNode == null ? null : currentNode.Left);
        queue.push(currentNode == null ? null : currentNode.Right);
      }

      if (currentNode != null) {
        ctx.beginPath();
        ctx.arc(x, y - 5, 15, 0, 2 * Math.PI, false);
        ctx.fillStyle = "transparent";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();

        if (currentDepth > 0) {
          ctx.beginPath();
          ctx.moveTo(x, y - 20);

          if (counter % 2 == 0) ctx.lineTo(x - baseNodeWidth / 2, y - 45);
          else ctx.lineTo(x + baseNodeWidth / 2, y - 45);

          ctx.stroke();
        }

        ctx.fillStyle = "white";
        ctx.font = "14px Varela Round";
        ctx.fillText(currentNode.Value, x, y);

        ctx.font = "12px Varela Round";
        ctx.fillStyle = "black";
        ctx.fillText(currentNode.Height, x + 25, y - 11);
        ctx.fillStyle = "white";
        ctx.fillText(currentNode.GetBalanceFactor(), x + 25, y + 2);
      }

      x += baseNodeWidth;

      var levelNodes = currentDepth == 0 ? 1 : Math.pow(2, currentDepth);

      if (counter >= levelNodes) {
        counter = 0;
        currentDepth++;
        baseNodeWidth = baseWidth / Math.pow(2, currentDepth);
        y += 55;
        x = (canvas.width - baseWidth) / 2 + baseNodeWidth / 2;
      }
    }
  };

  AVLTree.prototype.FindValue = function (value) {
    var node = this.Root;
    while (node != null) {
      if (node.Value == value) return true;
      else if (node.Value > value) node = node.Left;
      else node = node.Right;
    }
    return false;
  };

  AVLTree.prototype.AddValue = function (value) {
    if (this.Root == null) this.Root = new Node();

    this.Add(this.Root, value);
  };

  AVLTree.prototype.Add = function (node, value) {
    if (node.Value == null) {
      node.Value = value;
      return 0;
    }

    if (node.Value > value) {
      if (node.Left == null) node.Left = new Node();
      node.Height = Math.max(this.Add(node.Left, value) + 1, node.Height);
    } else if (node.Value < value) {
      if (node.Right == null) node.Right = new Node();
      node.Height = Math.max(this.Add(node.Right, value) + 1, node.Height);
    }

    this.Balance(node);

    return node.Height;
  };

  AVLTree.prototype.RemoveValue = function (value) {
    var $this = this;
    var ptr = new Pointer(
      function (v) {
        $this.Root = v;
      },
      function () {
        return $this.Root;
      }
    );

    return this.Remove(ptr, value);
  };

  AVLTree.prototype.Remove = function (ptr, value) {
    var node = ptr.Get();

    if (node == null) return -1;

    if (node.Value == value) {
      if (node.Left == null && node.Right == null) {
        ptr.Set(null);
        return -1;
      } else if (node.Left != null && node.Right != null) {
        var dirNode = node.Left;
        while (dirNode.Right != null) {
          dirNode = dirNode.Right;
        }

        this.RemoveValue(dirNode.Value);

        node.Value = dirNode.Value;

        return node.Height;
      } else if (node.Left != null) {
        ptr.Set(node.Left);
        return node.Left.Height;
      } else {
        ptr.Set(node.Right);
        return node.Right.Height;
      }
    } else if (node.Value > value) {
      var lPtr = new Pointer(
        function (v) {
          node.Left = v;
        },
        function () {
          return node.Left;
        }
      );

      var newHeight = this.Remove(lPtr, value);
      node.Height =
        Math.max(newHeight, node.Right == null ? -1 : node.Right.Height) + 1;
    } else {
      var rPtr = new Pointer(
        function (v) {
          node.Right = v;
        },
        function () {
          return node.Right;
        }
      );

      var newHeight = this.Remove(rPtr, value);
      node.Height =
        Math.max(newHeight, node.Left == null ? -1 : node.Left.Height) + 1;
    }

    this.Balance(node);

    return node.Height;
  };

  return AVLTree;
})();

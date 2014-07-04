var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MetalBoxes;
(function (MetalBoxes) {
    var Colors = (function () {
        function Colors() {
        }
        Colors.Red = 'red';
        Colors.Green = 'green';
        Colors.Blue = 'blue';

        Colors.All = [Colors.Red, Colors.Green, Colors.Blue];
        return Colors;
    })();

    var BoxModel = (function (_super) {
        __extends(BoxModel, _super);
        function BoxModel(box) {
            _super.call(this);
            this.set(box);
        }
        /*
        Is that too much?
        */
        BoxModel.prototype.getHeight = function () {
            return +this.get('height');
        };
        BoxModel.prototype.setHeight = function (value) {
            this.set('height', value);
        };

        BoxModel.prototype.getWidth = function () {
            return +this.get('width');
        };
        BoxModel.prototype.setWidth = function (value) {
            this.set('width', value);
        };

        BoxModel.prototype.getLeft = function () {
            return +this.get('left');
        };
        BoxModel.prototype.setLeft = function (value) {
            this.set('left', value);
        };

        BoxModel.prototype.getTop = function () {
            return +this.get('top');
        };
        BoxModel.prototype.setTop = function (value) {
            this.set('top', value);
        };

        BoxModel.prototype.getColor = function () {
            return this.get('color');
        };
        BoxModel.prototype.setColor = function (value) {
            this.set('color', value);
        };

        BoxModel.getSomeBox = function () {
            return new BoxModel({
                height: Math.floor(Math.random() * 100) + 50,
                width: Math.floor(Math.random() * 100) + 50,
                top: Math.floor(Math.random() * 480),
                left: Math.floor(Math.random() * 640),
                color: Colors.All[Math.floor(Math.random() * Colors.All.length)]
            });
        };
        return BoxModel;
    })(Backbone.Model);

    var BoxView = (function (_super) {
        __extends(BoxView, _super);
        function BoxView(boxModel) {
            _super.call(this, {
                model: boxModel,
                tagName: 'div',
                className: 'rect'
            });
        }
        BoxView.prototype.render = function () {
            var _this = this;
            var newRect = $(document.createElement(this.tagName)).addClass(this.className).attr('id', this.cid).css({
                'height': this.model.getHeight() + 'px',
                'width': this.model.getWidth() + 'px',
                'background-color': this.model.getColor(),
                'left': this.model.getLeft(),
                'top': this.model.getTop()
            }).click(function () {
                if (_this.model.getColor() == Colors.Red) {
                    _this.trigger('removeBox');
                } else {
                    _this.trigger('addBox');
                }
            });

            this.$el = newRect;
            this.el = newRect.get(0);

            return this;
        };
        return BoxView;
    })(Backbone.View);

    var BoxList = (function (_super) {
        __extends(BoxList, _super);
        function BoxList() {
            _super.apply(this, arguments);
        }
        BoxList.prototype.addBox = function () {
            this.add(BoxModel.getSomeBox());
            return this;
        };

        BoxList.prototype.removeBox = function () {
            var randIx = Math.floor(Math.random() * this.length);
            this.remove(this.at(randIx));
            return this;
        };
        return BoxList;
    })(Backbone.Collection);

    //class AltBoxListView extends Backbone.View<BoxList> {
    //}
    /*
    This view has nothing to do with backbone.
    */
    var BoxListView = (function () {
        function BoxListView(boxList) {
            var _this = this;
            this.boxListViews = [];

            this.boxList = boxList;

            /*
            Watch that shifty this!
            */
            //this.boxList.on('add', this.addBox);
            //this.boxList.on('add', function (boxModel: BoxModel) {
            //    this.addBox(boxModel);
            //});
            this.boxList.on('add', function (boxModel) {
                _this.addBox.call(_this, boxModel);
            });
            this.boxList.on('remove', function (boxModel) {
                _this.removeBox.call(_this, boxModel);
            });
        }
        BoxListView.prototype.addBox = function (boxModel) {
            /*
            Are you sure this will always be BoxListView?
            */
            var _this = this;
            var newBoxView = new BoxView(boxModel);

            // Listen on model events.
            newBoxView.on('addBox', function () {
                _this.boxList.addBox();
            });
            newBoxView.on('removeBox', function () {
                _this.boxList.removeBox();
            });

            // Render view.
            document.body.appendChild(newBoxView.render().el);

            // Save to know which view to remove later.
            this.boxListViews.push(newBoxView);
        };

        BoxListView.prototype.removeBox = function (boxModel) {
            // Find view with matching temp id.
            this.boxListViews.filter(function (boxView) {
                /*
                Watch intellisesnse in action.
                */
                return boxView.model.cid === boxModel.cid;
            }).forEach(function (boxView) {
                boxView.remove();
            });

            // Update view list.
            this.boxListViews = this.boxListViews.filter(function (boxView) {
                return boxView.model.cid !== boxModel.cid;
            });
        };
        return BoxListView;
    })();

    $(function () {
        var boxList = new BoxList();
        new BoxListView(boxList);

        // Add some boxes.
        var redBox = {
            height: 160,
            width: 90,
            color: Colors.Red,
            top: 200,
            left: 300
        };
        var redBoxModel = new BoxModel(redBox);

        boxList.add(redBoxModel);
        boxList.add(BoxModel.getSomeBox());
        boxList.add(BoxModel.getSomeBox());
    });
})(MetalBoxes || (MetalBoxes = {}));
//# sourceMappingURL=boxes.js.map

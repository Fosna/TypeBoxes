module MetalBoxes {
    interface Box {
        height?: number;
        width?: number;
        left: number;
        top: number;
    }

    class Colors {
        static Red = 'red';
        static Green = 'green';
        static Blue = 'blue';

        static All = [Colors.Red, Colors.Green, Colors.Blue];
    }

    class BoxModel extends Backbone.Model {
        constructor(box: Box) {
            super();
            this.set(box);
        }

        /*
        Is that too much?
        */
        getHeight(): number {
            return +this.get('height');
        }
        setHeight(value: number) {
            this.set('height', value);
        }

        getWidth(): number {
            return +this.get('width');
        }
        setWidth(value: number) {
            this.set('width', value);
        }

        getLeft(): number {
            return +this.get('left');
        }
        setLeft(value: number): void {
            this.set('left', value);
        }

        getTop(): number {
            return +this.get('top');
        }
        setTop(value: number): void {
            this.set('top', value);
        }

        getColor(): any {
            return this.get('color');
        }
        setColor(value: any): void {
            this.set('color', value);
        }

        static getSomeBox() {
            return new BoxModel({
                height: Math.floor(Math.random() * 100) + 50, // [50, 150)
                width: Math.floor(Math.random() * 100) + 50, // [50, 150)
                top: Math.floor(Math.random() * 480), // [0, 480)
                left: Math.floor(Math.random() * 640), // [0, 640)
                color: Colors.All[Math.floor(Math.random() * Colors.All.length)] // some color
            });
        }
    }

    class BoxView extends Backbone.View<BoxModel>  {
        constructor(boxModel: BoxModel) {
            super({
                model: boxModel,
                tagName: 'div',
                className: 'rect'
            });
        }

        render() {
            var newRect = $(document.createElement(this.tagName)).
                addClass(this.className).
                attr('id', this.cid).
                css({
                    'height': this.model.getHeight() + 'px',
                    'width': this.model.getWidth() + 'px',
                    'background-color': this.model.getColor(),
                    'left': this.model.getLeft(),
                    'top': this.model.getTop()
                }).
            //
            // What about BoxView.prototype.events = { 'click': function () {...} }
            //
                click(() => {
                    if (this.model.getColor() == Colors.Red) {
                        this.trigger('removeBox');
                    } else {
                        this.trigger('addBox');
                    }
                });

            this.$el = newRect;
            this.el = newRect.get(0);

            return this;
        }
    }

    class BoxList extends Backbone.Collection<BoxModel> {
        addBox() {
            this.add(BoxModel.getSomeBox());
            return this;
        }

        removeBox() {
            var randIx = Math.floor(Math.random() * this.length);
            this.remove(this.at(randIx));
            return this;
        }
    }

    //class AltBoxListView extends Backbone.View<BoxList> {

    //}
    /*
    This view has nothing to do with backbone.
    */
    class BoxListView {
        boxList: BoxList;
        boxListViews: BoxView[];

        constructor(boxList: BoxList) {
            this.boxListViews = [];

            this.boxList = boxList;
            /*
            Watch that shifty this!
            */
            //this.boxList.on('add', this.addBox);
            //this.boxList.on('add', function (boxModel: BoxModel) {
            //    this.addBox(boxModel);
            //});
            this.boxList.on('add', (boxModel: BoxModel) => {
                this.addBox.call(this, boxModel);
            });
            this.boxList.on('remove', (boxModel: BoxModel) => {
                this.removeBox.call(this, boxModel);
            });
        }

        addBox(boxModel: BoxModel) {
            /*
            Are you sure this will always be BoxListView?
            */

            var newBoxView = new BoxView(boxModel);

            // Listen on model events.
            newBoxView.on('addBox', () => {
                this.boxList.addBox();
            });
            newBoxView.on('removeBox', () => {
                this.boxList.removeBox();
            });

            // Render view.
            document.body.appendChild(newBoxView.render().el);

            // Save to know which view to remove later.
            this.boxListViews.push(newBoxView);
        }

        removeBox(boxModel: BoxModel) {
            // Find view with matching temp id.
            this.boxListViews.
                filter(function (boxView) {
                    /*
                    Watch intellisesnse in action.
                    */
                    return boxView.model.cid === boxModel.cid;
                }).
            // and destroy it.
                forEach(function (boxView) {
                    boxView.remove();
                });

            // Update view list.
            this.boxListViews = this.boxListViews.filter(function (boxView) {
                return boxView.model.cid !== boxModel.cid;
            });
        }
    }

    $(() => {
        var boxList = new BoxList();
        new BoxListView(boxList);

        // Add some boxes.
        var redBox: Box = {
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
}
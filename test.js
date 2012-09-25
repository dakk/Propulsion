var TEST;

propulsion(document.getElementById('displayCanvas'), function(PP) {
    "use strict";

    TEST = PP;
    var marioSpr = PP.sprite.create('mario.png', 1, PP.vector.create(13, 20));

    PP.sprite.load(function() {
        var foo = function() {
            PP.event.initialize.bind(this, function(event) {
                this.angle = 0;
                this.position = PP.vector.create(0, 0);
                this.angularVelocity = 0.01;
                this.velocity = PP.vector.create(0, -10);
                this.mask = marioSpr.mask;
                this.mass = this.mask.mass(1);
                this.momentOfInertia = this.mask.momentOfInertia(this.mass);
                //this.momentOfInertia = Infinity;
                this.restitution = 0.1;
            });

            PP.event.tick.bind(this, function(event) {
                if (PP.key.space.pressed) {
                    this.position.x = PP.mouse.position.x;
                    this.position.y = PP.mouse.position.y;
                }
                var collision = PP.collision.objects(bar, foo);
                this.contact = false;
                if (collision) {
                    var response = collision.resolve(1);
                    this.contact = response.contactPoint;
                    if (response) {
                        response.response();
                    }
                }
            });

            PP.event.draw.bind(this, function(event) {
                marioSpr.draw(this.position.x, this.position.y, 0, this.angle);
                if (this.contact) {
                    
                    //PP.draw.color = 'red';
                    PP.draw.circle(this.contact.x, this.contact.y, 20);
                }
            });

            return this;
        }.call({});

        var bar = function() {
            PP.event.initialize.bind(this, function(event) {
                this.angle = 0;
                this.position = PP.vector.create(100, 100);
                this.velocity = PP.vector.create(2, 1);
                this.angularVelocity = -0.01;
                this.mask = marioSpr.mask;
                this.mass = this.mask.mass(1);
                this.momentOfInertia = this.mask.momentOfInertia(this.mass);
                //this.momentOfInertia = Infinity;
                this.restitution = 0.1;
            });

            PP.event.draw.bind(this, function(event) {
                marioSpr.draw(this.position.x, this.position.y, 0, this.angle);
            });

            return this;
        }.call({});

        PP.room.currentRoom = function() {
            PP.loop.register(foo);
            PP.loop.register(bar);
            PP.draw.color = 'red';
        };

        PP.loop.begin();
    });
}, 800, 600);
propulsion.modules.push(function(PP) {
    "use strict";
    PP.Sprite = function() {
        
    };

    PP.sprite = {
        loadingQueue: [],
        loadTotal: 0,
        loadCount: 0,

        proto: {
            frame: function(currentFrame, increment) {
                currentFrame += increment;
                var subimages = this.subimages;
                return currentFrame - subimages * Math.floor(currentFrame/subimages);
            },

            draw: function(x, y, subimg, angle, width, height, scale) {
                if (subimg === undefined) {
                    subimg = 0;
                }

                if (width === undefined) {
                    width = this.width;
                }

                if (height === undefined) {
                    height = this.height;
                }

                if (scale) {
                    width *= this.width;
                    height *= this.height;
                }

                var absWidth = Math.abs(width),
                    absHeight = Math.abs(height),
                    hasRotation = (angle !== undefined && angle !== 0),
                    hasNegSize = false,
                    subimageWidth = this.subimageWidth,
                    sx = subimg * subimageWidth,
                    offsetx = this.origin.x,
                    offsety = this.origin.y;
                
                var hasSize = (width !== undefined || height !== undefined);

                if (hasSize) {
                    offsetx *= absWidth/this.width;
                    offsety *= absHeight/this.height;

                    if (width < 0 || height < 0) {
                        hasNegSize = true;
                    }
                }

                var i, xx, yy, target, pos, radius, ctx,
                    targets = PP.draw.targets,
                    len = targets.length;

                for (i = 0; i < len; i++) {
                    target = targets[i];
                    pos = target.position;
                    xx = x - pos.x;
                    yy = y - pos.x;
                    ctx = target.ctx;
                    radius = Math.sqrt(Math.pow(Math.max(offsetx, absWidth - offsetx), 2) + Math.pow(Math.max(offsety, absHeight - offsety), 2));
                    if (!(xx + radius < 0 || yy + radius < 0 || xx - radius > target.width || yy - radius > target.height)) {
                        ctx.save();
                        ctx.translate(xx, yy);

                        if (hasRotation) {
                            ctx.rotate(angle);
                        }

                        if (hasNegSize) {
                            ctx.scale(PP.math.sign(width), PP.math.sign(height));
                        }

                        ctx.drawImage(this.canvas, sx, 0, subimageWidth, this.height, -offsetx, -offsety, absWidth, absHeight);
                        ctx.restore();
                    }
                }

                return this;
            }
        },

        load: (function() {
            var callback;
            var firstLoad = false;
            var loadNext = function() {
                var queue = PP.sprite.loadingQueue;
                if (!firstLoad) {
                    var loadedSprite = queue.pop(),
                        img = loadedSprite.image,
                        width = loadedSprite.image.width,
                        height = loadedSprite.image.height,
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        origin = loadedSprite.origin,
                        x1 = -origin.x,
                        y1 = -origin.y,
                        x2 = width + x1,
                        y2 = height + y1;
                    loadedSprite.subimageWidth = width/loadedSprite.subimages;
                    loadedSprite.width = width;
                    loadedSprite.height = height;
                    loadedSprite.mask = PP.mask.create([[x1, y1], [x2, y1], [x2, y2], [x1, y2]]);
                    loadedSprite.canvas = canvas;
                    loadedSprite.radius = Math.sqrt(Math.pow(Math.max(origin.x, width - origin.x), 2) + Math.pow(Math.max(origin.y, height - origin.y), 2));
                    canvas.width = width;
                    canvas.height = height;
                    loadedSprite.ctx = ctx;
                    ctx.drawImage(img, 0, 0);
                    delete loadedSprite.image;
                    PP.sprite.loadCount += 1;
                }
                
                firstLoad = false;
                var nextSprite = queue[queue.length - 1];
                if (nextSprite !== undefined) {
                    var img = new Image();
                    nextSprite.image = img;
                    img.src = nextSprite.url;
                    img.addEventListener('load', loadNext);
                } else {
                    if (callback) {
                        callback();
                    }
                    PP.sprite.loadTotal = 0;
                    PP.sprite.loadCount = 0;
                }
            };

            return function(cb) {
                callback = cb;
                PP.sprite.loadedTotal = PP.sprite.loadingQueue.length;
                PP.sprite.loadedCount = 0;
                firstLoad = true;
                loadNext(true);
            };
        }()),

        create: function(url, subimages, origin) {
            if (subimages === undefined) {
                subimages = 1;
            }

            if (origin === undefined) {
                origin = PP.vector.create(0, 0);
            }

            var imgObj = Object.create(PP.sprite.proto);
            imgObj.url = url;
            imgObj.subimages = subimages;
            imgObj.origin = origin;

            PP.sprite.loadingQueue.push(imgObj);

            return imgObj;
        }
    };
});
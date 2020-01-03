function Snake() {
    //private :
    const statable = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };
    let body = [{ x: 0, y: 0 }];
    //public :
    this.state = statable.RIGHT;

    this.growAt = (coords) => { 
        body.unshift({ x: coords.x, y: coords.y }) 
    };
    this.getStatable = () => { return statable };
    this.getBodyArr = () => { return body };
    this.move = (unitSqr) => {
        //move the body following the head (body[0])
        for (let i = body.length - 1; i > 0; i--) {
            body[i] = { x: body[i - 1].x, y: body[i - 1].y };
        }

        switch (this.state) {
            case statable.RIGHT: body[0].x += unitSqr; break;
            case statable.LEFT: body[0].x -= unitSqr; break;
            case statable.UP: body[0].y -= unitSqr; break;
            case statable.DOWN: body[0].y += unitSqr; break;
        }
    }
    this.setHead = (coords) => {body[0].x = coords.x; body[0].y = coords.y}
    this.ateSelf = () => {
        let ate = false;
        for (let i = 1; i < body.length; i++){
            if (body[0].x == body[i].x && body[0].y == body[i].y){
                return true;
            }
        }
        return false;
    }
    this.clear = function(){
        body = [];
    }
}

function Food() {
    let coords = { x: -1, y: -1 };
    this.create = function (unit, width, height) {
        coords.x = Math.floor(Math.random() * Math.floor((width - unit) / unit)) * unit;
        coords.y = Math.floor(Math.random() * Math.floor((height - unit) / unit)) * unit;
    }
    this.getCoords = () => { return {x : coords.x, y : coords.y} }
}
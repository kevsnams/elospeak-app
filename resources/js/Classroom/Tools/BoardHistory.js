export default class BoardHistory {
    constructor() {
        this.histories = [];
        this.cursor = 0;
    }

    add(value) {
        this.histories.push(value);
        this.next();
    }

    next() {
        this.cursor += 1;

        if (this.cursor > this.histories.length) {
            this.prev();
        }

        return this;
    }

    prev() {
        this.cursor -= 1;

        if (this.cursor < 0) {
            this.next();
        }
        return this;
    }

    get current() {
        return this.histories[this.cursor - 1];
    }
}
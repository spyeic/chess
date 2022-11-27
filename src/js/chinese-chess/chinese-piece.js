class ChinesePiece {
    /**
     * @param board {ChineseBoard}
     * @param name {string}
     * @param color {"red" | "black"}
     * @param x {number}
     * @param y {number}
     * @param container {HTMLDivElement}
     * @param getPreviewPositions {function (piece: ChinesePiece): Array<{x: number, y: number}>}
     */
    constructor(board, name, color, x, y, container, getPreviewPositions) {
        this.board = board;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.container = container;
        this.callback = getPreviewPositions;
    }

    getPreviewPositions() {
        return this.callback(this);
    }

    /**
     * @param targetX {number} target x
     * @param targetY {number} target y
     * @return {boolean} can move to target position
     */
    canMove(targetX, targetY) {
        return this.getPreviewPositions().some((pos) => pos.x === targetX && pos.y === targetY);
    }

    /**
     * Move to target position
     * @param x {number}
     * @param y {number}
     */
    moveTo(x, y) {
        this.board.setPieceAt(this.x, this.y, null);
        this.x = x;
        this.y = y;
        const piece = this.board.getPieceAt(x, y);
        if (piece) {
            piece.container.style.display = "none";
        }
        this.board.setPieceAt(x, y, this);

        const size = this.board.spacing * 0.8;
        this.container.style.transitionDuration = "0.5s";
        this.container.style.zIndex = "1";
        window.setTimeout(() => {
            this.container.style.transitionDuration = "0s";
            this.container.style.zIndex = "0";
        }, 500);
        this.container.style.left = `${this.board.spacing * (this.x + 0.5) - size / 2}px`;
        this.container.style.top = `${this.board.spacing * (this.y + 0.5) - size / 2}px`;
    }

    render() {
        const size = this.board.spacing * 0.8;
        this.container.style.width = `${size}px`;
        this.container.style.height = `${size}px`;
        this.container.style.left = `${this.board.spacing * (this.x + 0.5) - size / 2}px`;
        this.container.style.top = `${this.board.spacing * (this.y + 0.5) - size / 2}px`;
        this.container.style.fontSize = `${this.board.spacing * 0.6}px`;
        this.container.style.boxShadow = `${size * 0.05}px ${size * 0.05}px ${size * 0.05}px rgba(0, 0, 0, 0.6)`;
    }

    /**
     * @param x {number}
     * @param y {number}
     * @returns {boolean}
     */
    isSameColor(x, y) {
        const piece = this.board.getPieceAt(x, y);
        return piece && piece.color === this.color;
    }
}

export default ChinesePiece;

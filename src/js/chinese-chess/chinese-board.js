import "../../css/board.css";
import handleOptions from "../options";
import previewUtil from "./draw-preview-positions";
import ChinesePiece from "./chinese-piece";

class ChineseBoard {
    /**
     * @param options {Object}
     */
    constructor(options) {
        this.options = handleOptions(options);
        this.container = options.container;
        this.boardCanvas = document.createElement("canvas");
        this.boardCanvas.classList.add("board");
        this.boardCanvas.style.zIndex = "-1";
        this.boardCanvas.style.backgroundColor = this.options.backgroundColor;

        this.previewCanvas = document.createElement("canvas");
        this.previewCanvas.classList.add("preview");
        this.previewCanvas.style.zIndex = "-1";
        /**
         * @type {Array<Array<ChinesePiece>>}
         */
        this.pieces = new Array(10);
        this.initPieces();
        window.addEventListener("resize", () => this.render());
        this.render();
        this.container.appendChild(this.boardCanvas);
        this.container.appendChild(this.previewCanvas);

        this.turn = "red";
        this.selectedPiece = null;
        this.dangerousPositions = [];
        this.container.onclick = (ev) => {
            const { x, y } = this.getPosInEvent(ev);
            const piece = this.getPieceAt(x, y);
            if (this.selectedPiece) {
                if (this.selectedPiece.canMove(x, y)) {
                    this.selectedPiece.moveTo(x, y);
                }
                this.dangerousPositions.forEach(({ x, y }) => {
                    this.getPieceAt(x, y).container.classList.remove("dangerous");
                });
                this.dangerousPositions = [];
                this.previewCanvas.getContext("2d").clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
                this.previewCanvas.style.zIndex = "-1";
                this.selectedPiece.container.classList.remove("selected");
                this.selectedPiece = null;
            } else {
                if (piece) {
                    this.previewCanvas.style.zIndex = "0";
                    this.selectedPiece = piece;
                    this.drawPreview();
                    this.selectedPiece.container.classList.add("selected");
                }
            }
        };
    }

    initPieces() {
        for (let y = 0; y < this.pieces.length; y++) {
            this.pieces[y] = new Array(9);
        }

        // init red pieces
        this.createPiece("帅", "red", 4, 9, previewUtil.king);
        this.createPiece("仕", "red", 3, 9, previewUtil.shi);
        this.createPiece("仕", "red", 5, 9, previewUtil.shi);
        this.createPiece("相", "red", 2, 9, previewUtil.xiang);
        this.createPiece("相", "red", 6, 9, previewUtil.xiang);
        this.createPiece("马", "red", 1, 9, previewUtil.ma);
        this.createPiece("马", "red", 7, 9, previewUtil.ma);
        this.createPiece("车", "red", 0, 9, previewUtil.ju);
        this.createPiece("车", "red", 8, 9, previewUtil.ju);
        this.createPiece("炮", "red", 1, 7, previewUtil.pao);
        this.createPiece("炮", "red", 7, 7, previewUtil.pao);
        for (let i = 0; i < 5; i++) {
            this.createPiece("兵", "red", i * 2, 6, previewUtil.bing);
        }

        // init black pieces
        this.createPiece("将", "black", 4, 0, previewUtil.king);
        this.createPiece("士", "black", 3, 0, previewUtil.shi);
        this.createPiece("士", "black", 5, 0, previewUtil.shi);
        this.createPiece("象", "black", 2, 0, previewUtil.xiang);
        this.createPiece("象", "black", 6, 0, previewUtil.xiang);
        this.createPiece("马", "black", 1, 0, previewUtil.ma);
        this.createPiece("马", "black", 7, 0, previewUtil.ma);
        this.createPiece("车", "black", 0, 0, previewUtil.ju);
        this.createPiece("车", "black", 8, 0, previewUtil.ju);
        this.createPiece("炮", "black", 1, 2, previewUtil.pao);
        this.createPiece("炮", "black", 7, 2, previewUtil.pao);
        for (let i = 0; i < 5; i++) {
            this.createPiece("卒", "black", i * 2, 3, previewUtil.zu);
        }
    }

    /**
     * @param name {string}
     * @param color {"red" | "black"}
     * @param x {number}
     * @param y {number}
     * @param getPreviewPositions {function (piece: ChinesePiece): Array<{x: number, y: number}>}
     */
    createPiece(name, color, x, y, getPreviewPositions) {
        const pieceNode = document.createElement("div");
        pieceNode.classList.add("piece");
        pieceNode.classList.add(color);
        const nameNode = document.createElement("div");
        nameNode.classList.add("piece-name");
        nameNode.innerText = name;
        pieceNode.appendChild(nameNode);
        this.container.appendChild(pieceNode);
        this.setPieceAt(x, y, new ChinesePiece(this, name, color, x, y, pieceNode, getPreviewPositions));
    }

    render() {
        this.spacing = this.container.clientWidth / 9;
        this.container.width = this.spacing * 9;
        this.container.height = this.spacing * 10;

        const ratio = window.devicePixelRatio || 1;
        this.previewCanvas.width = this.boardCanvas.width = this.container.width * ratio;
        this.previewCanvas.height = this.boardCanvas.height = this.container.height * ratio;
        this.previewCanvas.style.width = this.boardCanvas.style.width = `${this.container.width}px`;
        this.previewCanvas.style.height = this.boardCanvas.style.height = `${this.container.height}px`;
        this.previewCanvas.getContext("2d").scale(ratio, ratio);
        this.boardCanvas.getContext("2d").scale(ratio, ratio);
        this.drawBoard();
        this.drawPieces();
        this.drawPreview();
    }

    drawPieces() {
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = this.getPieceAt(x, y);
                if (piece) {
                    piece.render();
                }
            }
        }
    }

    drawBoard() {
        const ctx = this.boardCanvas.getContext("2d");
        ctx.beginPath();
        // ---------- Start drawing the board outline ---------- //
        ctx.moveTo(this.spacing / 5 * 2, this.spacing / 5 * 2);
        ctx.lineTo(this.spacing / 5 * 3 + this.spacing * 8, this.spacing / 5 * 2);
        ctx.lineTo(this.spacing / 5 * 3 + this.spacing * 8, this.spacing / 5 * 3 + this.spacing * 9);
        ctx.lineTo(this.spacing / 5 * 2, this.spacing / 5 * 3 + this.spacing * 9);
        ctx.lineTo(this.spacing / 5 * 2, this.spacing / 5 * 2);
        // ---------- Finish drawing the board outline ---------- //
        // ---------- Start drawing the lines ---------- //
        for (let i = 0; i < 10; i++) {
            ctx.moveTo(this.spacing * 0.5, (i + 0.5) * this.spacing);
            ctx.lineTo(this.spacing * 8.5, (i + 0.5) * this.spacing);
        }
        ctx.moveTo(this.spacing * 0.5, this.spacing * 0.5);
        ctx.lineTo(this.spacing * 0.5, this.spacing * 9.5);
        for (let i = 1; i < 8; i++) {
            ctx.moveTo((i + 0.5) * this.spacing, this.spacing * 0.5);
            ctx.lineTo((i + 0.5) * this.spacing, this.spacing * 4.5);
            ctx.moveTo((i + 0.5) * this.spacing, this.spacing * 5.5);
            ctx.lineTo((i + 0.5) * this.spacing, this.spacing * 9.5);
        }
        ctx.moveTo(this.spacing * 8.5, this.spacing * 0.5);
        ctx.lineTo(this.spacing * 8.5, this.spacing * 9.5);
        // ---------- Finish drawing the lines ---------- //
        // ---------- Start drawing the dots ---------- //
        /**
         * @param x {number}
         * @param y {number}
         */
        const drawLeftSide = (x, y) => {
            ctx.moveTo(this.spacing * (0.4 + x), this.spacing * (0.25 + y));
            ctx.lineTo(this.spacing * (0.4 + x), this.spacing * (0.4 + y));
            ctx.lineTo(this.spacing * (0.25 + x), this.spacing * (0.4 + y));
            ctx.moveTo(this.spacing * (0.4 + x), this.spacing * (0.75 + y));
            ctx.lineTo(this.spacing * (0.4 + x), this.spacing * (0.6 + y));
            ctx.lineTo(this.spacing * (0.25 + x), this.spacing * (0.6 + y));
        };
        /**
         * @param x {number}
         * @param y {number}
         */
        const drawRightSide = (x, y) => {
            ctx.moveTo(this.spacing * (0.6 + x), this.spacing * (0.25 + y));
            ctx.lineTo(this.spacing * (0.6 + x), this.spacing * (0.4 + y));
            ctx.lineTo(this.spacing * (0.75 + x), this.spacing * (0.4 + y));
            ctx.moveTo(this.spacing * (0.6 + x), this.spacing * (0.75 + y));
            ctx.lineTo(this.spacing * (0.6 + x), this.spacing * (0.6 + y));
            ctx.lineTo(this.spacing * (0.75 + x), this.spacing * (0.6 + y));
        };
        // Draw the dots for "bing" pieces
        for (let i = 0; i < 4; i++) {
            drawLeftSide((i + 1) * 2, 3);
            drawRightSide(i * 2, 3);
            drawLeftSide((i + 1) * 2, 6);
            drawRightSide(i * 2, 6);
        }

        const drawBothSides = (x, y) => {
            drawLeftSide(x, y);
            drawRightSide(x, y);
        };
        // Draw the dots for "pao" pieces
        drawBothSides(1, 2);
        drawBothSides(7, 2);
        drawBothSides(1, 7);
        drawBothSides(7, 7);
        // ---------- Finish drawing the dots ---------- //
        // ---------- Start drawing the palace ---------- //
        ctx.moveTo(this.spacing * 3.5, this.spacing * 0.5);
        ctx.lineTo(this.spacing * 5.5, this.spacing * 2.5);
        ctx.moveTo(this.spacing * 5.5, this.spacing * 0.5);
        ctx.lineTo(this.spacing * 3.5, this.spacing * 2.5);

        ctx.moveTo(this.spacing * 3.5, this.spacing * 7.5);
        ctx.lineTo(this.spacing * 5.5, this.spacing * 9.5);
        ctx.moveTo(this.spacing * 5.5, this.spacing * 7.5);
        ctx.lineTo(this.spacing * 3.5, this.spacing * 9.5);
        // ---------- Finish drawing the palace ---------- //
        ctx.stroke();
    }

    drawPreview() {
        if (this.selectedPiece) {
            const context = this.previewCanvas.getContext("2d");
            this.selectedPiece.getPreviewPositions().forEach(({ x, y }) => {
                if (this.getPieceAt(x, y) && this.getPieceAt(x, y).color !== this.selectedPiece.color) {
                    this.getPieceAt(x, y).container.classList.add("dangerous");
                    this.dangerousPositions.push({ x, y });
                } else {
                    context.beginPath();
                    context.arc((x + 0.5) * this.spacing, (y + 0.5) * this.spacing, this.spacing / 5, 0, 2 * Math.PI);
                    context.fill();
                }
            });
        }
    }

    toggleTurn() {
        this.turn = this.turn === "red" ? "black" : "red";
    }

    /**
     * @param ev {MouseEvent}
     * @returns {{x: number, y: number}}
     */
    getPosInEvent(ev) {
        return {
            x: Math.floor((ev.x - (this.container.offsetLeft - this.container.width / 2)) / this.container.width * 9),
            y: Math.floor((ev.y - this.container.offsetTop) / this.container.height * 10)
        };
    }

    isOnBoard(x, y) {
        return x >= 0 && x < 9 && y >= 0 && y < 10;
    }

    /**
     * @param x {number}
     * @param y {number}
     * @returns {null|ChinesePiece}
     */
    getPieceAt(x, y) {
        if (!this.isOnBoard(x, y)) {
            return null;
        }
        return this.pieces[y][x];
    }

    /**
     * @param x {number}
     * @param y {number}
     * @param piece {null|ChinesePiece}
     */
    setPieceAt(x, y, piece) {
        if (!this.isOnBoard(x, y)) {
            return;
        }
        this.pieces[y][x] = piece;
    }

    /**
     * @param x {number}
     * @param y {number}
     * @param callback {function(number, number): void}
     */
    takeIfOnBoard(x, y, callback) {
        if (!this.isOnBoard(x, y)) {
            return;
        }
        callback(x, y);
    }

    isInPalace(x, y, color) {
        return (color === "red" ? y > 6 : y < 3) && x > 2 && x < 6;
    }
}

export default ChineseBoard;

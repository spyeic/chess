export default {
    /**
     * @param piece {ChinesePiece}
     * @return {Array<{x:number, y:number}>} can place
     */
    bing: (piece) => {
        const canPlace = [];
        function addToList(x, y) {
            piece.board.takeIfOnBoard(x, y, (x, y) => {
                if (!piece.isSameColor(x, y)) {
                    canPlace.push({ x, y });
                }
            });
        }
        addToList(piece.x, piece.y - 1);
        if (piece.y <= 4) {
            addToList(piece.x - 1, piece.y);
            addToList(piece.x + 1, piece.y);
        }
        return canPlace;
    },

    zu: (piece) => {
        const canPlace = [];
        function addToList(x, y) {
            piece.board.takeIfOnBoard(x, y, (x, y) => {
                if (!piece.isSameColor(x, y)) {
                    canPlace.push({ x, y });
                }
            });
        }
        addToList(piece.x, piece.y + 1);
        if (piece.y >= 5) {
            addToList(piece.x - 1, piece.y);
            addToList(piece.x + 1, piece.y);
        }
        return canPlace;
    },

    pao: (piece) => {
        const canPlace = [];
        function addToList(getNextPos) {
            let pos = getNextPos({ x: piece.x, y: piece.y });
            let isShooting = false;
            while (piece.board.isOnBoard(pos.x, pos.y)) {
                if (isShooting) {
                    if (piece.board.getPieceAt(pos.x, pos.y) && !piece.isSameColor(pos.x, pos.y)) {
                        canPlace.push(pos);
                        break;
                    }
                } else {
                    if (piece.board.getPieceAt(pos.x, pos.y)) {
                        isShooting = true;
                    } else {
                        canPlace.push(pos);
                    }
                }
                pos = getNextPos({ x: pos.x, y: pos.y });
            }
        }
        addToList((pos) => ({ x: pos.x, y: pos.y - 1 }));
        addToList((pos) => ({ x: pos.x, y: pos.y + 1 }));
        addToList((pos) => ({ x: pos.x - 1, y: pos.y }));
        addToList((pos) => ({ x: pos.x + 1, y: pos.y }));
        return canPlace;
    },

    ju: (piece) => {
        const canPlace = [];
        function addToList(getNextPos) {
            let pos = getNextPos({ x: piece.x, y: piece.y });
            while (piece.board.isOnBoard(pos.x, pos.y)) {
                if (piece.board.getPieceAt(pos.x, pos.y)) {
                    if (!piece.isSameColor(pos.x, pos.y)) {
                        canPlace.push(pos);
                    }
                    break;
                } else {
                    canPlace.push(pos);
                }
                pos = getNextPos(pos);
            }
        }
        addToList((pos) => ({ x: pos.x, y: pos.y - 1 }));
        addToList((pos) => ({ x: pos.x, y: pos.y + 1 }));
        addToList((pos) => ({ x: pos.x - 1, y: pos.y }));
        addToList((pos) => ({ x: pos.x + 1, y: pos.y }));
        return canPlace;
    },

    ma: (piece) => {
        const canPlace = [];
        function addToList(x, y) {
            const blockX = x - Math.sign(x - piece.x);
            const blockY = y - Math.sign(y - piece.y);
            piece.board.takeIfOnBoard(x, y, (x, y) => {
                if (!piece.board.getPieceAt(blockX, blockY) && !piece.isSameColor(x, y)) {
                    canPlace.push({ x, y });
                }
            });
        }
        addToList(piece.x - 1, piece.y - 2);
        addToList(piece.x + 1, piece.y - 2);
        addToList(piece.x + 2, piece.y - 1);
        addToList(piece.x + 2, piece.y + 1);
        addToList(piece.x + 1, piece.y + 2);
        addToList(piece.x - 1, piece.y + 2);
        addToList(piece.x - 2, piece.y + 1);
        addToList(piece.x - 2, piece.y - 1);
        return canPlace;
    },

    xiang: (piece) => {
        const canPlace = [];
        function addToList(x, y) {
            const blockX = x - Math.sign(x - piece.x);
            const blockY = y - Math.sign(y - piece.y);
            piece.board.takeIfOnBoard(x, y, (x, y) => {
                if (!piece.board.getPieceAt(blockX, blockY) && !piece.isSameColor(x, y)) {
                    canPlace.push({ x, y });
                }
            });
        }
        addToList(piece.x - 2, piece.y - 2);
        addToList(piece.x + 2, piece.y - 2);
        addToList(piece.x + 2, piece.y + 2);
        addToList(piece.x - 2, piece.y + 2);
        return canPlace;
    },

    shi: (piece) => {
        const canPlace = [];
        function addToList(x, y) {
            piece.board.takeIfOnBoard(x, y, (x, y) => {
                if (piece.board.isInPalace(x, y, piece.color) && !piece.isSameColor(x, y)) {
                    canPlace.push({ x, y });
                }
            });
        }
        addToList(piece.x - 1, piece.y - 1);
        addToList(piece.x + 1, piece.y - 1);
        addToList(piece.x + 1, piece.y + 1);
        addToList(piece.x - 1, piece.y + 1);
        return canPlace;
    },

    king: (piece) => {
        const canPlace = [];
        function addToList(x, y) {
            piece.board.takeIfOnBoard(x, y, (x, y) => {
                if (piece.board.isInPalace(x, y, piece.color) && !piece.isSameColor(x, y)) {
                    canPlace.push({ x, y });
                }
            });
        }
        addToList(piece.x, piece.y - 1);
        addToList(piece.x, piece.y + 1);
        addToList(piece.x - 1, piece.y);
        addToList(piece.x + 1, piece.y);
        return canPlace;
    }
};

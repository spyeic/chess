import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import "../css/piece.css";

import ChineseBoard from "./chinese-chess/chinese-board";

const container = document.getElementById("container");
const board = new ChineseBoard({
    container
});

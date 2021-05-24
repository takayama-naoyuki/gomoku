//碁盤の状態を保持する二次元配列(19*19)
//o or x or -
let tableData = [...Array(19)].map(() => Array(19).fill("-"));
//次のプレイヤーを示す変数
//true -> 次はo false -> 次はx
let nextPlayerIsO = true;

//状態をリセットする
function resetTable() {
    tableData = [...Array(19)].map(() => Array(19).fill("-"));
    let nextPlayerIsO = true;
    updateTable();
    updatePlayer();
}

//tableDataのデータを元に画面を更新する
function updateTable() {
    const table = document.getElementById("gameTable"); //碁盤を読み込む
    table.innerHTML = ""; //碁盤を一旦空に
    for(var row = 0; row < tableData.length; row++) {
        const newRow = document.createElement("tr"); //行を作る
        for(var col = 0; col < tableData[0].length; col++) {
            const newCell = document.createElement("td"); //マス目をつくる
            const img = new Image();
           //if(tableData[row][col] == "o") img.src = "white.png";
            //if(tableData[row][col] == "x") img.src = "black.png";
            const cellText = document.createTextNode(
                 tableData[row][col]
             );
            newCell.appendChild(cellText); //画像を設定
            newCell.onclick = () => cellClicked(newCell); //クリックリスナーを設定
            newRow.appendChild(newCell); //行にマス目を入れる
        }
        table.appendChild(newRow); //テーブルに行を入れる
    }
}

//0以上max未満のランダムな整数を返す
const randRange = (max) => Math.floor(Math.random() * max);

//碁盤の目をクリックしたときに呼ばれる
const cellClicked = (cell) => {
    //クリックされた位置を特定
    const row = cell.parentNode.rowIndex;
    const col = cell.cellIndex;
    console.log(`${row},${col}`);
    if(tableData[row][col] != "-") { //すでに何かが存在したらクリックを無視する
        return;
    }
    tableData[row][col] = nextPlayerIsO ? "o" : "x"; //手番によって打つコマを変える
    nextPlayerIsO = !nextPlayerIsO; //手番を交代
    updateTable(); //テーブルを更新
    if(checkWin(row,col)) { //勝敗が決定したら終了と表示
        const playerView = document.getElementById("playerView");
        playerView.innerHTML = "終了";
    }
    else { //勝敗が決定しなければ次のプレイヤーを表示
        updatePlayer();
    }
};

//nextPlayerIs0を元に画面を更新する
const updatePlayer = () => {
    const playerView = document.getElementById("playerView");
    if(nextPlayerIsO) {
        playerView.innerHTML = "次はOの手番です";
    }
    else {
        playerView.innerHTML = "次はXの手番です";
    }
}

//勝敗を判定する
//引数は更新のあったマス目の位置
const checkWin = (row,col) => {
    return checkLineWin(row - 4,col,1,0,9)
    || checkLineWin(row,col-4,0,1,9)
    || checkLineWin(row-4,col-4,1,1,9)
    || checkLineWin(row+4,col-4,-1,1,9);
}

//一つの直線について5個並んでいるかどうかを判定する
const checkLineWin = (startRow,startCol,moveX,moveY,len) => {
    var x = startRow;
    var y = startCol;
    var data = 0;
    for(var i = 0; i < len; i++) {
        if(x < 0 || x >= tableData.length
            || y < 0 || y >= tableData[0].length) {
            x += moveX;
            y += moveY;
            continue;
        }
        var cell = tableData[x][y];
        if(cell == "-") {
            x += moveX;
            y += moveY;
            data = 0;
            continue;
        }
        if(cell == "o") {
            if(data >= 0) {
                data++;
                x += moveX;
                y += moveY;
                if(data >= 5) return true;
            }
            else {
                data = 1;
                x += moveX;
                y += moveY;
                continue;
            }
        }
        if(cell == "x") {
            if(data <= 0) {
                data--;
                x += moveX;
                y += moveY;
                if(data <= -5) return true;
            }
            else {
                data = -1;
                x += moveX;
                y += moveY;
                continue;
            }
        }
    }
    return false;
}
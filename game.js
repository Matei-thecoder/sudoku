//to do
//mke it save the progress





//initial value
const start_screen = document.querySelector('#start-screen');
const instruction_screen = document.querySelector('#instruction-screen');
const cells = document.querySelectorAll('.main-grid-cell');
const game_screen = document.querySelector('#game-screen');
const pause_screen = document.querySelector('#pause-screen');
const game_time = document.querySelector('#game-time');
const number_inputs = document.querySelectorAll('.number');
const result_screen = document.querySelector('#result-screen');
const result_time = document.querySelector('#result-time')

let timer=null;
let pause = false;
var timerVariable;// = setInterval(countUpTimer, 1000);
var seconds = 0;
let su = undefined;
let su_answer = undefined;
let savedGameInfo = false;
let selected_cell = -1;
const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

let level_index = 0;
let level = CONSTANT.LEVEL[level_index];

//end initial value;
//add space for each 9 cells;
const initGameGrid = ()=>{
    let index=0;
    for(let i=0; i<Math.pow(CONSTANT.GRID_SIZE,2);i++)
    {
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i%CONSTANT.GRID_SIZE;
        if(row ===2  || row === 5) cells[index].style.marginBottom = "10px";
        if(col ===2 || col ===5 ) cells[index].style.marginRight = "10px";
        index++;
    }
}
function countUpTimer(){
    
  seconds++;
  var hour = Math.floor(seconds / 3600);
  var minute = Math.floor((seconds - hour * 3600) / 60);
  var tseconds = seconds - (hour * 3600 + minute * 60);
  document.getElementById("game-time").innerHTML = hour + ":" + minute + ":" + tseconds;
}
const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);
/*function pausef()
{
    if(!pause)
    {
        pause=true;
        clearInterval(timerVariable);
        let pause_button=document.getElementById('p-b');
        pause_button.innerHTML='l>'
    }
    else
    {
        pause=false;
        //timerVariable = setInterval(countUpTimer, 1000);
        let pause_button=document.getElementById('p-b');
        pause_button.innerHTML='II';
    }
}*/
// end add space for each 9 cells;
const returnStartScreen = () =>{
    clearInterval(timerVariable);
    let pause_button=document.getElementById('p-b');
    pause_button.innerHTML='II';
    pause = false;
    seconds = 0;
    //window.location.href = "index.html";
    game_screen.classList.remove('active');
    start_screen.classList.add('active');
}
const clearSudoku = () =>{
    for(let i =0;i<Math.pow(CONSTANT.GRID_SIZE,2); i++)
    {
        cells[i].innerHTML =" ";
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}
const initSudoku = ()=>{
    //clear old sudoku

    clearSudoku();
    resetBg();

    //generate sudoku here
    su = sudokuGen(level);
    su_answer =[...su.question];
    
    console.table(su_answer);
    saveGameInfo();
    //show sudoku to div
    for(let i =0;i<Math.pow(CONSTANT.GRID_SIZE,2); i++)
    {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        cells[i].setAttribute('data-value', su.question[row][col]);

        if(su.question[row][col] !== 0)
        {
            cells[i].classList.add('filled');
            cells[i].innerHTML = su.question[row][col];
        }

    }
    //1h 31 minute

}

const hoverBg = (index) =>{
    let row = Math.floor(index/CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row%3;
    let box_start_col = col - col%3;

    for (let i = 0;i<CONSTANT.BOX_SIZE; i++)
    {
        for(let j=0; j<CONSTANT.BOX_SIZE;j++)
        {
            let cell = cells[9 * (box_start_row +i) + (box_start_col +j)];
            cell.classList.add('hover');
        }
    }
     let step =9;
     while(index - step >=0)
    {
        cells[index -step].classList.add('hover');
        step +=9;
    }
    step =9;
    while(index + step<81)
    {
        cells[index +step].classList.add('hover');
        step +=9;
    }
    step = 1;
    while (index - step >= 9*row) {
        cells[index - step].classList.add('hover');
        step += 1;
    }

    step = 1;
     while (index + step < 9*row + 9) {
        cells[index + step].classList.add('hover');
        step += 1;
    }
    

}
const resetBg = () =>{
    cells.forEach(e => e.classList.remove('hover'));
}
const checkErr = (value) => {
    let ok=false;
    const addErr = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err');
            cell.classList.add('cell-err');
            ok=true;
            setTimeout(() => {
                cell.classList.remove('cell-err');
                cell.classList.remove('err');
            }, 1000);
        }
    }

    let index = selected_cell;

    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            if (!cell.classList.contains('selected')) addErr(cell);

        }
    }

    let step = 9;
    while (index - step >= 0) {
        addErr(cells[index - step]);
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        addErr(cells[index + step]);
        step += 9;
    }

    step = 1;
    while (index - step >= 9*row) {
        addErr(cells[index - step]);
        step += 1;
    }

    step = 1;
    while (index + step < 9*row + 9) {
        addErr(cells[index + step]);
        step += 1;
    }
    if(ok)
    {
        setTimeout(() => {
            cells[selected_cell].innerHTML = "";
        }, 0);  
    }
    
}


const removeErr = () => cells.forEach(e => e.classList.remove('err'));


const saveGameInfo = () =>{
    let game  ={
        level:level_index,
        seconds:seconds,
        su:{
            original: su.original,
            question: su.question,
            answer: su_answer
        }
        

    }
    localStorage.setItem('game',JSON.stringify(game));
    savedGameInfo=true;
}

const removeGameInfo = () =>{

    localStorage.removeItem('game');
    document.querySelector('#btn-continue').style.display = 'none';

}
const loadSudoku = () => {
    let game = getGameInfo();

    //game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index];

    su = game.su;

    su_answer = su.answer;

    seconds = game.seconds;
    //game_time.innerHTML = showTime(seconds);

    level_index = game.level;

    // show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        
        cells[i].setAttribute('data-value', su_answer[row][col]);
        cells[i].innerHTML = su_answer[row][col] !== 0 ? su_answer[row][col] : '';
        if (su.question[row][col] !== 0) {
            cells[i].classList.add('filled');
        }
    }
}
const isGameWin = () =>sudokuCheck(su_answer);

const showResult = () =>{
    clearInterval(timer);
    game_screen.classList.remove('active');
    result_screen.classList.add('active');
    result_time.innerHTML = showTime(seconds);

}

const initNumberInputEvent = ()=>{
    number_inputs.forEach((e, index) =>{
        e.addEventListener('click', ()=>{
            if(!cells[selected_cell].classList.contains('filled')){
                cells[selected_cell].innerHTML = index + 1;
                cells[selected_cell].setAttribute('data-value' , index +1);
                //add to answer

                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE)
                let col = selected_cell % CONSTANT.GRID_SIZE;
                su_answer[row][col] = index +1;
                //save game
                saveGameInfo();
                removeErr();
                checkErr(index + 1);
                
                cells[selected_cell].classList.add('zoom-in');
                setTimeout(() =>{
                    cells[selected_cell].classList.remove('zoom-in');
                },500);

                //check game win
                if(isGameWin()){
                    removeGameInfo();
                    showResult();
                }
                // ------

            }
        })
    })
}
//1h 44min
const initCellsEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!e.classList.contains('filled')) {
                cells.forEach(e => e.classList.remove('selected'));

                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                resetBg();
                hoverBg(index);
            }
        })
    })
}
//1h 40 min
document.querySelector('#btn-level-game').addEventListener('click',()=>{
    if(level_index == 5)
    {
        level_index = 0;
        document.querySelector('#btn-level-game').innerHTML = CONSTANT.LEVEL_NAME[level_index];
        level = CONSTANT.LEVEL[level_index];
    }
    else
    {
        level_index++;
        document.getElementById('btn-level-game').innerHTML = CONSTANT.LEVEL_NAME[level_index];
        level = CONSTANT.LEVEL[level_index];
    }
})
document.querySelector('#btn-pause').addEventListener('click',()=>{
    pause_screen.classList.add('active');
    game_screen.classList.remove('active');
    document.querySelector('.header').classList.add('normal');
    pause =true;
})
document.querySelector('#btn-resume').addEventListener('click',()=>{
    pause_screen.classList.remove('active');
    game_screen.classList.add('active');
    document.querySelector('.header').classList.remove('normal');
    pause =false;
    //timerVariable = setInterval(countUpTimer,1000);
    let pause_button=document.getElementById('p-b');
    pause_button.innerHTML='II';


})
document.querySelector('#btn-continue').addEventListener('click', () => {
    
        loadSudoku();
        startGame();
        if(instruction_screen.classList.contains('active'))
        instruction_screen.classList.remove('active');
    if(pause_screen.classList.contains('active'))
        pause_screen.classList.remove('active');
    if(result_screen.classList.contains('active'))
        result_screen.classList.remove('active');
    start_screen.classList.remove('active');
    game_screen.classList.add('active');
    document.querySelector('.header').classList.remove('normal');
    document.querySelector('.contacts').classList.remove('active');
    savedGameInfo = false;
    
});
document.querySelector('#btn-new-game').addEventListener('click',()=>{
    //clearInterval(timerVariable);
    if(instruction_screen.classList.contains('active'))
        instruction_screen.classList.remove('active');
    if(pause_screen.classList.contains('active'))
        pause_screen.classList.remove('active');
    if(result_screen.classList.contains('active'))
        result_screen.classList.remove('active');
    document.querySelector('.header').classList.add('normal');
    document.querySelector('.contacts').classList.add('active');
    savedGameInfo=false;
    returnStartScreen();
})
document.querySelector('#btn-new-game-2').addEventListener('click',()=>{
    if(instruction_screen.classList.contains('active'))
        instruction_screen.classList.remove('active');
    if(pause_screen.classList.contains('active'))
        pause_screen.classList.remove('active');
        if(result_screen.classList.contains('active'))
        result_screen.classList.remove('active');
    document.querySelector('.header').classList.add('normal');
    document.querySelector('.contacts').classList.add('active');
    returnStartScreen();
})
document.querySelector('#btn-delete').addEventListener('click',()=>{
    cells[selected_cell].innerHTML ='';
    cells[selected_cell].setAttribute('data-value',0);
    let row = Math.floor(selected_cell/CONSTANT.GRID_SIZE);
    let col = selected_cell % CONSTANT.GRID_SIZE;
    su_answer[row][col] = 0;
    removeErr();
})
document.querySelector('.btn.new-game').addEventListener('click', ()=>{
    start_screen.classList.remove('active');
    if(instruction_screen.classList.contains('active'))
        instruction_screen.classList.remove('active');
    if(pause_screen.classList.contains('active'))
        pause_screen.classList.remove('active');
    game_screen.classList.add('active');
    if(result_screen.classList.contains('active'))
        result_screen.classList.remove('active');
    //removeGameInfo();
    document.querySelector('.header').classList.remove('normal');
    document.querySelector('.contacts').classList.remove('active');
    savedGameInfo=false;
    startGame();
})
document.querySelector('#instruction-show').addEventListener('click', ()=>{
    start_screen.classList.remove('active');
    if(instruction_screen.classList.contains('active'))
        instruction_screen.classList.remove('active');
    if(pause_screen.classList.contains('active'))
        pause_screen.classList.remove('active');
    instruction_screen.classList.add('active');
    if(result_screen.classList.contains('active'))
        result_screen.classList.remove('active');
     document.querySelector('.header').classList.remove('normal');
    ///eroare apare in game screen meniul intrcutiou] de rezolvat
})
document.querySelector('#btn-go-back').addEventListener('click',()=>{
    start_screen.classList.add('active');
    instruction_screen.classList.remove('active');
    if(instruction_screen.classList.contains('active'))
        instruction_screen.classList.remove('active');
    if(pause_screen.classList.contains('active'))
        pause_screen.classList.remove('active');
    if(result_screen.classList.contains('active'))
        result_screen.classList.remove('active');
    document.querySelector('.header').classList.add('normal');
    document.querySelector('.contacts').classList.add('active');
})
document.querySelector('#btn-return-game-screen').addEventListener('click',()=>{
    if(instruction_screen.classList.contains('active'))
        instruction_screen.classList.remove('active');
    if(pause_screen.classList.contains('active'))
        pause_screen.classList.remove('active');
    if(result_screen.classList.contains('active'))
        result_screen.classList.remove('active');
    game_screen.classList.remove('active');
    start_screen.classList.add('active');
    document.querySelector('#btn-continue').classList.remove('inactive');
    document.querySelector('.header').classList.add('normal');
    document.querySelector('.contacts').classList.add('active');
        saveGameInfo();
        savedGameInfo = true;
})
const startGame =()=>{
    seconds = 0;
    
    if(savedGameInfo)
    {
        loadSudoku();
        document.querySelector('#btn-continue').classList.remove('inactive');
    }
    else
    {
        timerVariable = setInterval(countUpTimer, 1000);
        document.querySelector('#btn-continue').classList.add('inactive');
        initSudoku();
    }
    
    
    initGameGrid();
    
    
    //countUpTimer()
}
const init = ()=>{
    
    if(savedGameInfo)
    {
        
        document.querySelector('#btn-continue').classList.remove('inactive');
    }
    initCellsEvent();
    initNumberInputEvent();

}
init();
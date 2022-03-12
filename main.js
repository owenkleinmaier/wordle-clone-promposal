document.addEventListener("DOMContentLoaded", () => {

    createSquares();

    let guessedWords = [[]]
    let availableSpace = 1;

    let word = "prom";
    let guessedWordCount = 0;
    let confe = document.querySelector("my-canvas");




    const keys = document.querySelectorAll(".keyboard-row button");

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1));

        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;


    
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 4) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;

        }
    }

    function getTileColor(letter, index){
        const isCorrectLetter = word.includes(letter);

        if (!isCorrectLetter){
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if(isCorrectPosition) {
            return "rgb(83, 141,78)";
        }

        return "rgb(181, 159, 59)";
    }


    function handleSubmitWord(){
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !==4){
            window.alert("Word must be 4 letters");
        }

        const currentWord = currentWordArr.join("");

    fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
		    "x-rapidapi-key": "1169069f7dmshdba5163081e6ca1p1cd3a2jsn0b228367f3cb"
	    }
    }
  ).then(function (res) {
          if (!res.ok) {
              throw Error();
          }
          
          firstLetterId = guessedWordCount * 4 + 1;
          const interval = 200;
          currentWordArr.forEach((letter, index) => {
              setTimeout(() => {
                  const tileColor = getTileColor(letter, index);
  
                  const letterId = firstLetterId + index;
                  const letterEl = document.getElementById(letterId);
                  letterEl.classList.add("animate__flipInX");
                  letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
              }, interval * index);
          });
  
          guessedWordCount += 1;
  
  
          if (currentWord === word){
            window.confirm("Word you go to prom with me?💃🕺");
            confe.classList.add("active");    
          }
  
          if(guessedWords.length === 6){
              window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
          }
  
  
          guessedWords.push([]);

      }).catch(() => {
          
      });

    }



    function createSquares(){
        const gameBoard = document.getElementById("board")

        for (let index = 0; index < 24; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
            
        }
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick =  ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === 'enter') {
                handleSubmitWord();
                return;
            }

            if(letter === "del"){
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
            document.addEventListener('keydown', logKey);
        };

    function logKey(e) {
        let alpha = e.code;
        console.log(alpha);
    
        if (alpha === 'Enter') {
            handleSubmitWord()
            return;
        }
        if(alpha === 'Backspace') {
            handleDeleteLetter();
            return;
        }
        else {
            let part = alpha.slice(3,);
            updateGuessedWords(part);
        }
    };

    }

});
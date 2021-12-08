import React, { useState } from "react";

const PlayNumber = props => (
<button className='number'
 style={{backgroundColor: colors[props.status]}}
 onClick={() => props.onClick(props.number, props.status)}
 >{props.number}</button>
);

const Star = props => (
<div key={props.starId} className="star"/>
);

const StarsDisplay = props => (
<>
{utils.range(1,props.count).map(starId =>
    <Star key={starId}/>)
 }
</>
);

const PlayAgain = props => (
  <div className='game-done'> 
    <div className='message'
          style={{ color: props.gameStatus === 'lost' ? 'red' : 'green'}}>
      {props.gameStatus === 'lost' ? 'Game Over' : 'Game Won'}
    </div>
     <button className='play-again'
     onClick={props.onClick}>Play Again</button>
  </div>
);  



const StarMatch = () => {
    const [stars, setStars] = useState(utils.random(1,9));
    const [availableNums, setAvailableNums] = useState(utils.range(1,9));
    const [candidateNums, setCandidateNums] = useState([]);
    const [secondsLeft, setSecondsLeft] = useState(10);

    React.useEffect(() => {
      const timerId = setTimeout(() => {
        if(secondsLeft > 0){
          setSecondsLeft(secondsLeft - 1);
        }
        else{

        }
      }, 1000 );
      return () => clearTimeout(timerId);
    });

    const candidatesAreWrong = utils.sum(candidateNums) > stars; 
    
    // const gameIsWon = availableNums.length === 0 ;
    // const gameIsLost = secondsLeft === 0; 
    
    const gameStatus = availableNums.length === 0 ? 'won' : 
    secondsLeft === 0 ? 'lost' : 'active';
    
    const numberStatus= (number) => {
        if(!availableNums.includes(number)){
            return 'used';
        }
        if(candidateNums.includes(number)){
           return candidatesAreWrong ? 'wrong' : 'candidate';
        }
        return 'available';
    }
    const onButtonClick = () => {
      setSecondsLeft(10);
      setStars(utils.random(1,9));
      setAvailableNums(utils.range(1,9));
      setCandidateNums([]);
    }

    const onNumberClick = (number, status) => {
       if(status === 'used'){
           return;
       }
       
       const newCandidateNums =
       status === 'available'
       ? candidateNums.concat(number)
       : candidateNums.filter(cn => cn !== number);
       
       if (utils.sum(newCandidateNums) !== stars){
           setCandidateNums(newCandidateNums);
       } else {
           const newAvailableNums = availableNums.filter( z =>
            !newCandidateNums.includes(z)
           );
        setStars(utils.randomSumIn(newAvailableNums,9));
        setAvailableNums(newAvailableNums);
        setCandidateNums([]);
       }
    }

    return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="left">
            { gameStatus !== 'active' ? (<PlayAgain 
             onClick={onButtonClick}
             gameStatus = {gameStatus}/>) :
              (<StarsDisplay count={stars}/>)
            }
          </div>
          <div className="right">
              {utils.range(1,9).map(number => 
              <PlayNumber 
               key={number}
               number={number}
               status={numberStatus(number)} 
               onClick={onNumberClick}/>
               )}
          </div>
        </div>
        <div className="timer">Time Remaining: 
        {secondsLeft}</div>
      </div>
    );
  };

  // Color Theme
const colors = {
    available: 'lightgray',
    used: 'lightgreen',
    wrong: 'lightcoral',
    candidate: 'deepskyblue',
  };
  
  // Math 
  const utils = {
    // Sum an array
    sum: arr => arr.reduce((acc, curr) => acc + curr, 0),
  
    // create an array of numbers between min and max (edges included)
    range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),
                                    //length of array from given input  //increment each element by min + i.. 0,1= 1 1,1=2 2,1=3, 3,1=4, 4,1=5...etc
    // pick a random number between min and max (edges included)
    random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),
  
    // Given an array of numbers and a max...
    // Pick a random sum (< max) from the set of all available sums in arr
    randomSumIn: (arr, max) => {
      const sets = [[]];
      const sums = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0, len = sets.length; j < len; j++) {
          const candidateSet = sets[j].concat(arr[i]);
          const candidateSum = utils.sum(candidateSet);
          if (candidateSum <= max) {
            sets.push(candidateSet);
            sums.push(candidateSum);
          }
        }
      }
      return sums[utils.random(0, sums.length - 1)];
    },
  };

  export default StarMatch;
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */ 
 
var Controller = {};

Controller.init = function(){

  $('#start-page').show();
  $('#game-page').hide();
  $('#game-over-page').hide();
  
  //
  // Setup sounds
  // Use ogg for FF, otherwise MP3
  //
  if (navigator.userAgent.indexOf("Firefox")!=-1){
    Controller.monsterMoveSound = new Audio("sounds/monstermove.ogg");
    Controller.gameOverSound = new Audio("sounds/lose.ogg");
    Controller.chooseAnswerSound = new Audio("sounds/shoot.ogg");  
  } else {
    Controller.monsterMoveSound = new Audio("sounds/monstermove.mp3");
    Controller.gameOverSound = new Audio("sounds/lose.mp3");
    Controller.chooseAnswerSound = new Audio("sounds/shoot.mp3");
  }
}

Controller.newGame = function(){
  Controller.speed = 2000;
  Controller.level = 1;
  Controller.score = 0;
  Controller.start();
}

Controller.start = function(){
  $('#start-page').hide();
  $('#game-page').show();
  $('#game-over-page').hide();
  
  Controller.correctNumber = 0;
  Controller.clearMonsters(); 
  Controller.addMonsters();
  Controller.addControls();
  Controller.startTimer();
}

Controller.end = function(){

  $('#game-over-score').text(Controller.score);

  $('#start-page').hide();
  $('#game-page').hide();
  $('#game-over-page').show();
}

Controller.increaseLevel = function(){
  Controller.level ++;
}

Controller.clearMonsters = function(){
  $('.monster').remove();
}

/**
 * Add the monsters to the screen
 **/
Controller.addMonsters = function(){
  // How many types of monster?
  // Each level we increase the number of groups
  var number_of_groups = Controller.level;
  var groups = new Array(number_of_groups);
  var types = new Array(number_of_groups);
  
  // How many monsters in each group?
  var max_in_group = 5;
  for (var i=0; i < number_of_groups; i++){
     var number_of_monsters = Math.floor(Math.random()* max_in_group)+1;
     groups[i] = number_of_monsters;
     Controller.correctNumber = Controller.correctNumber + number_of_monsters;
     types[i] = Math.floor(Math.random() * 9) + 1;
  }
  
  // Draw each row..
  var row_type = "even";
  for (var i=0; i < number_of_groups; i++){
     var y = i * 40;
     for (var m=0; m < groups[i]; m++){
         var monster_type = "monster monster-"+row_type+" monster-"+types[i];
         var monster_div = $("<div>").addClass(monster_type);
         monster_div.css('left', m*90+10);
         monster_div.css('top', i*80);
         $('#game-canvas').append(monster_div);
     }
    if (row_type==="even"){
         row_type="odd";
    } else {
         row_type="even";
    }
  }
}

/**
 * Add the controls for providing an answer
 **/
Controller.addControls = function(){

  //
  // clear old buttons
  //
  $('.answer-button').remove();
  
  //
  // Set up answers array
  //
  var range = Controller.correctNumber;
  if (range < 5) range = 5;
  var answers = new Array();
  for (var i=0;i<5;i++){ 
    answers[i] = Controller.correctNumber + (Math.floor((Math.random()*range)-range/2));
    if (answers[i] < 1) answers[i] = 1;
  }
     
  //
  // If we don't have a correct answer, add it
  //
  var containsCorrectAnswer = false;
  for (var i=0;i<5;i++){ 
    if (answers[i] === Controller.correctNumber) containsCorrectAnswer = true;
  }  
  if (!containsCorrectAnswer){
    answers[Math.floor(Math.random()*5)] = Controller.correctNumber; 
  }

  //
  // New buttons
  //
  for (var i=0;i<5;i++){
    var answer_button = $("<button>").addClass("answer-button");
    answer_button.text(answers[i]);
    $('#game-controls').append(answer_button);
    answer_button.click(Controller.answer);
  }

}

Controller.startTimer = function(){
  window.clearInterval(Controller.timer);
  Controller.moveMonstersRight = false;
  Controller.timer = window.setInterval(Controller.moveMonstersDown,Controller.speed);
}

Controller.moveMonstersDown = function(){
  if (Controller.moveMonstersRight){
    $('.monster-even').animate({"top": "+=20px", "left":"-=5px"}, "slow");
    $('.monster-odd').animate({"top": "+=20px", "left":"+=5px"}, "slow");
    Controller.moveMonstersRight = false;
  } else {
    $('.monster-even').animate({"top": "+=20px", "left":"+=5px"}, "slow");
    $('.monster-odd').animate({"top": "+=20px", "left":"-=5px"}, "slow");
    Controller.moveMonstersRight = true;
  }
  Controller.monsterMoveSound.play();
  Controller.checkForEndGame();
}

Controller.checkForEndGame = function(){
  var max = 400 - (Controller.level * 80)
  var top = $('.monster').offset().top;
  if (top >= max){
      Controller.gameOver();
  }
}

Controller.answer = function(e){
  //
  // Stop the clock
  //
  window.clearInterval(Controller.timer);
  
  //
  // Get the answer
  //
  var answer = e.target.innerHTML;
  
  if (answer == Controller.correctNumber){
   //
   // Update the button
   //
   $(e.target).addClass("pressed-correct");
   
   //
   // Update scores
   //
   Controller.score += parseInt(answer);
   
   //
   // Level up?
   //
   if (Controller.score > 10 && Controller.level === 1) Controller.level = 2;
   if (Controller.score > 30 && Controller.level === 2) Controller.level = 3;
   if (Controller.score > 50 && Controller.level === 3) Controller.level = 4;
   if (Controller.score > 75)  Controller.speed = 1500;
   if (Controller.score > 120) Controller.speed = 1000;
   if (Controller.score > 120) Controller.speed = 500;
      
   // 
   // Splat the monsters
   //
   Controller.chooseAnswerSound.play();
   $('.monster').fadeOut(2000,Controller.start);
   
  } else {
   //
   // Update the button
   //
   $(e.target).addClass("pressed-incorrect");
   Controller.gameOver();
  }
}

Controller.gameOver = function(){
  Controller.gameOverSound.play();
  window.clearInterval(Controller.timer);
  $('.monster').fadeOut(2000,Controller.end);
}

"use strict";
import { gamesStatus } from './api.config.js'

//fill the grid with 90 cells
function createGrid() {
  const gridContainer = document.querySelector(".grid-container");

  for (let i = 1; i <= 90; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell", "md:text-xl", "lg:text-3xl", "text-sm");
    cell.innerHTML = i;
    gridContainer.appendChild(cell);
  }
}
createGrid()

//initiallizing the state
let state = {
  live: false,
  drawnNumsArray: '',
  gameID: '',
  lastPlayedNum: '',
  lastPlayedWinner: '',
  startTime: '',
  winnersList: '',
};
//convert incoming win type codes 
let winTypes = {
  TR: 'Top Row',
  MR: 'Middle Row',
  BR: 'Bottom Row',
  Q5: 'Quick Five',
  CO: 'Corners',
  SR: 'Star',
  HF: 'House Full',
  SHF: 'Second House Full',
}

function markTickets() {
  const ticketCells = document.querySelectorAll('.ticket-cell')
  ticketCells.forEach(ticket => {
    if (state['drawnNumsArray'].includes(Number.parseInt(ticket.innerHTML)))
      ticket.classList.add('marked-cell',
        'animate__animated', 'animate__bounceIn')
  })
}

//remove mark cell when game starts
function unMarkStrikes() {
  const cells = document.querySelectorAll('.cell')
  if (cells) {
    cells.forEach(cell => {

      cell.classList.remove('marked-cell',
        'animate__animated', 'animate__bounceIn')
    })
  }
}
//mark cell when new number drawn
function markStrikes() {
  const cells = document.querySelectorAll('.cell')
  state.drawnNumsArray.forEach((i) => {
    //console.log(cells[i-1])
    cells[i - 1].classList.add('marked-cell',
      'animate__animated', 'animate__bounceIn')
  })
}

//speak function utility
function speak(text) {
  console.log('speaking = ' + text)
  var msg = new SpeechSynthesisUtterance(text);
  msg.volume = .5;
  msg.rate = 5;
  window.speechSynthesis.speak(msg);
}
function removeOldTickets(className) {
  const ticketContainers = document.querySelectorAll(className)
  if (ticketContainers) {
    ticketContainers.forEach(container => {
      container.remove()
    })
  }
}
function createAndAppendWinnerTicket(ticket, type) {

  var ticketString = ticket.ticket
  var ticketArray = JSON.parse(ticketString)
  const ticketsContainer = document.getElementById('winner-' + type)

  const ticketbody = document.createElement('div')
  const cellContainer = document.createElement('div')

  const ticketHeader = document.createElement('div')
  const ticketFooter = document.createElement('div')
  ticketFooter.innerHTML = 'Booked By ' + ticket.customer_name
  ticketFooter.classList.add('ticket-footer', 'text-bold', 'text-white')

  ticketHeader.innerText = 'Ticket #' + ticket.ticket_id
  ticketHeader.classList.add('ticket-header', 'text-xl', 'text-white')

  // appending ticket id 
  ticketbody.appendChild(ticketHeader)

  ticketbody.classList.add('ticket-container')
  // ticketbody.setAttribute('data-aos', "fade-up")
  cellContainer.classList.add('grid-container')

  //looping through rows and cols to append cells
  ticketArray.forEach(ele1 => {
    ele1.forEach(ele2 => {
      const cell = document.createElement('div')
      cell.classList.add('cell', 'ticket-cell', 'md:text-xl', 'lg:text-3xl', 'text-sm')
      if (ele2 == null)
        cell.innerHTML = "&nbsp;"

      else
        cell.innerHTML = ele2

      cellContainer.appendChild(cell)
    })
  })

  ticketbody.appendChild(cellContainer)
  ticketbody.appendChild(ticketFooter)
  ticketsContainer.appendChild(ticketbody)
}
function refresh() {
  axios.get(gamesStatus)
    .then(res => {
      //console.log(res.data)
      //console.log(state.winnersList)
      // console.log(state.winnersList.length, res.data.winner_game.length)

      //return if game is not live
      // if (!res.data.game_is_live) return
      //check if live then speak
      if (state.live != res.data.game_is_live) {
        if (res.data.game_is_live == true) {
          speak('The game is live now!')
        }
        else
          speak('The game has ended, Thanks for playing!')
        state.live = false
      }
      //if(!res.data.game_is_live) return

      if (state.winnersList.length) {

      }

      //check for new drawn number and speak
      if (state.drawnNumsArray.length != JSON.parse(res.data.drawn_numbers_list).length) {
        let numbersJson = JSON.parse(res.data.drawn_numbers_list)
        let lastNumber = numbersJson[numbersJson.length - 1]
        // console.log(res.data.last_played_num, lastNumber)
        const speakText = `${res.data.last_played_num}, ${lastNumber}`
        //const speakText = `${lastNumber}`
        speak(speakText)
      }

      //check for new winner and speak
      if (state.winnersList.length != res.data.winner_game.length) {
        const newWinner = res.data.winner_game[res.data.winner_game.length - 1]
        //append the winners to their divs

        //append all when no winners in state ie page refreshed
        if(state.winnersList.length == 0){
          res.data.winner_game.forEach(winner => {
            createAndAppendWinnerTicket(winner.ticket, winner.win_type)
          })
        }
        //append new winner when winner list not empty
        else{
          console.log(newWinner)
          createAndAppendWinnerTicket(newWinner.ticket, newWinner.win_type)
        }
        speak(`we have new claim ${winTypes[newWinner.win_type]} on ${newWinner.ticket.customer_name}
        ticket number ${newWinner.ticket.ticket_id}`)
      }

      //updating the local state
      {
        state.live = res.data.game_is_live
        state.drawnNumsArray = JSON.parse(res.data.drawn_numbers_list)
        state.gameID = res.data.game_id
        state.lastPlayedNum = res.data.last_played_num
        state.lastPlayedWinner = res.data.last_played_winner
        state.startTime = res.data.start_time
        state.winnersList = res.data.winner_game
      }
    })
    .then(() => {
      markStrikes()
      markTickets()
    })
}

refresh()

setInterval(() => {
  refresh()
}, 1000);


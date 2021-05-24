'use strict'
import { getTicket } from './api.config.js'


const ticketInput = document.getElementById('ticket-input')
const clearBtn = document.getElementById('clear-ticket-button')
const viewBtn = document.getElementById('view-ticket-button')

function removeElements(elementToRemove) {
  const elements = document.querySelectorAll(elementToRemove)
  console.log(elements)
  if (elements) {
    elements.forEach(element => {
      element.remove()
    });
  }
}

function createAndAppendTicket(ticket) {

  var ticketString = ticket.ticket
  var ticketArray = JSON.parse(ticketString)

  const ticketsContainer = document.getElementById('search-tickets-container')

  const ticketbody = document.createElement('div')
  const cellContainer = document.createElement('div')

  const ticketHeader = document.createElement('div')
  const ticketID = document.createElement('div')
  const ticketCustomerName = document.createElement('div')
  ticketCustomerName.innerHTML = 'Booked By ' + ticket.customer_name
  ticketCustomerName.classList.add('ticket-footer', 'text-bold', 'text-white')

  ticketID.innerText = 'Ticket #' + ticket.ticket_id
  ticketID.classList.add('ticket-header', 'text-xl', 'text-white')

  ticketHeader.appendChild(ticketID)
  ticketHeader.appendChild(ticketCustomerName)
  ticketHeader.classList.add('flex', 'flex-row', 'justify-between')
  // appending id and name to header
  ticketbody.appendChild(ticketHeader)

  ticketbody.classList.add('player-ticket-container', 'ticket-container')
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
  
  ticketbody.appendChild(ticketHeader);
  ticketbody.appendChild(cellContainer)
  ticketsContainer.appendChild(ticketbody)
}


viewBtn.addEventListener('click', () => {
  removeElements('.player-ticket-container')
  axios.get(`${getTicket}?game_id=1&ticket_id=${ticketInput.value}`)
    .then((res) => {
      const customerName = res.data[0].customer_name
      console.log(res.data)
      axios.get(`${getTicket}?game_id=1&ticket_id=&customer_name=${customerName}`)
        .then((res2) => {
          console.log(res2.data)
          res2.data.forEach(ele => {
            createAndAppendTicket(ele)
          })
        })
    })
})


clearBtn.addEventListener('click', () => {
  removeElements('.player-ticket-container')
})
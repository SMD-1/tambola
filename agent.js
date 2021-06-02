'use strict'

import { getAllTickets } from './api.config.js'


if (!localStorage.getItem('user'))
    window.location = 'agent-login.html'

var currentUser = JSON.parse(localStorage.getItem('user'))
// console.log(currentUser)
document.getElementById('greet-user').innerHTML = `${currentUser.user_name}!`

setTimeout(() => {
    document.querySelector('.progress-bar-container').remove()
}, 500)


const cellContainer = document.getElementById('cell-container')
let ticketsData = {}
refreshList()

function refreshList() {
    axios.get(getAllTickets)
        .then((res) => {
            res.data.forEach(ticket => {
                ticketsData = res.data
                createAndAppendCell(ticket)
            });
        })
}

getOwnBookedTickets()
function getOwnBookedTickets() {
    const soldTicketsContainer = document.getElementById('sold-tickets')
    const collectionAmount = document.getElementById('total-collection')
    const earningAmount = document.getElementById('total-earning')

    axios.get(`${getAllTickets}?booked_by=${currentUser.user_id}`, {
        'Authorization':
            `Token ${currentUser.token}`,
    })
        .then(res => {
            // console.log(res.data)
            res.data.forEach(ticket => {
                const cell = document.createElement('div')
                // cell.classList.add('text-white', 'font-semibold',
                //     'rounded-lg', 'shadow-md')
                cell.innerHTML = `<div
                class="
                  bg-green-300
                  flex
                  text-gray-700
                  rounded-md
                  px-2
                  py-2
                  my-sm
                "
              >
                <span class="text-gray-500">#${ticket.ticket_id}</span>
                <div class="flex-grow font-medium px-2">${ticket.customer_name}</div>
                <div class="text-sm font-normal text-gray-500 tracking-wide">
                  ${ticket.customer_phone}
                </div>
              </div>`
                soldTicketsContainer.appendChild(cell)
            })
            collectionAmount.innerHTML = 'Rs. ' + res.data.length * 100
            earningAmount.innerHTML = 'Rs. ' + res.data.length * 30

        })
}

let selectedTickets = []
function selectTicket(index) {
    // return if already booked
    if (isBooked(index - 1)) return


    //if selected already present
    if (selectedTickets.includes(index)) {
        selectedTickets.splice(selectedTickets.indexOf(index), 1)
        document.querySelector('#cell-' + index).classList.add('bg-green-500')
        document.querySelector('#cell-' + index).classList.remove('bg-blue-500')
    }
    else {
        document.querySelector('#cell-' + index).classList.remove('bg-green-500')
        document.querySelector('#cell-' + index).classList.add('bg-blue-500')
        selectedTickets.push(index)
    }
    //show sale button
    if (selectedTickets.length) {
        document.getElementById('sale-btn').classList.remove('hidden', 'animate__zoomOutRight')
        document.getElementById('sale-btn').classList.add('animate__zoomInRight')
        document.getElementById('sale-btn').innerHTML = `sale (${selectedTickets.length})`
    }
    else {
        document.getElementById('sale-btn').classList.add('animate__zoomOutRight')
        document.getElementById('sale-btn').innerHTML = `sale (${selectedTickets.length})`

    }

    console.log(selectedTickets)

    //update selected tickets list
    updateTicketList()
}
function createAndAppendCell(ticket) {
    const cell = document.createElement('button')
    cell.innerHTML = ticket.ticket_id
    cell.setAttribute('id', 'cell-' + ticket.ticket_id)
    cell.addEventListener('click', () => { selectTicket(ticket.ticket_id) })
    cell.classList.add('text-white', 'p-1', 'font-semibold',
        'rounded-lg', 'shadow-md', 'focus:outline-none',
        'transition', 'duration-300', 'ease-in-out')

    if (ticket.customer_name !== 'Not Booked') {
        cell.classList.add('bg-red-300')
    }
    else {
        cell.classList.add('bg-green-500')
    }

    cellContainer.appendChild(cell)
}

function isBooked(index) {
    return ticketsData[index].customer_name === 'Not Booked' ? false : true
}

function updateTicketList() {
    const listContainer = document.getElementById('selected-list')

    if (!listContainer) return
    //remove all previous elements
    const selectedTicketsCells = document.querySelectorAll('.selected-ticket-cell')
    if (selectedTicketsCells) {
        selectedTicketsCells.forEach(cell => {
            cell.remove()
        })
    }

    selectedTickets.forEach(num => {
        const el = document.createElement('div')
        el.classList.add('bg-green-500', 'rounded-full', 'h-9', 'w-9',
            'text-center', 'text-white', 'font-semibold', 'selected-ticket-cell')
        el.innerHTML = num
        // el.addEventListener('click',()=>{
        //     removeTicket(el.innerHTML)
        // })
        listContainer.appendChild(el)
    })

    //update final price
    document.getElementById('final-price').innerHTML = `Rs. ${selectedTickets.length * 100}`
}

document.getElementById('submit-btn').addEventListener('click',
    (e) => {
        e.preventDefault()
        submitFunction()
    })

function submitFunction() {
    //get input values
    let customerName = document.getElementById('customer-name').value
    let customerPhone = document.getElementById('customer-phone').value

    console.log('name ' + customerName + "\nphone " + customerPhone)
    if (customerName == '' || customerPhone.length < 10) {
        alert('Please enter correct values in both fields!')
        return
    }

    let payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
    }
    selectedTickets.forEach(num => {
        //reducing ticketid by 1 for obvious reasons
        let ticketID = ticketsData[num - 1].id
        console.log('Booked ticket ' + num)
        console.log(ticketID)
        var config = {
            method: 'patch',
            url: `${getAllTickets}${ticketID}/`,
            headers: {
                'Authorization': `Token ${currentUser.token}`,
                'Content-Type': 'application/json',
            },
            data: payload
        };
        axios(config)
            .then(() => {
                location.reload()
            })
    })
}

document.getElementById('logout-btn').addEventListener('click', ()=>{
    logout()
})
function logout(){
    localStorage.setItem('user','')
    window.location = 'agent-login.html'
}






// function removeTicket(ticketNum){
//     console.log(selectedTickets)
//     console.log('removing ' + ticketNum + ' at ' + selectedTickets.indexOf(Number.parseInt(ticketNum)))
//     if(selectedTickets.indexOf(Number.parseInt(ticketNum))>=0){
//         selectedTickets.splice(selectedTickets.indexOf(Number.parseInt(ticketNum),1))
//     }
//     updateTicketList()
// }
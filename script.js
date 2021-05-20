'use strict'

axios.get('https://housie.plasmatch.in/api/tickets/')
    .then(res => {
        const loadingGIF = document.querySelector('.loading-gif')
        loadingGIF.remove()
        res.data.forEach(ele => {
            createAndAppendTicket(ele.ticket)

        })
    })

function createAndAppendTicket(ticketString) {
    const ticketArray = JSON.parse(ticketString)
    console.log(ticketArray)
    const ticketContainer = document.getElementById('ticket-container')
    const ticketbody =  document.createElement('div')
    ticketbody.classList.add('grid-container', 'countdown', 'ticket-container')
    ticketArray.forEach(ele1 => {
        ele1.forEach(ele2 => {
            const ticket = document.createElement('div')
            const cell = document.createElement('div')
            cell.style.border = '1px solid white'
            cell.style.padding = '10px'
            cell.style.fontSize = '25px'
            cell.style.fontWeight = 'bold'
            if (ele2 == null)
                cell.innerHTML = "&nbsp;"

            else
                cell.innerHTML = ele2

            ticketbody.appendChild(cell)
        })
    })
    ticketbody.appendChild(bottomComponent())
    ticketContainer.appendChild(ticketbody)
}

function bottomComponent(){
    const comp = document.createElement("button")
    comp.classList.add('buy-btn', 'df')
    comp.innerHTML = 'Buy Now!'
    return comp
}
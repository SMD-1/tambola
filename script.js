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
    ticketbody.classList.add('grid-container', 'ticket-container')
    ticketArray.forEach(ele1 => {
        ele1.forEach(ele2 => {
            const cell = document.createElement('div')
            cell.classList.add('cell', 'md:text-xl', 'lg:text-3xl', 'text-sm')
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
    comp.classList.add('buy-btn', 'df', 
                'bg-white', 'text-blue-500', 'font-semibold',
                'rounded-lg', 'shadow-md', 'hover:bg-blue-400', 'md:py-2',
                'hover:text-white', 'focus:outline-none','transition', 'duration-300', 'ease-in-out'
                )

    comp.innerHTML = 'Buy!'
    return comp
}
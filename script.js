"use strict";

import { getAllTickets } from "./api.config.js";

axios.get(getAllTickets).then(async (res) => {
  const progress = document.querySelector(".progress-bar-container");
  progress.remove();

  for (let i = 0; i < res.data.length; i++) {
    //console.log(res.data[i])
    createAndAppendTicket(res.data[i]);

    //wait for a second every 50 ticket
    if (i % 50 == 0)
      await sleep(1000)

  }
});

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function createAndAppendTicket(ticket) {
  var ticketString = ticket.ticket;
  var ticketArray = JSON.parse(ticketString);

  const ticketsContainer = document.getElementById("tickets-container");

  const ticketbody = document.createElement("div");
  const cellContainer = document.createElement("div");

  const ticketHeader = document.createElement("div");
  const ticketFooter = document.createElement("div");
  ticketFooter.classList.add("ticket-footer");

  ticketHeader.innerText = "Ticket #" + ticket.ticket_id;
  ticketHeader.classList.add("ticket-header", "text-xl", "text-white", "z-40");

  //appending ticket id
  ticketbody.appendChild(ticketHeader);

  ticketbody.classList.add("ticket-container");

  //using aos class in each ticket is very expensive so removed its
  //ticketbody.setAttribute('data-aos', "fade-up")
  cellContainer.classList.add("grid-container");

  // console.log('started')
  // ticketArray.forEach(ele =>{
  //     ele.forEach(ele2 =>{
  //     })
  // })
  // console.log('okay now ended')

  //looping through rows and cols to append cells
  ticketArray.forEach((ele1) => {
    ele1.forEach((ele2) => {
      const cell = document.createElement("div");
      cell.classList.add("cell", "md:text-xl", "lg:text-3xl", "text-sm");
      if (ele2 == null) {

        cell.innerHTML = "&nbsp;";
        cell.classList.add('bg-gray-300')
      }
      else {
        cell.innerHTML = ele2;
      }
      cellContainer.appendChild(cell);
    });
  });
  //if ticket bought then grey it out
  if (ticket.customer_name != "Not Booked") {
    const soldOutComp = document.createElement("div");
    soldOutComp.classList.add(
      "ticket-container-sold",
      "text-center",
      "animate__animated",
      "animate__bounceIn"
    );
    soldOutComp.innerHTML = "Bought by <br>" + ticket.customer_name;
    ticketbody.appendChild(soldOutComp);
  } else {
    setTimeout(() => {
      ticketFooter.appendChild(bottomComponent());
    }, 1000);
  }
  ticketbody.appendChild(cellContainer);
  ticketbody.appendChild(ticketFooter);
  ticketsContainer.appendChild(ticketbody);
}

function bottomComponent() {
  const buyButton = document.createElement("button");
  buyButton.classList.add(
    "buy-btn",
    "bg-white",
    "text-blue-500",
    "font-semibold",
    "rounded-lg",
    "shadow-md",
    "hover:bg-blue-400",
    "hover:text-white",
    "focus:outline-none",
    "transition",
    "duration-300",
    "ease-in-out"
  );

  //   buy btn to payment page
  // const buyBtn = document.querySelector(".buy-btn");
  buyButton.addEventListener("click", () => {
    location.replace("./payment.html");
  });

  buyButton.innerHTML = "Buy";
  return buyButton;
}


//redirecting to game page 
//console.log('redirecting')
//window.location = './gameplay.html'

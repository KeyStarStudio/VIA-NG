// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const serialport = require('serialport')
const tableify = require('tableify')


const { ipcRenderer } = require('electron')

ipcRenderer.on('marh-data', (event, arg) => {
    inputs = document.getElementsByClassName('error')
    let isSet = false
    for(let i = 0 ; i < inputs.length ; i++){
      inputs.textContent = arg;
        // if ( inputs[i].value == '' || inputs[i].value == 0){
        //     isSet = true
        //     inputs[i].value = arg
        //     return
        // }
    }
  })




// async function listSerialPorts() {
//   await serialport.list().then((ports, err) => {
//     if(err) {
//       document.getElementById('error').textContent = err.message
//       return
//     } else {
//       document.getElementById('error').textContent = ''
//     }
//     console.log('ports', ports);

//     if (ports.length === 0) {
//       document.getElementById('error').textContent = 'No ports discovered'
//     }

//     tableHTML = tableify(ports)
//     document.getElementById('ports').innerHTML = tableHTML
//   })


// }

// // Set a timeout that will check for new serialPorts every 2 seconds.
// // This timeout reschedules itself.
// setTimeout(function listPorts() {
//   listSerialPorts();
//   // setTimeout(listPorts, 2000);
// }, 2000);
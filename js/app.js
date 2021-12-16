
var url = window.location.href;
var swlocation = '/FreestyleMorelia/sw.js'


if ('serviceWorker' in navigator){

     if (url.includes('localhost')){
          swlocation = '/sw.js';
     }

     navigator.serviceWorker.register(swlocation);

}

//indexdb

let request = window.indexedDB.open('database',1);

//actualiza cuando se sube de version

  request.onupgradeneeded = event => {
       console.log('Actualizacion de bd');

       let db = event.target.result;

       db.createObjectStore('mensajes', {
            keyPath: 'Id'
       });
  };
//create variable to hold db connection 
let db;

//establish the connection to database 
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    //save reference to database
    const db = event.target.result;
    //add an object store 
    db.createObjectStore('new_spending', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    //check if app is online 
    if (navigator.online) {
        //////add function here 
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    //make transaction readwrite so data users enter can be saved 
    const transaction = db.transaction(['new_spending'], 'readwrite');
    const spendingObjectStore = transaction.objectStore('new_spending');

    spendingObjectStore.add(record);
}



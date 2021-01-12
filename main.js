// const electron = require('electron'),
const { ipcRenderer } = require('electron');
const fs = require('fs');


var d  = new Date();
var hours = d.getHours();
var min = d.getMinutes();
var time = document.getElementById('time').innerHTML = hours+':'+min;

// send data using Ipc to app for saving in file.txt 
function addNum(){
    var data = [time,document.form.textview.value];
    console.log(data)
    ipcRenderer.send('addNum',data);
}
// display in text view 
function insert(num){
    document.form.textview.value=document.form.textview.value+num;
    verify();
}
// onclick delet last number 
function back(){
    var number = document.form.textview.value;
    document.form.textview.value = number.substring(0,number.length-1);
}
// ipcRenderer.on('readHis',(e,data)=>{
//     console.log(data)
// })
// display data in hisoriq 
function getHis(){
    fs.readFile('historique.txt','utf-8',(err,data)=>{
       console.log(data) ;
       var arrayNumber = [];
       arrayNumber = data.split('/');
       console.log(arrayNumber)
       for (let i = 1; i < arrayNumber.length; i++) {
           console.log(arrayNumber[i])
           var dataPart = [];
           dataPart = arrayNumber[i].split(',')
           document.getElementById('historique').innerHTML += '<div class="oneByOne"><i class="fa fa-phone"></i><span class="number">'+dataPart[1]+'</span><span class="time">'+dataPart[0]+'</span></div>';
       }
    })
}
// onclick creat window 
let btnHis = document.getElementById('btnH');
btnHis.addEventListener('click',()=>{
   
    ipcRenderer.send("showHis",'/historique.html');
})

function verify(){
    var number = document.getElementById('number').value;
    // number.addEventListener('')
    console.log(number)
    if(number.match(/^\d{10}$/)){
        document.getElementById('add').style.display = "block"; 
    }else{
        document.getElementById('add').style.display = "none";
    }
}

var add = document.getElementById('add');
add.addEventListener('click',()=>{
    console.log('clicked')
    var data = document.getElementById('number').value;
    var page = "/addToContact.html";
    ipcRenderer.send("addToConatct",{data,page})
   
})


var contact = document.getElementById('contact');
contact.addEventListener('click',()=>{
    ipcRenderer.send('dispalyConatct','/contact.html')
})

// get all contact 
function getContact(){
    fs.readFile('contact.txt','utf-8',(err,data)=>{
        console.log(data) ;
        var arrayNumber = [];
        arrayNumber = data.split('/');
        console.log(arrayNumber)
        for (let i = 1; i < arrayNumber.length; i++) {
            console.log(arrayNumber[i])
            var dataPart = [];
            dataPart = arrayNumber[i].split(',')
            console.log(dataPart[1])
            document.getElementById('contact').innerHTML += '<div class="oneByOne" ><button class="callBtn" onclick=call("'+dataPart[0]+'")><i class="fa fa-phone"></i></button><span class="number">'+dataPart[1]+'</span><span class="time">'+dataPart[0]+'</span></div>';
        }
     })
}

function call(nameFromContact){
    console.log(nameFromContact)
    ipcRenderer.send('callFromContact',nameFromContact)
}
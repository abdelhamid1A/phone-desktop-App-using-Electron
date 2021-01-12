// const { app, BrowserWindow } = require('electron');
const electron = require('electron'),
 {app,BrowserWindow,Menu,ipcMain,Notification,webContents} = electron ;
const fs = require('fs');
const path = require('path')
let mainWin;
let hist;
let addWind;
let contact;
let appMenu = [
    {
        label:"appele"
    },
    {
        label:"historique",
        click(){
            hist = new BrowserWindow({
                width :360,
                height : 640,
                title : 'historique',
                webPreferences: {
                    nodeIntegration: true
                }
            });
            hist.loadURL("file:///"+ __dirname + "/historique.html");
            hist.on('close',()=>{
                hist = null;
            })
        }
    },
    {
        label:"contact"
    },
    {
        label : 'reload',
        role : 'reload'
    }
]
app.on('ready',()=>{
    
    if(process.env.NODE_ENV !=="production") appMenu.push({
        role : "toggleDevTools"
    })

    mainWin = new BrowserWindow({
        width :360,
        height : 640,
        title : 'main',
        webPreferences: {
            nodeIntegration: true
        }
    });


    mainWin.loadURL('file:///' + __dirname + '/index.html')
    mainWin.webContents.send('readHis','data');
    

    mainWin.on('close',()=>{app.quit()})
   

    let myMenu = Menu.buildFromTemplate(appMenu)
    Menu.setApplicationMenu(myMenu)

    ipcMain.on('addNum',(e,data)=>{
        const notification = {
            title: 'calling ...',
            body: 'in call'
          }
        new Notification(notification).show()
        console.log(data)
        var number = "/"+data;
        fs.appendFile('historique.txt',number,(err,data)=>{
            if(err) throw err
            console.log('add')
        })
    })
    
   ipcMain.on('showHis',(e,data)=>{
    creatWin(data);
   })
    function creatWin(url){
        const childWind = new BrowserWindow({
            width :360,
            height : 640,
            webPreferences: {
                nodeIntegration: true
            }
        })
        childWind.loadURL('file:///' + __dirname + url);
     
    }
    ipcMain.on("addToConatct",(e,data)=>{
        console.log(data)
        console.log(data.page);
        addWind = new BrowserWindow({
            width :360,
            height : 360,
            webPreferences: {
                nodeIntegration: true
            }
        })
        addWind.loadURL('file:///' + __dirname + data.page);
        addWind.webContents.on('did-finish-load', () => {
            addWind.webContents.send("displayNumber",data.data)
            console.log('send')
          })

        
    })
    ipcMain.on('saveContact',(e,data)=>{
        console.log(data);
        addWind.hide();
        fs.appendFile('contact.txt',data,(err,data)=>{
            if(err) throw err;
            console.log('contact added')
        })
        addWind = null
    })

    ipcMain.on('dispalyConatct',(e,data)=>{
        contact = new BrowserWindow({
            width :360,
            height : 640,
            webPreferences: {
                nodeIntegration: true
            }
        })
        contact.loadURL('file:///'+__dirname+data)
    })

    ipcMain.on('callFromContact',(e,data)=>{
        console.log(data);
        const notificationForCall = {
            title: 'calling ...',
            body: 'in call to  '+data
          }
        new Notification(notificationForCall).show()
    })
})

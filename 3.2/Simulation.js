//Lucia Alejandra Guzman 20262
// Jorge Caballeros 20009
//Universidad del valle de guatemala
//Proyecto Chat

const { client, xml } = require("@xmpp/client");
const readline = require("readline");
const net = require('net');
const fs = require("fs");
const path = require('path');
const { log } = require("console");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let xmpp = null;
let username = "lucia";
let password = "1234";
const service = "xmpp://alumchat.xyz:5222";
const domain = "alumchat.xyz";


async function register(usernameInput, passwordInput) {
    return new Promise(async (resolve, reject) => {
        if (xmpp) {
            reject(new Error('Ya existe una conexión.'));
        }
        
        username = usernameInput;
        password = passwordInput;
        xmpp = client({
            service: service,
            domain: domain,
            username: username,
            password: password,
        });

        try {
            await xmpp.start();
        } catch (err) {
            reject(new Error(err.message));
        }

        const registerStanza = xml(
            'iq',
            { type: 'set', id: 'register' },
            xml('query', { xmlns: 'jabber:iq:register' },
                xml('username', {}, username),
                xml('password', {}, password),
            )
        );

        xmpp.send(registerStanza).then(() => {
            console.log('¡Gracias por registrarse con nosotros!');
            resolve(); 
        }).catch((err) => {
            reject(new Error('Error al registrar el usuario.'));
        });
    });
}

async function login(usernameInput, passwordInput) {
    username = usernameInput;
    password = passwordInput;
    xmpp = client({
        service: service,
        domain: domain,
        username: username,
        password: password,
    });


    xmpp.on("error", (err) => {
        if (err.condition !== 'not-authorized') { 
            console.error("Error en la conexión:", err);
        }
    });

    xmpp.on("online", async () => {
        console.log("Conexión exitosa.");
        await xmpp.send(xml("presence",{type: "online"}));
        xmpp.on("stanza", async (stanza) => {
            if (stanza.is("message")) {
                console.log("Stanza recibida:", stanza.toString()); 
                const body = stanza.getChild("body");
                const from =  stanza.attrs.from;
                if (body) {
                    const messageText = body.children[0];
                    const sender = from.split('@')[0];
                    if(stanza.getChildText("filename")) {
                        const fileName = stanza.getChildText("filename");
                        const fileData = stanza.getChildText("filedata");
                        const saveDir = './imagesreceived';
                        const savePath = path.join(saveDir, fileName);
                        await saveBase64ToFile(fileData, savePath);
                        console.log(`\nArchivo recibido de ${sender}:`, fileName);
                    } else {
                        console.log(`\nMensaje recibido de ${sender}:`, messageText);
                    }
                    
                }
            } else if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
                const from = stanza.attrs.from;
                solicitudesamistad.push(from);
            } else if(stanza.is('message') && stanza.getChild('body')) {
                if (stanza.attrs.type === "groupchat") {
                    const from = stanza.attrs.from;
                    const body = stanza.getChildText("body");
                    if (from && body) {
                        console.log(`Mensaje de grupo: ${from}: ${body}`);
                    }
                }
            }
        });
    }); 

    try {
        await xmpp.start();
        return true;  
    } catch (err) {
        if (err.condition === 'not-authorized') {
            console.error('\nCredenciales incorrectas! Intente de nuevo.');
        } else {
            console.error('Lo siento, hubo un problema:', err.message);
        }
        return false;  
    }
}

async function Online() {
    console.log("-----Menu-----");
    console.log("[1] Login");
    console.log("[2] Register");
    rl.question("> ", async (answer) => {
        if (answer == 1) {
            // preguntar por usuario y contraseña
            rl.question("ingrese su usuario: ", async (username) => {
                rl.question("ingrese su contraseña: ", async (password) => {
                    login(username, password);
                    return xmpp !== null && xmpp.status === "online";
                });        
            });
        }
        else if (answer == 2) {
            console.log("registrando usuario.");
            rl.question("ingrese su nuevo usuario: ", async (username) => {
                rl.question("ingrese su nueva contraseña: ", async (password) => {
                    register(username, password).then(() => {
                        login(username, password);
                        return xmpp !== null && xmpp.status === "online";

                    }).catch((err) => {
                        console.error(err.message);
                    });
                });        
            });
        }
    });
    
}



Online();
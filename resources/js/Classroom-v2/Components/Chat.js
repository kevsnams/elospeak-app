import _ from 'underscore';
import axios from "axios";

import ClassroomInfo from '../ClassroomInfo';

class Chat {
    constructor()
    {   
        this.chatbox = document.getElementById('vr-chatbox');
        this.chatMessage = document.getElementById('sender-message');
        this.chatMessageButton = document.getElementById('send-message-button');

        this.chatMessage.addEventListener('keydown', (evt) => {
            const ENTER = 13;
            if (evt.keyCode === ENTER && !this.getInput().length) {
                evt.preventDefault();

                return;
            }

            if (evt.keyCode === ENTER) {
                evt.preventDefault();

                this.sendMessage();
                this.clearInput();
            }
        });
    }

    printMessage(message, left = true)
    {
        const div = document.createElement('div');
        div.className = left ? 'chat-left' : 'chat-right';

        const span = document.createElement('span');
        span.innerText = message;
        
        const chatStatus = document.createElement('div');
        chatStatus.className = 'chat-status';

        div.appendChild(span);
        div.appendChild(chatStatus);

        this.chatbox.appendChild(div);

        this.chatbox.scrollTop = this.chatbox.scrollHeight;

        return div;
    }

    createResendLink()
    {
        const a = document.createElement('a');
        
        a.href = '#';
        a.className = 'error';
        a.innerText = 'Message sending failed. Click to resend';

        return a;
    }

    sendMessage()
    {
        let ajax = axios.post(url('/classroom/chat/send'), {
            message: this.getInput(),
            classroom_id: ClassroomInfo.classroom.id
        });

        const message = this.printMessage(this.getInput(), false);

        ajax.catch((response) => {
            message.querySelector('.chat-status').append(this.createResendLink());
        });
    }

    getInput()
    {
        return this.chatMessage.value.trim();
    }

    clearInput()
    {
        this.chatMessage.value = '';
    }
}

const ComponentChat = new Chat();

export default ComponentChat;
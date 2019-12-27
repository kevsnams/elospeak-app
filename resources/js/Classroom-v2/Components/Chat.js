import _ from 'underscore';
import axios from "axios";

import ClassroomInfo from '../ClassroomInfo';
import Users from '../Users';
import IDGenerator from './../Utils/IDGenerator';

class Chat {
    constructor()
    {   
        this.chatbox = document.getElementById('vr-chatbox');
        this.chatMessage = document.getElementById('sender-message');

        this.chatMessage.addEventListener('keydown', (evt) => {
            const ENTER = 13;
            if (evt.keyCode === ENTER && !this.getInput().length) {
                evt.preventDefault();

                return;
            }

            if (evt.keyCode === ENTER) {
                evt.preventDefault();

                this.sendMessage(this.getInput());
                this.clearInput();
            }
        });
    }

    start()
    {
        this.loadMessages();
    }

    loadingState(show = true)
    {
        if (show) {
            const div = document.createElement('div');
            div.className = 'chat-loading-state';
            div.innerHTML = 'Loading previous messages...';
            
            this.chatbox.appendChild(div);

            this.chatMessage.setAttribute('disabled', true);
        } else {
            this.chatbox.innerHTML = '';
            
            this.chatMessage.removeAttribute('disabled');
        }
    }

    loadMessages()
    {
        this.loadingState();

        const chatFetch = axios.post(url('/classroom/chat/load'), {
            id: ClassroomInfo.classroom.id
        });

        chatFetch.then((resp) => {

            this.loadingState(false);

            _.each(resp.data, (chat) => {

                /**
                 * If the chat is the same with the current user_type, then left = false for this.printMessage()
                 */
                const pos = Users.current.user_type == chat.from ? false : true;
                
                this.printMessage(chat.message, pos);
            });
        });
    }

    printMessage(message, left = true)
    {
        const div = document.createElement('div');
        div.className = left ? 'chat-left' : 'chat-right';
        div.id = IDGenerator.create();

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

    createResendLink(message, wrapperId)
    {
        const a = document.createElement('a');
        
        a.href = '#';
        a.className = 'error';
        a.innerText = 'Message sending failed. Click to resend';

        a.addEventListener('click', (evt) => {
            evt.preventDefault();

            evt.target.className = 'resend';
            evt.target.innerText = 'Resending message...';

            this.retrySendMessage(message, wrapperId);
        });

        return a;
    }

    __removeStatusClutter(messageElement)
    {
        const chatStatus = messageElement.querySelector('.chat-status');
        _.each(chatStatus.childNodes, (n) => {
            chatStatus.removeChild(n);
        });
    }

    retrySendMessage(message, wrapperId)
    {
        let ajax = axios.post(url('/classroom/chat/send'), {
            message: message,
            classroom_id: ClassroomInfo.classroom.id
        });

        const messageElement = document.getElementById(wrapperId);

        ajax.then((response) => {
            this.__removeStatusClutter(messageElement);
        });

        ajax.catch((response) => {
            this.__removeStatusClutter(messageElement);
            messageElement.querySelector('.chat-status').appendChild(this.createResendLink(message, messageElement.id));
        });
    }

    sendMessage(message)
    {
        let ajax = axios.post(url('/classroom/chat/send'), {
            message: message,
            classroom_id: ClassroomInfo.classroom.id
        });

        const messageElement = this.printMessage(message, false);

        ajax.then((response) => {
            this.__removeStatusClutter(messageElement);
        });

        ajax.catch((response) => {
            this.__removeStatusClutter(messageElement);
            messageElement.querySelector('.chat-status').appendChild(this.createResendLink(message, messageElement.id));
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
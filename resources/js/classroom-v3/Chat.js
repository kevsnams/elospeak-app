import axios from 'axios';

export default class Chat {
    constructor(options, User)
    {
        this.User = User;
        this.channel = options.channel;
        this.chatBox = options.chatBox;
        this.textarea = options.textarea;
        this.classroom = options.classroom;

        this.messageIndex = 0;

        options.messages.forEach((message) => {
            this.display(message.message, User.user_type != message.from);
        });

        this.textarea.addEventListener('keydown', (evt) => {
            const ENTER = 13;
            const message = this.textarea.value.trim();

            if (evt.keyCode === ENTER && !message.length) {
                evt.preventDefault();

                return;
            }

            if (evt.keyCode === ENTER) {
                evt.preventDefault();

                this.send(message);
                this.textarea.value = '';
            }
        });
    }

    send(message)
    {
        const chat = this.display(message, false);
        const sender = axios.post(url('/classroom/chat/send'), {
            message: message,
            classroom_id: this.classroom.id
        });

        sender.then((response) => {

        });

        sender.catch((error) => {
            chat.querySelector('.chat-status').appendChild(this.createResendLink());
        });
    }

    display(message, left = true)
    {
        const div = document.createElement('div');
        div.className = left ? 'chat-left' : 'chat-right';
        div.setAttribute('id', `chat-${this.messageIndex}`);
        div.setAttribute('data-message', message);

        this.messageIndex += 1;

        const span = document.createElement('span');
        span.innerText = message;
        
        const chatStatus = document.createElement('div');
        chatStatus.className = 'chat-status';

        div.appendChild(span);
        div.appendChild(chatStatus);

        this.chatBox.appendChild(div);

        this.chatBox.scrollTop = this.chatBox.scrollHeight;

        return div;
    }

    createResendLink()
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
}
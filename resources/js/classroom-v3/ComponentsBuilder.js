import TabGroup from './components/TabGroup';
import ToolBox from './components/ToolBox';

export default class ComponentsBuilder {
    constructor(container, User)
    {
        this.User = User;
        this.container = container;

        const sideNav = document.createElement('div');
        sideNav.setAttribute('id', 'vr-sidenav');

        const board = document.createElement('div');
        board.setAttribute('id', 'vr-board');

        const virtualRoom = document.createElement('div');
        virtualRoom.setAttribute('id', 'virtual-room');

        virtualRoom.appendChild(sideNav);
        virtualRoom.appendChild(board);

        this.container.appendChild(virtualRoom);

        this.virtualRoom = virtualRoom;
        this.sideNav = sideNav;
        this.board = board;

        // Sidebar components
        this.addClientCard();
        this.addChatbox();

        // Drawboard components
        if (this.isTeacher()) {
            this.addTabGroup();
        }
        this.addDrawingBoard();

        // ToolBox components
        if (this.isTeacher()) {
            this.addToolBox();
        }
    }

    addChatbox()
    {
        const chat = document.createElement('div');
        chat.setAttribute('id', 'vr-chat');

        const template = `
            <div id="vr-chats">
                <span class="title">CHATROOM</span>
                <div id="vr-chatbox"></div>
            </div>
            <div id="vr-typebox">
                <div class="wrapper">
                    <textarea class="typebox" id="sender-message"></textarea>
                </div>
            </div>
            <span class="info-mute">Press ENTER to send message</span>
        `;

        chat.innerHTML = template;

        this.sideNav.appendChild(chat);
        this.chatBox = chat.querySelector('#vr-chatbox');
        this.chatSendMessage = chat.querySelector('#sender-message');

        this.chat = chat;
    }

    addClientCard()
    {
        const clientCard = document.createElement('div');
        clientCard.setAttribute('id', 'vr-client');

        const template = `
            <span class="label">You're having a class with:</span>
            <div class="client-card ${this.User.user_type}">
                <div class="type">${this.User.uc_user_type}</div>
                <div class="details">
                    <img src="https://usercontent1.hubstatic.com/13400924.png" width="80" height="80" class="uk-border-circle">
                    <div class="full-name">
                        <a href="#">${this.User.full_name}</a>
                    </div>
                </div>
            </div>`;

        clientCard.innerHTML = template;

        this.sideNav.appendChild(clientCard);

        this.clientCard = clientCard;
    }

    addTabGroup()
    {
        this.TabGroup = new TabGroup();
        this.TabGroup.appendTo(this.board);
    }

    addDrawingBoard()
    {
        const drawingBoard = document.createElement('div');
        drawingBoard.setAttribute('id', 'vr-drawingboard');
        drawingBoard.className = 'vr-drawingboard';

        this.board.appendChild(drawingBoard);

        this.drawingBoard = drawingBoard;
    }

    addToolBox()
    {
        this.ToolBox = new ToolBox(this);

    }

    isTeacher()
    {
        return this.User.user_type == 'teacher';
    }

    isStudent()
    {
        return this.User.user_type == 'student';
    }
}
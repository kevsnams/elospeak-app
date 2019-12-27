import _ from 'underscore';
import Users from './Users';
import KonvaStage from './KonvaStage';
import Layers from './Layers';
import DOMElements from './DOMElements';
import ClassroomInfo from './ClassroomInfo';
import History from './History';

import Chat from './Components/Chat';
import Tabs from './Components/Tabs';
import Zoom from './Components/Zoom';
import Tools from './Components/Tools';
import DrawMode from './Components/DrawMode';
import ImportImage from './Components/ImportImage';
import CopyPasta from './Components/CopyPasta';
import DataTransmitter from './Components/DataTransmitter';

class Classroom {
    constructor()
    {
        this.container = DOMElements.container;
        this.drawingboard = DOMElements.drawingboard;
    }

    start()
    {
        Users.setCurrent(window.ClassroomDetails.currentUser);
        Users.setOther(window.ClassroomDetails.otherUser);
        this.Users = Users;

        ClassroomInfo.setChannel(window.ClassroomDetails.channel);
        ClassroomInfo.setClassroom(window.ClassroomDetails.classroom);
        this.ClassroomInfo = ClassroomInfo;
        this.KonvaStage = KonvaStage;
        this.History = History;
        this.Layers = Layers;
        this.Components = {};

        if (Users.current.user_type === 'teacher') {
            this.toolbox = document.getElementById('vr-toolbox');
            this.toolboxToggle = document.getElementById('toolbox-toggle');

            this.defineAdjustToolboxEvent();
            this.defineToggleToolboxEvent();
            
            this.Components = _.extend(this.Components, {
                Tabs,
                Tools,
                DrawMode,
                ImportImage,
                Zoom,
                CopyPasta,
                DataTransmitter
            });
        }

        this.Components = _.extend(this.Components, {
            Chat
        });

        this.startComponents();
    }

    startComponents()
    {
        _.each(this.Components, (c) => {
            if (typeof c.start === 'function') {
                c.start();
            }
        });
    }

    defineToggleToolboxEvent()
    {
        const toggleEvent = () => {
            const icon = document.getElementById('toolbox-toggle-icon');

            const toolboxStyles = window.getComputedStyle(this.toolbox);
            const toolboxHeight = parseFloat((toolboxStyles.height).replace('px', ''));

            const toolboxTogglerStyles = window.getComputedStyle(this.toolboxToggle);
            const togglerHeight = parseFloat((toolboxTogglerStyles.height).replace('px', '')) + 10;

            if (toolboxStyles.bottom === '0px') {
                this.toolbox.style.bottom = -(toolboxHeight - togglerHeight) +'px';
                icon.setAttribute('uk-icon', 'triangle-up');
            } else {
                this.toolbox.style.bottom = '0px';
                icon.setAttribute('uk-icon', 'triangle-down');
            }
        };

        this.triggerToggleEvent();
        this.toolboxToggle.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            this.triggerToggleEvent();
        }, false);
    }

    defineAdjustToolboxEvent()
    {
        const adjustToolbox = (evt) => {
            const dim = this.drawingboard.getBoundingClientRect();
            this.toolbox.style.left = (dim.x  + ((dim.width / 2) - (this.toolbox.scrollWidth / 2))) + 'px';
        };

        adjustToolbox();
        window.addEventListener('resize', _.debounce(adjustToolbox, 200), false);
    }

    triggerToggleEvent()
    {
        const icon = document.getElementById('toolbox-toggle-icon');

        const toolboxStyles = window.getComputedStyle(this.toolbox);
        const toolboxHeight = parseFloat((toolboxStyles.height).replace('px', ''));

        const toolboxTogglerStyles = window.getComputedStyle(this.toolboxToggle);
        const togglerHeight = parseFloat((toolboxTogglerStyles.height).replace('px', '')) + 10;

        if (toolboxStyles.bottom === '0px') {
            this.toolbox.style.bottom = -(toolboxHeight - togglerHeight) +'px';
            icon.setAttribute('uk-icon', 'triangle-up');
        } else {
            this.toolbox.style.bottom = '0px';
            icon.setAttribute('uk-icon', 'triangle-down');
        }
    }
}

const ELOSpeakClassroom = new Classroom();
export default ELOSpeakClassroom;
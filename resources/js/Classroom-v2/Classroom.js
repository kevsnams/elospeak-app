/**
 * Import classroom Components
 */
import KonvaStage from './Components/KonvaStage';
import Layers from './Components/Layers';
import LaravelEcho from './Components/LaravelEcho';
import Chat from './Components/Chat';

import DrawMode from './Components/DrawMode';
import ImportImage from './Components/ImportImage';
import Tabs from './Components/Tabs';
import History from './Components/History';
import Tools from './Components/Tools';
import Zoom from './Components/Zoom';
import BoardViewer from './Components/BoardViewer';

export default class Classroom {
    constructor(container)
    {
        this.registerClassroomAndUserDetails();

        this.container = document.getElementById(container);

        // this this.board is a flawed naming, fuck this shit, remove this once all is settled
        this.board = document.getElementById('vr-board');

        this.toolbox = document.getElementById('vr-toolbox');
        this.toolboxToggle = document.getElementById('toolbox-toggle');

        this.bind(LaravelEcho);
        this.bind(KonvaStage);
        this.bind(Layers);
        this.bind(Chat);

        if (this.Details.Users.current.user_type === 'teacher') {
            this.bind(Tabs);
            this.bind(History);
            this.bind(DrawMode);
            this.bind(ImportImage);
            this.bind(Tools);
            this.bind(Zoom);

            this.registerToggleToolboxEvent();
            this.registerAdjustToolboxEvent();
        } else {
            this.bind(BoardViewer);
        }

        this.runAllBoundedObjects();
    }

    bind(instance)
    {
        if (typeof this._bounds === 'undefined') {
            this._bounds = [];
        }

        const name = instance.name;

        if (typeof this[name] === 'undefined') {
            this[name] = new instance(this);

            this._bounds.push(name);
        }
    }

    runAllBoundedObjects()
    {
        _.each(this._bounds, (obj) => {
            const bind = this[obj];
            bind.run();
        });
    }

    registerToggleToolboxEvent()
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

        toggleEvent();
        this.toolboxToggle.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            toggleEvent();
        }, false);
    }

    registerAdjustToolboxEvent()
    {
        const adjustToolbox = (evt) => {
            const dim = this.board.getBoundingClientRect();
            this.toolbox.style.left = (dim.x  + ((dim.width / 2) - (this.toolbox.scrollWidth / 2))) + 'px';
        };

        adjustToolbox();
        window.addEventListener('resize', _.debounce(adjustToolbox, 200), false);
    }

    registerClassroomAndUserDetails()
    {
        if (typeof window.ClassroomDetails === 'undefined') {
            throw new Error('window.ClassroomDetails is undefined');
        }

        this.Details = {
            Classroom: window.ClassroomDetails.classroom,
            Users: {
                current: window.ClassroomDetails.currentUser,
                other: window.ClassroomDetails.otherUser
            },
            channel: window.ClassroomDetails.channel
        };
    }
}
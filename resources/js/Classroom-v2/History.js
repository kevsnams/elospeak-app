import Undo from './History/Undo';
import Redo from './History/Redo';
import Users from './Users';

class History {
    constructor()
    {
        this.actions = [];
        this.current = null;
        
        if (Users.current.user_type == 'teacher') {
            this.buttonUndo = document.getElementById('history-undo');
            this.buttonRedo = document.getElementById('history-redo');

            this.buttonUndo.addEventListener('click', (evt) => {
                evt.preventDefault();
                this.undo();
            }, false);

            this.buttonRedo.addEventListener('click', (evt) => {
                evt.preventDefault();
                this.redo();
            }, false);

            /**
             * Ctrl + Z and Ctrl + Y events
             */
            document.addEventListener('keydown', (evt) => {
                var evtObj = window.event ? event : evt;

                if (evtObj.keyCode === 90 && evtObj.ctrlKey) {
                    this.undo();
                }

                if (evtObj.keyCode === 89 && evtObj.ctrlKey) {
                    this.redo();
                }
            }, false);
        }
    }

    getAction(index)
    {
        return typeof this.actions[index] !== 'undefined' ? this.actions[index] : null;
    }

    /**
     * Usage:
     * [Updating a single property of it's data]
     * History.updateAction(1, 'node', Konva.node())
     * 
     * OR
     * 
     * [Updating the whole data object]
     * History.updateAction(1, {
     *  node: Konva.node(),
     *  layer_id: 32
     * })
     * 
     * @param {*} index The action's index
     * @param {*} newAction If string, it only updates the property of data. If object, it updates the whole data object.
     * @param {*} value Optional. If 2nd parameter is just an update of data property then this variable will be used
     */
    updateAction(index, newAction, value = null)
    {
        const existingAction = this.getAction(index);

        if (existingAction === null) {
            console.log('History.setAction undefined index');
            return;
        }

        if (typeof newAction === 'string') {
            this.actions[index].data[newAction] = value;
        } else {
            this.actions[index] = this._format(existingAction.type, newAction);
        }
    }

    /**
     * 
     * @param {*} action String available actions: createtab, move, new, resize
     * @param {*} data JSON the action data
     */
    add(action, data)
    {
        /**
         * The first time it loads an action, this.current is null.
         * So we need to set this.current = 0
         */
        if (this.current === null) {
            this.current = 0;
        } else {
            /**
             * Otherwise, just increment the this.current value
             */
            this.current++;
        }

        this.storeAction(this._format(action, data));
    }

    _format(action, data)
    {
        return {
            type: action,
            data
        };
    }

    storeAction(data)
    {
        this.actions.push(data);

        /**
         * If this.current is somewhere below the current length,
         * splice() the actions to where the currentLength is.
         * The reason for this is when the user hits back and this.current
         * is below the currentLength we need to cut the actions and
         * start where the user hits back
         */

        if (this.current < this.actions.length - 1) {
            this.actions.splice(this.current);
            this.actions.push(data);

            // @TODO Perhaps cleanup unused nodes/layers? Change splice to slice and loop the to-be-removed actions and remove the nodes

            this.current = this.actions.length - 1;
        }
    }

    undo()
    {
        /**
         * Stop the function from executing
         * if it's trying to go back beyond 0 or blank state which is null
         */
        if (this.current < 0 || this.current === null) {
            this.current = null;
            return;
        }

        new Undo(this.current);
        this.current--;
    }

    redo()
    {
        if (this.current === null) {
            this.current = 0;
        } else {
            this.current++;
        }


        if (this.current >= this.actions.length) {
            this.current--;
            return;
        }

        new Redo(this.current);
    }
}

const ELOSpeakHistory = new History();

export default ELOSpeakHistory;
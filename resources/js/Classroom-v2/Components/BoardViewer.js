import DataTransmitter from './DataTransmitter';
import ClassroomInfo from '../ClassroomInfo';
import Layers from '../Layers';
import KonvaStage from '../KonvaStage';
import Konva from 'konva';

class BoardViewer {
    constructor()
    {
        this.promiseMethods = ['event_newImage'];
    }

    start()
    {
        DataTransmitter.Echo.private(ClassroomInfo.channel).listenForWhisper('draw', (draw) => {
            this.dispatchEvent(draw);
        });
    }

    async dispatchEvent(params)
    {
        const fn = `event_${params.event}`;

        if (this.promiseMethods.indexOf(fn) >= 0) {
            await this[fn](params.data);
        } else {
            this[fn](params.data);
        }
    }

    event_newImage(data)
    {
        return new Promise((resolve, reject) => {
            // Create new layer
            Layers.set(data.layer_id, new Konva.Layer({
                id: data.layer_id
            }), {
                classroom: {
                    height: data.stage_height
                }
            });

            // Create image object
            const image = new Image();

            image.onload = () => {

                // Create konva image object
                const node = new Konva.Image({
                    width: image.width,
                    height: image.height,
                    x: 0,
                    y: 0,
                    draggable: true,
                    name: 'images'
                });

                node.id(data.node_id);
                node.image(image);

                Layers.get(data.layer_id).add(node);
                Layers.use(data.layer_id);

                Layers.get(data.layer_id).draw();

                resolve({success: true});
            };

            image.onerror = () => {
                reject({success: false});
            };

            image.src = data.image_URL;
        });
    }

    event_reposNode(data)
    {
        const node = KonvaStage.Stage.find(`#${data.node_id}`);

        node.x(data.x);
        node.y(data.y);

        node.getLayer().draw();
    }
}

const ComponentBoardViewer = new BoardViewer();

export default ComponentBoardViewer;
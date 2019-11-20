import Component from "./Component";
import Konva from 'konva';

export default class BoardViewer extends Component {
    constructor(Classroom)
    {
        super(Classroom);
    }

    run()
    {
        Echo.private(this.getEchoChannel()).listenForWhisper('draw', (draw) => {
            this.applyEventData(draw);
        });
    }
    applyEventData(data)
    {
        this[`event_${data.event}`](data);
    }

    event_setLayer(data)
    {
        const node = Konva.Node.create(data.layer);
        this.getLayers().set(node.id(), node, data.additional_properties);
    }

    event_useLayer(data)
    {
        this.getLayers().use(data.layer_id);
    }

    event_removeLayer(data)
    {
        this.getLayers().remove(data.layer_id, data.destroy);
    }

    event_newNode(data)
    {
        const node = Konva.Node.create(data.node);
        this.getLayers().get(data.layer_id).add(node);

        node.getLayer().draw();
    }

    event_newPoints(data)
    {
        const layer = this.getLayers().get(data.layer_id);

        layer.find(`#${data.node_id}`).points(data.points);
        layer.batchDraw();
    }

    event_imageSrc(data)
    {
        const layer = this.getLayers().get(data.layer_id);
        const node = layer.find(`#${data.node_id}`);

        const img = new Image();
        img.src = data.src;

        node.image(img);

        layer.batchDraw();
    }
    
    event_newPosition(data)
    {
        const layer = this.getLayers().get(data.layer_id);
        const node = layer.find(`#${data.node_id}`);

        node.x(data.x);
        node.y(data.y);

        layer.draw();
    }

    event_setScale(data)
    {
        this.getStage().scale(data.scale);
        this.getStage().position(data.position);

        this.getStage().batchDraw();
    }
}
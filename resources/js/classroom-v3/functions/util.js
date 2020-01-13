export function makeid()
{
    let length = 6, result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function getStageMidPointOfNode(stage, node)
{
    const scaleX = stage.scaleX();
    return {
        x: ((stage.width() / 2) - (node.width() / 2)) / scaleX - stage.x() / scaleX,
        y: (Math.abs(stage.getContainer().getBoundingClientRect().top - scaleX) + (window.innerHeight / 2)) / scaleX - stage.y() / scaleX
    }
}

export function imageShapeBound(pos)
{
    const newPos = {x: pos.x, y: pos.y};

    if (pos.x < 0) {
        newPos.x = 0;
    }

    if (pos.y < 0) {
        newPos.y = 0;
    }

    return newPos;
}

export function createImageFromUploadedImages(data)
{
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.setAttribute('data-index', data.image.index);
        image.setAttribute('data-node-id', data.node_id);
        image.setAttribute('data-image-id', data.image.id);

        image.onerror = () => {
            reject(false);
        };

        image.onload = () => {
            resolve(image);
        };

        image.src = data.image.src;
    });
}
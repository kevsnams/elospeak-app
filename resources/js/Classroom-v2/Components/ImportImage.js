import Component from './Component';
import Konva from 'konva';

export default class ImportImage extends Component {
    constructor(Classroom)
    {
        super(Classroom);
        
        this.allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
        this.counter = 0;

        this.fileDropZone = document.getElementById('file-dropZone');
        this.fileInput = document.getElementById('file-input');
    }

    run()
    {
        this.registerDragImageEvents();
        this.registerImageUploadEvents();
    }

    registerDragImageEvents()
    {
        _.each(['dragenter', 'dragover', 'dragleave', 'drop'], (evtName) => {
            window.addEventListener(evtName, (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
            }, false);
        });

        _.each(['dragenter', 'dragover'], (evtName) => {
            window.addEventListener(evtName, (evt) => {
                this.showDropZone();
            }, false);
        });

        _.each(['dragleave', 'drop'], (evtName) => {
            this.fileDropZone.addEventListener(evtName, (evt) => {
                this.hideDropZone();
            }, false);
        });
    }

    registerImageUploadEvents()
    {
        this.fileDropZone.addEventListener('drop', (evt) => {
            this.importImageEvent(evt);
        }, false);

        this.fileInput.addEventListener('change', (evt) => {
            this.importImageEvent(evt);
        }, false);
    }

    imagesToKonva(pic)
    {
        const id = `image-${pic.image.getAttribute('data-index')}`;

        pic.kImage.id(id);

        pic.kImage.on('dragend dragstart', (evt) => {
            const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;
            this.getHistory().add('move', evt.target);

            this.getLaravelEcho().sendEventData({
                event: 'newPosition',
                node_id: evt.target.id(),
                layer_id: evt.target.getLayer().id(),
                x: evt.target.x(),
                y: evt.target.y()
            });
        });

        this.getLayers().set(id, new Konva.Layer({
            id,
        }), {
            classroom: {
                height: pic.image.height
            }
        })
        .use(id)
        .get(id)
        .add(pic.kImage);


        this.getLaravelEcho().sendEventData({
            event: 'newNode',
            node: pic.kImage.toJSON(),
            layer_id: id
        });

        this.getLaravelEcho().sendEventData({
            event: 'imageSrc',
            node_id: pic.kImage.id(),
            src: pic.image.getAttribute('src'),
            layer_id: id
        });

        this.getTabs().createTab(id, `Tab ${pic.image.getAttribute('data-index')}`).setActive(id);
        this.getHistory().add('createtab', id);

        this.getLayers().current().draw();
        this.getHistory().add('new', pic.kImage);
    }

    importImageEvent(evt)
    {
        const files = typeof evt.dataTransfer !== 'undefined' ? evt.dataTransfer.files : evt.target.files;

        this.processImages(files, (image) => {
            this.imagesToKonva(image);
        });

        this.getDrawMode().set('select');
        this.getTools().Select.setActive();
    }

    getImages()
    {
        return this.images;
    }

    processImages(files, onAfterResolve)
    {
        const filteredFiles = _.filter(files, (file) => {
            return _.contains(this.allowedExtensions, file.type);
        });

        _.each(filteredFiles, (file) => {

            this.counter++;

            const handleImageTransfer = async (file, counter) => {
                try {
                    const img = await this.processImage(file, counter);

                    onAfterResolve(img);
                } catch(e) {
                    console.warn(e.message);
                }
            };

            handleImageTransfer(file, this.counter);
        });

        return this;
    }

    processImage(file, index)
    {
        const fr = new FileReader();

        return new Promise((resolve, reject) => {
            fr.onerror = () => {
                fr.abort();
                reject(new DOMException("Problem parsing image file. Please report to admin"));
            };

            fr.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const kImg = new Konva.Image({
                        width: img.width,
                        height: img.height,
                        x: 0,
                        y: 0,
                        draggable: true,
                        name: 'images'
                    });
                    kImg.image(img);

                    resolve({
                        kImage: kImg,
                        image: img
                    });
                };

                img.src = fr.result;
                img.setAttribute('data-index', index);
            };

            fr.readAsDataURL(file);
        });
    }

    showDropZone()
    {
        this.fileDropZone.style.visibility = 'visible';
    }

    hideDropZone()
    {
        this.fileDropZone.style.visibility = 'hidden';
    }
}
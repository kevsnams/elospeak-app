import _ from 'underscore';
import axios from 'axios';
import Konva from 'konva';

import Users from '../Users';
import Layers from '../Layers';
import History from '../History';
import DataTransmitter from '../Components/DataTransmitter';

import Tabs from './Tabs';
import DrawMode from './DrawMode';
import Registry from '../Registry';
import IDGenerator from '../Utils/IDGenerator';

class ImportImage {
    constructor()
    {
        this.allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
        this.counter = 0;

        this.fileDropZone = document.getElementById('file-dropZone');
        this.fileInput = document.getElementById('file-input');
        this.fileProgress = document.getElementById('file-upload-progress');

        this.elements = {
            current: this.fileProgress.querySelector('.current'),
            total: this.fileProgress.querySelector('.total'),
            progress: this.fileProgress.querySelector('.progress')
        };
    }

    start()
    {
        if (Users.current.user_type === 'teacher') {
            this.registerDragImageEvents();
            this.registerImageUploadEvents();
        }
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

    drawNode(data)
    {
        const node = data.node;
        const image = data.image;
        const id = `image-${image.getAttribute('data-node-id')}`;

        node.id(id);

        node.on('dragend dragstart', (evt) => {
            const target = evt.type === 'dragstart' ? evt.currentTarget : evt.target;
            const regid = `kimg-${target.id()}-from`;

            if (evt.type === 'dragstart') {
                Registry.set(regid, {
                    x: target.x(),
                    y: target.y()
                });
            } else if (evt.type === 'dragend') {
                const coords = Registry.get(regid);

                History.add('move', {
                    node: target,
                    from: {
                        x: coords.x,
                        y: coords.y
                    },

                    to: {
                        x: target.x(),
                        y: target.y()
                    }
                });

                Registry.delete(regid);
            }
            

            DataTransmitter.send({
                event: 'reposNode',
                data: {
                    node_id: target.id(),
                    x: target.x(),
                    y: target.y()
                }
            }, true);
        });

        const previousLayer = Layers.current().id();


        Layers.set(id, new Konva.Layer({
            id
        }), {
            classroom: {
                height: image.height
            }
        });

        Layers.use(id);
        Layers.get(id).add(node);

        const tabLabel = `Tab ${image.getAttribute('data-index')}`;
        Tabs.create(id, tabLabel).setActive();

        Layers.get(id).draw();

        History.add('newImage', {
            node,
            node_id: node.id(),
            image_URL: image.image_URL,
            layer_id: id,
            layer_id_previous: previousLayer,
            tab_id: id,
            tab_label: tabLabel,
            stage_height: image.height
        });

        DataTransmitter.send({
            event: 'newImage',
            data: {
                node_id: node.id(),
                image_url: image.getAttribute('src'),
                layer_id: id,
                stage_height: image.height
            }
        });
    }

    importImageEvent(evt)
    {
        const files = typeof evt.dataTransfer !== 'undefined' ? evt.dataTransfer.files : evt.target.files;

        const config = {
            onUploadProgress: function(progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                
            },

            onDownloadProgress: function(progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            }
        };

        this.showUploadProgress();
        this.elements.total.innerText = files.length;
        this.elements.current.innerText = 0;

        this.elements.progress.setAttribute('max', files.length);

        _.each(files, (file, index) => {
            const data = new FormData();
            data.set('image', file);

            const upload = axios.post(url('/classroom/image-upload'), data, config);
            
            upload.then((res) => {
                const current = parseInt(this.elements.current.innerText) + 1;
                const total = parseInt(this.elements.total.innerText);

                this.elements.current.innerText = current;
                this.elements.progress.setAttribute('value', current);

                const handler = this.handleResponse(res);

                handler.then((data) => {
                    this.drawNode(data);
                });

                if (current === total) {
                    setTimeout(() => {
                        this.hideUploadProgress();
                    }, 1500);
                }
            });
        });

        DrawMode.set('select');
    }

    getImages()
    {
        return this.images;
    }

    handleResponse(response)
    {
        const image = new Image();
        return new Promise((resolve, reject) => {

            this.counter += 1;

            image.setAttribute('data-index', this.counter);
            image.setAttribute('data-node-id', IDGenerator.create());
            image.setAttribute('data-image-id', response.data.image.id);

            image.onerror = () => {
                reject({
                    success: false,
                    image
                });
            };

            image.onload = () => {
                const node = new Konva.Image({
                    width: image.width,
                    height: image.height,
                    x: 0,
                    y: 0,
                    draggable: true,
                    name: 'images'
                });

                node.id(image.getAttribute('data-node-id'));
                node.image(image);

                resolve({
                    success: true,
                    image,
                    node
                });
            };

            image.src = response.data.image.image_URL;
        });
    }

    showUploadProgress()
    {
        this.fileProgress.style.visibility = 'visible';
    }

    hideUploadProgress()
    {
        this.fileProgress.style.visibility = 'hidden';
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

const ComponentImportImage = new ImportImage();

export default ComponentImportImage;
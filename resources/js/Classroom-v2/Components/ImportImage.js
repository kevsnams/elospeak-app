import _ from 'underscore';
import axios from 'axios';
import Konva from 'konva';

import Users from '../Users';
import Layers from '../Layers';
import History from '../History';

import Tabs from './Tabs';
import DrawMode from './DrawMode';
import Tools from './Tools';
import Registry from '../Registry';
import Curtain from '../Curtain';

class ImportImage {
    constructor()
    {
        
        this.allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
        this.counter = 0;

        this.fileDropZone = document.getElementById('file-dropZone');
        this.fileInput = document.getElementById('file-input');
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

    imagesToKonva(pic)
    {
        const id = `image-${pic.image.getAttribute('data-index')}`;

        pic.kImage.id(id);

        pic.kImage.on('dragend dragstart', (evt) => {
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
            

            /*
            this.getLaravelEcho().sendEventData({
                event: 'newPosition',
                node_id: evt.target.id(),
                layer_id: evt.target.getLayer().id(),
                x: evt.target.x(),
                y: evt.target.y()
            });*/
        });

        const previousLayer = Layers.current().id();


        Layers.set(id, new Konva.Layer({
            id
        }), {
            classroom: {
                height: pic.image.height
            }
        });

        Layers.use(id);
        Layers.get(id).add(pic.kImage);

        /*
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
        */

        const tabLabel = `Tab ${pic.image.getAttribute('data-index')}`;
        Tabs.create(id, tabLabel).setActive();

        Layers.get(id).draw();
        History.add('newImage', {
            node: pic.kImage,
            node_id: pic.kImage.id(),
            layer_id: id,
            layer_id_previous: previousLayer,
            tab_id: id,
            tab_label: tabLabel,
            stage_height: pic.image.height
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

        _.each(files, (file) => {
            const data = new FormData();
            data.set('image', file);

            const xhr = axios.post(url('/classroom/image-upload'), data, config);
            
            xhr.then((res) => {
                console.log(res);
            });
        });

        /*
        this.processImages(files, (image) => {
            this.imagesToKonva(image);
        });

        DrawMode.set('select');
        */
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

const ComponentImportImage = new ImportImage();

export default ComponentImportImage;
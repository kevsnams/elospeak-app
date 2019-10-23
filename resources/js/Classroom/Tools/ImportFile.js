import _ from 'underscore';
import Konva from 'konva';

const ImportFile = (function() {
    const _tool = Symbol();
    const _dropZone = Symbol();
    const _fileInput = Symbol();
    const _allowedExt = Symbol();
    const _imageIndex = Symbol();

    class ImportFile {
        constructor() {
            this[_imageIndex] = 0;

            this[_tool] = document.getElementById('file-upload-tool');
            this[_fileInput] = document.getElementById('file-input');
            this[_dropZone] = document.getElementById('file-dropZone');
            this[_allowedExt] = ['image/png', 'image/jpeg', 'image/jpg'];

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
                this.dropZone.addEventListener(evtName, (evt) => {
                    this.hideDropZone();
                }, false);
            });

            this.dropZone.addEventListener('drop', (evt) => {
                this.inputImageEvent(evt.dataTransfer.files);
            }, false);

            document.getElementById('file-input').addEventListener('change', (evt) => {
                this.inputImageEvent(evt.target.files);
            }, false);
        }

        inputImageEvent(files) {
            const filteredFiles = _.filter(files, (file) => {
                return _.contains(this.allowedExtensions(), file.type);
            });

            this.processImages(filteredFiles);
        }

        processImages(files) {
            _.each(files, (file) => {
                this.processImage(file);
            });
        }

        processImage(file) {
            const fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onerror = function(error) {
                alert('Failed importing image');
                console.log(error);
            };

            fr.onload = () => {
                this[_imageIndex] = this[_imageIndex] + 1;
                const index = this[_imageIndex];
                const tabId = `image-${index}`;

                ClassroomBoard.layers.create(tabId, `Tab ${index}`);
                
                const img = new Image();
                img.onload = () => {
                    const kImg = new Konva.Image({
                        width: img.width,
                        height: img.height,
                        x: 0,
                        y: 0,
                        draggable: true
                    });

                    kImg.image(img);
                    ClassroomBoard.mode('select');
                    ClassroomBoard.layers.get(tabId).add(kImg);

                    if (ClassroomBoard.stage.height() < img.height) {
                        ClassroomBoard.stage.height(img.height);
                    }

                    ClassroomBoard.layers.get(tabId).draw();
                    console.log(tabId);
                };

                img.src = fr.result;
            };
        }

        allowedExtensions() {
            return this[_allowedExt];
        }

        showDropZone() {
            this.dropZone.style.visibility = 'visible';
        }

        hideDropZone() {
            this.dropZone.style.visibility = 'hidden';
        }

        get dropZone() {
            return this[_dropZone];
        }

        get fileInput() {
            return this[_fileInput];
        }
    }

    return ImportFile;
}());

export default ImportFile;
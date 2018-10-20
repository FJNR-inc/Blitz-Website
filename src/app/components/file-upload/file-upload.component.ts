import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { PictureService } from '../../services/picture.service';
import {Picture} from '../../models/picture';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  errors: Array<string> = [];
  dragAreaClass = 'dragarea';
  @Input() fileExt = 'JPG, PNG';
  @Input() maxFiles = 5;
  @Input() maxSize = 5; // 5MB
  @Input() files: Picture;
  @Output() uploadStatus = new EventEmitter();
  @Output() newFile = new EventEmitter();
  @Output() deleteFile = new EventEmitter();

  constructor(private fileService: PictureService) { }

  ngOnInit() { }

  onFileChange(event) {
    const files = event.target.files;
    this.saveFiles(files);
  }

  onFileDeletion(file) {
    this.deleteFile.emit(file);
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }

  @HostListener('dragend', ['$event']) onDragEnd(event) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('drop', ['$event']) onDrop(event) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    this.saveFiles(files);
  }


  saveFiles(files) {
    this.errors = []; // Clear error
    // Validate file size and allowed extensions
    if (files.length > 0 && (!this.isValidFiles(files))) {
      this.uploadStatus.emit(false);
      return;
    }

    for (const file of files) {
      console.log(file);
      this.newFile.emit(file);
    }
  }


  private isValidFiles(files) {
    // Check Number of files
    if (files.length > this.maxFiles) {
      this.errors.push('Erreur: Vous ne pouvez télécharger que ' + this.maxFiles + ' fichiers à la fois');
      return;
    }
    this.isValidFileExtension(files);
    return this.errors.length === 0;
  }

  private isValidFileExtension(files) {
    // Make array of file extensions
    const extensions = (this.fileExt.split(',')).map(
      function (x) { return x.toLocaleUpperCase().trim(); }
    );

    for (let i = 0; i < files.length; i++) {
      // Get file extension
      const ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
      // Check the extension exists
      const exists = extensions.includes(ext);
      if (!exists) {
        this.errors.push('Erreur: L\'extension de ce fichier n\'est pas supportée -> ' + files[i].name);
      }
      // Check file size
      this.isValidFileSize(files[i]);
    }
  }


  private isValidFileSize(file) {
    const fileSizeinMB = file.size / (1024 * 1000);
    const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.maxSize) {
      this.errors.push('Erreur: Le fichier ' + file.name + ' excède la taille maximum de ' + this.maxSize + 'MB ( ' + size + 'MB )');
    }
  }
}

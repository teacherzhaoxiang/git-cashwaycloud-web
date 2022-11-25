import { Component, OnInit,OnDestroy,ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-moudel',
  template: `
      <div class="content">
          <div class="upload">
              <nz-upload [(nzFileList)]="fileList" [nzBeforeUpload]="beforeUpload" [nzMultiple]="Multiple" [nzLimit]="num" [nzRemove]="remove">
                  <button nz-button><i nz-icon nzType="upload"></i>选择zip文件</button>
              </nz-upload>
              <button
                      nz-button
                      [nzType]="'primary'"
                      [nzLoading]="uploading"
                      (click)="handleUpload()"
                      [disabled]="fileList.length == 0"
                      style="margin-top: 16px"
              >
                  {{ uploading ? '上传中 ' : '上传' }}
              </button>
          </div>
      </div>
    <!--<my-sf></my-sf>-->
  `,
  styles: [ `
    .content{
        margin-right: 18px;
    }
    .upload{
        width: 60%;
        margin: auto;
        margin-top: 30px;
    }
  `]
})
export class UploadFileComponent implements OnInit, OnDestroy {
  uploading = false;
  Multiple = true;
  ShowUploadList = false;
  fileList: UploadFile[] = [];
  num = 4;
  constructor(private http: HttpClient, private msg: NzMessageService, private message: NzMessageService) {}
  ngOnInit() {

  }
  ngOnDestroy() {

  }
  remove = (file) => {
    console.log(file)
    return true;
  }
  beforeUpload = (file: UploadFile): boolean => {
    let splitFile = file.name.split('.');
    if(splitFile[splitFile.length-1] == 'zip'){
      let tempFlie: UploadFile[] = [];
      this.fileList = tempFlie.concat(file);
    }else {
      this.message.error('请选择zip的文件');
    }
    console.log(file.name)

    console.log(this.fileList)
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', 'https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        () => {
          this.uploading = false;
          this.fileList = [];
          this.msg.success('upload successfully.');
        },
        () => {
          this.uploading = false;
          this.msg.error('upload failed.');
        }
      );
  }
}

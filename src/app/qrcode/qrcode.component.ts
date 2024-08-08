import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.css',
})
export class QrcodeComponent implements OnInit {
  qrForm!: FormGroup;
  qrCodeImage: string | null = null;
  constructor(private fb: FormBuilder,private http: HttpClient) {}

  ngOnInit(): void {
    this.qrForm = this.fb.group({
      message: ['',Validators.required],
    });
  }

  onAdd() {
    const message = this.qrForm.get('message')?.value;
    this.http.post('http://3.109.71.26:8090/generate', message, { responseType: 'text' })
      .pipe(
        map(response => 'data:image/png;base64,' + response),
        catchError(error => {
          console.error('Error:', error);
          return of(null); 
        })
      )
      .subscribe(qrCodeImage => this.qrCodeImage = qrCodeImage);
      this.qrForm.reset();
  }

  downloadImage() {
    if (this.qrCodeImage) {
      const link = document.createElement('a');
      link.href = this.qrCodeImage;
      link.download = 'qrcode.png';
      link.click();
    }
  }
}

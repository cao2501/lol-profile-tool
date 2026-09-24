import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../core/dialog/dialog.component';
import { LCUConnectionService } from '../core/services/lcuconnection/lcuconnection.service';

@Component({
  selector: 'app-brailleart',
  templateUrl: './brailleart.component.html',
  styleUrls: ['./brailleart.component.css']
})
export class BrailleartComponent {
  public brailleOutput = '';
  public textInput = '';
  public brailleTextOutput = '';
  public imageWidth = 60;
  public threshold = 128;
  public invert = false;
  public ditherMode = 'floydSteinberg';
  public activeTab = 'image'; // 'image' or 'text'

  // Braille font mapping for text-to-braille
  private brailleMap: Record<string, string> = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
    'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
    'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
    'z': '⠵',
    '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢',
    '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔', '0': '⠴',
    ' ': '⠀', '.': '⠨', ',': '⠠', ';': '⠰', ':': '⠱',
    '!': '⠮', '?': '⠹', '-': '⠤', '\'': '⠄', '"': '⠐',
    '(': '⠷', ')': '⠾', '/': '⠌', '@': '⠈', '#': '⠼',
    '\n': '\n'
  };

  // Braille dot positions for Unicode braille pattern
  // Each braille char is a 2x4 dot matrix
  // Dot numbering:
  //  1 4
  //  2 5
  //  3 6
  //  7 8
  // Bit values: dot1=0x01, dot2=0x02, dot3=0x04, dot4=0x08, dot5=0x10, dot6=0x20, dot7=0x40, dot8=0x80
  private dotBits = [0x01, 0x02, 0x04, 0x40, 0x08, 0x10, 0x20, 0x80];

  constructor(public dialog: MatDialog, private lcuConnectionService: LCUConnectionService) {
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.convertImageToBraille(img);
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  }

  private convertImageToBraille(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Calculate dimensions - each braille char represents 2x4 pixels
    const charWidth = this.imageWidth;
    const pixelWidth = charWidth * 2;
    const pixelHeight = Math.round((img.height / img.width) * pixelWidth);
    const charHeight = Math.ceil(pixelHeight / 4);

    canvas.width = pixelWidth;
    canvas.height = charHeight * 4;

    // Draw image scaled to canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, pixelWidth, charHeight * 4);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Convert to grayscale array
    const width = canvas.width;
    const height = canvas.height;
    const gray: number[] = new Array(width * height);

    for (let i = 0; i < width * height; i++) {
      const r = pixels[i * 4];
      const g = pixels[i * 4 + 1];
      const b = pixels[i * 4 + 2];
      gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Apply dithering
    if (this.ditherMode === 'floydSteinberg') {
      this.floydSteinbergDither(gray, width, height);
    } else if (this.ditherMode === 'atkinson') {
      this.atkinsonDither(gray, width, height);
    }
    // 'none' = simple threshold, no dithering applied

    // Convert to braille characters
    let result = '';
    for (let cy = 0; cy < charHeight; cy++) {
      for (let cx = 0; cx < charWidth; cx++) {
        let pattern = 0;
        // Map 2x4 pixel block to 8 dots
        for (let dy = 0; dy < 4; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const px = cx * 2 + dx;
            const py = cy * 4 + dy;
            if (px < width && py < height) {
              const pixelVal = gray[py * width + px];
              let isDot: boolean;
              if (this.invert) {
                isDot = pixelVal >= this.threshold;
              } else {
                isDot = pixelVal < this.threshold;
              }
              if (isDot) {
                const dotIndex = dy * 2 + dx; // 0-7
                pattern |= this.dotBits[dotIndex];
              }
            }
          }
        }
        result += String.fromCharCode(0x2800 + pattern);
      }
      result += '\n';
    }

    this.brailleOutput = result.trimEnd();
  }

  private floydSteinbergDither(gray: number[], width: number, height: number) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const oldPixel = gray[idx];
        const newPixel = oldPixel < this.threshold ? 0 : 255;
        gray[idx] = newPixel;
        const error = oldPixel - newPixel;

        if (x + 1 < width) gray[idx + 1] += error * 7 / 16;
        if (y + 1 < height) {
          if (x - 1 >= 0) gray[(y + 1) * width + (x - 1)] += error * 3 / 16;
          gray[(y + 1) * width + x] += error * 5 / 16;
          if (x + 1 < width) gray[(y + 1) * width + (x + 1)] += error * 1 / 16;
        }
      }
    }
  }

  private atkinsonDither(gray: number[], width: number, height: number) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const oldPixel = gray[idx];
        const newPixel = oldPixel < this.threshold ? 0 : 255;
        gray[idx] = newPixel;
        const error = (oldPixel - newPixel) / 8;

        if (x + 1 < width) gray[idx + 1] += error;
        if (x + 2 < width) gray[idx + 2] += error;
        if (y + 1 < height) {
          if (x - 1 >= 0) gray[(y + 1) * width + (x - 1)] += error;
          gray[(y + 1) * width + x] += error;
          if (x + 1 < width) gray[(y + 1) * width + (x + 1)] += error;
        }
        if (y + 2 < height) {
          gray[(y + 2) * width + x] += error;
        }
      }
    }
  }

  public convertTextToBraille() {
    const input = this.textInput.toLowerCase();
    let output = '';
    for (const char of input) {
      if (this.brailleMap[char]) {
        output += this.brailleMap[char];
      } else {
        // Keep original character if no mapping exists (Vietnamese chars, emoji, etc.)
        output += char;
      }
    }
    this.brailleTextOutput = output;
  }

  public copyToClipboard(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.dialog.open(DialogComponent, {
          data: { body: 'Đã copy vào clipboard!' }
        });
      });
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.dialog.open(DialogComponent, {
        data: { body: 'Đã copy vào clipboard!' }
      });
    }
  }

  public applyAsStatus(text: string) {
    this.lcuConnectionService.requestSend(
      { statusMessage: text, availability: 'chat' },
      'PUT',
      'lolChat'
    ).then(response => {
      this.dialog.open(DialogComponent, {
        data: { body: response || 'Đã đặt làm status thành công!' }
      });
    }).catch(err => {
      this.dialog.open(DialogComponent, {
        data: { body: 'Lỗi: ' + (err && err.message ? err.message : JSON.stringify(err)) }
      });
    });
  }

  public regenerate() {
    // Re-trigger file input
    const fileInput = document.getElementById('braille-file-input') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.convertImageToBraille(img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}

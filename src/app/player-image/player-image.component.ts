import { Component } from '@angular/core';

@Component({
  selector: 'app-player-image',
  templateUrl: './player-image.component.html',
  styleUrls: ['./player-image.component.scss']
})
export class PlayerImageComponent {

  url: any = '';
  onSelectFile(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event:any) => {
        // called once readAsDataURL is completed
        this.url = event.target.result;
        console.log(this.url);
      };
    }
  }
  public delete() {
    this.url = null;
  }
}

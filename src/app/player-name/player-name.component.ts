import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/enviroment';
import { ActivatedRoute,Router } from '@angular/router';
@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss']
})
export class PlayerNameComponent {
  userName!:string
  constructor(private http:HttpClient,private active:ActivatedRoute,private route:Router){

  }
  submit(){
    let _id=this.active.snapshot.params['_id']
    if(this.userName){
      console.log(this.userName)
      let data = {
        userName:this.userName
      }
      this.http.patch(environment.baseUrl+'updatePlayerDetails/'+_id,data).subscribe((res:any)=>{
        console.log(res)
        if(res.status){
          this.route.navigate(['/','playerimage',_id])
        }
      })

    }
  }
}

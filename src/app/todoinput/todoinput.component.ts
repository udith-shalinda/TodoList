import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DataService } from "./data.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { List } from "../list.modle";
import { mimeType } from "./mime-type.validator";
import { Subscription } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { ProfileService } from '../profile/profile.service';
import { ProfileData } from '../profile/profile-module';


@Component({
  selector: "app-todoinput",
  templateUrl: "./todoinput.component.html",
  styleUrls: ["./todoinput.component.css"]
})
export class TodoinputComponent implements OnInit {
  todolist :FormGroup;
  private mode = 'Create';
  private postId:string;
  imagepre:any;
  private profileDetailsSub:Subscription;
  private profileDetails:ProfileData={
    id:"",
    name:"",
    address:"",
    email:"",
    mobile:'',
    university:"",
    creater:"" ,
    image:""
};



  constructor(
    private dataservice: DataService,
    private route: ActivatedRoute,
    private authservice: AuthService,
    private profileservice:ProfileService
  ) {}

  ngOnInit() {
    this.todolist = new FormGroup({
      'title':new FormControl(null),
      'comment':new FormControl(),
      'image':new FormControl(null,{validators:[Validators.required], asyncValidators:[mimeType]})
    })

    this.profileservice.getMyProfileDetails();
    this.profileDetailsSub = this.profileservice.passProfileDetails()
    .subscribe(result=>{
        this.profileDetails=result.profileDetails;
    });


    this.route.paramMap.subscribe((paramMap :ParamMap)=>{
      if(paramMap.has('id')){
        this.mode= 'Edit',
        this.postId=paramMap.get('id');
        this.dataservice.getPostForEdit(this.postId).subscribe(postdata=>{
          const list :List = {
            id:postdata._id,
            username:null,
            profileImage:null,
            title:postdata.title,
            comment:postdata.comment,
            imagePath:postdata.imagePath,
            creater:postdata.creater
          };
          this.todolist.setValue({'title':list.title,'comment':list.comment, 'image':list.imagePath});
          this.imagepre = list.imagePath;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
    
  }
  buttonClicked(){ 
    if(this.mode === 'create'){
      this.dataservice.pushdata(this.profileDetails.image,this.profileDetails.name,this.todolist.value.title,this.todolist.value.comment,this.todolist.value.image);
      this.todolist.reset();
    } else {
      this.dataservice.updatePost(
        this.profileDetails.image,
        this.profileDetails.name,
        this.postId,
        this.todolist.value.title,
        this.todolist.value.comment,
        this.todolist.value.image
      );
      this.todolist.reset();
    }
  }
  imagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.todolist.patchValue({ image: file });
    this.todolist.get("image").updateValueAndValidity();
    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent) => {
      const fr: FileReader = <FileReader>e.target;
      this.imagepre = fr.result;
    };
    reader.readAsDataURL(file);
  }
  
  ngOnDestroy(){
    this.profileDetailsSub.unsubscribe();
  }
  
}

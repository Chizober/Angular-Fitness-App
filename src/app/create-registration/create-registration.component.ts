import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit{
public packages: string[] =["Monthly","Quarterly","Yearly"];
public genders: string[] =["Male","Female"];
public importantList:string[] =[
  "Building lean muscle","Fitness","Toxic Fat rejection","Energy and Endurance","Sugar Craving Body","Healthier Digestive System"
];
  public registerForm!: FormGroup;
  public userIdToUpdate!: number;
  public isUpdateActive:boolean = false;

  constructor(private fb: FormBuilder, private api:ApiService, private toastService:NgToastService, private activatedRoute:ActivatedRoute,private router: Router)
  {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName:[''],
      lastName:[''],
      email:[''],
      mobile:[''],
      weight:[''],
      height:[''],
      bmi:[''],
      bmiResult:[''],
      gender:[''],
      requireTrainer:[''],
      package:[''],
      list:[''],
      gym:[''],
      enquiryDate:['']
    });
    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res);
    });
    this.activatedRoute.params.subscribe(val=>{
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe(res=>{
      this.isUpdateActive = true;  
this.fillFormToUpdate(res)
      })
    })
  }
  submit()
  {
    this.api.postRegistration(this.registerForm.value).subscribe(res=>{
      this.toastService.success({detail:"Success",summary:"Enquiry Added successfully", duration:3000});
      this.registerForm.reset();
    })
  }
  update()
  {
    this.api.updateRegisteredUsers(this.registerForm.value, this.userIdToUpdate).subscribe(res=>{
      this.toastService.success({detail:"Success",summary:"Enquiry Updated successfully", duration:3000});
      this.registerForm.reset();
      this.router.navigate(['list'])
    })
  }
  calculateBmi(heightValue:number) 
  {
    const weight = this.registerForm.value.weight;
    const height = heightValue;
    const bmi = weight/(height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch(true)
    {
     case bmi < 18.5:
      this.registerForm.controls['bmiResult'].patchValue("Underweight");
      break;
      
      case(bmi >= 18.5 && bmi < 25):
        this.registerForm.controls['bmiResult'].patchValue("Normal");
        break;

        case(bmi >= 25 && bmi < 30):
          this.registerForm.controls['bmiResult'].patchValue("Overweight");
          break;

          default:
            this.registerForm.controls['bmiResult'].patchValue("Obssessed");
            break;
    }
  }
  fillFormToUpdate(user: User)
  {
    this.registerForm.setValue({
      firstName:user.firstName,
      lastName:user.lastName,
      email:user.email,
      mobile:user.mobile,
      weight:user.weight,
      height:user.height,
      bmi:user.bmi,
      bmiResult:user.bmiResult,
      gender:user.gender,
      requireTrainer:user.requireTrainer,
      package:user.package,
      list:user.list,
      gym:user.gym,
      enquiryDate:user.enquiryDate
    })
  }
}

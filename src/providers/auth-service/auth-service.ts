import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserCred, User } from '../../shared/interfaces';
import firebase from 'firebase';
import { ImgHandlerProvider } from '../img-handler/img-handler';
import { MediatorProvider } from '../mediatorProvider'


let apiUrl = 'http://cdi.x10.mx/api/';
@Injectable()
export class AuthService {
  fireUserData = firebase.database().ref('/users');
  constructor(public imgHandler:ImgHandlerProvider, public afAuth:AngularFireAuth, public medProvid: MediatorProvider, public http:Http) {
    console.log('Hello AuthServiceProvider Provider');
  }

  postData(donnees, type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(apiUrl + type, JSON.stringify(donnees), {headers: headers})
      .subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });

  }

  login(creds:UserCred){
    let promise = new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(creds.email, creds.password).then(() => {
        this.getUserDetails().then((user:any)=>{
          user.displayName= user.firstName+" "+user.lastName;
          this.saveUserLocal(user);
          this.medProvid.saveLoggedinUser(user);
          //this.medProvid.subscribeToMessages();
          resolve(true);
        })
      }).catch((err) =>{
        console.log('Auth err', err)
       // reject(err);
      })
    });

    return promise;
  }
  saveUserLocal(user:User){
      localStorage.setItem('userData', JSON.stringify(user));
  }
  updateUserLocal(user:User){
      localStorage.setItem('userData', JSON.stringify(user));

  }
  getUserLocal(){
    return  JSON.parse(localStorage.getItem('userData'));
  }
  addUser(newUser){
    let promise = new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(newUser.email, newUser.password).then(() => {
        this.afAuth.auth.currentUser.updateProfile({
          displayName: newUser.first_name +' '+newUser.last_name,
          photoURL: 'default'
        }).then(() => {
          this.fireUserData.child(this.afAuth.auth.currentUser.uid).set({
            uid:this.afAuth.auth.currentUser.uid,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            displayName:newUser.first_name+" "+newUser.last_name,
            photoURL:'default',
            email: newUser.email
          }).then(() => {

            let user:User = {
              uid:this.afAuth.auth.currentUser.uid,
              firstName: newUser.first_name,
              lastName: newUser.last_name,
              displayName:newUser.first_name+" "+newUser.last_name,
              photoURL:'default',
              email: newUser.email
            }
            this.saveUserLocal(user);
            this.medProvid.saveRegisteredUser(user);
            
            resolve({success:true});
          }).catch((err) =>{
          
          })
        }).catch((err) =>{
                })
      }).catch((err) =>{
        console.log('Sign  err', err)
       reject(err);
      })
    });
    return promise;
  }

  resetPassword(email){
    let promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({success:true});
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updateImage(imageUrl){
    let promise = new Promise((resolve, reject) =>{
      this.afAuth.auth.currentUser.updateProfile({
        photoURL: imageUrl,
        displayName: this.afAuth.auth.currentUser.displayName
      }).then(() =>{
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
          var currentUser = snapshot.val();
          currentUser.photoURL=imageUrl;
          
          firebase.database().ref('/users/'+firebase.auth().currentUser.uid).update(currentUser).then(() => {
            resolve({ success: true });
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        }) ;

      })
    })
    return promise;
  }
  getUserDetails(){
    return new Promise((resolve, reject)=>{
      this.fireUserData.child(firebase.auth().currentUser.uid).once('value', (snapshot)=>{
        resolve(snapshot.val());
      }).catch((err)=>{
        reject(err);
      })
    });
  }

  updateUserProfilePicture(){
    return new Promise((resolve, reject)=>{
      this.imgHandler.uploadImage().then((uploadedUrl: any) =>{
        this.updateImage(uploadedUrl).then((res:any)=>{})
        resolve(uploadedUrl);
      });
    })  
  }

  editName(name){
    let promise = new Promise((resolve, reject) =>{
      this.afAuth.auth.currentUser.updateProfile({
        photoURL: this.afAuth.auth.currentUser.photoURL,
        displayName: name.firstName+" "+name.lastName
      }).then(() =>{
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
          var currentUser = snapshot.val();
          currentUser.firstName=name.firstName;
          currentUser.lastName = name.lastName;
          
          firebase.database().ref('/users/'+firebase.auth().currentUser.uid).update(currentUser).then(() => {
            resolve({ success: true });
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        }) ;

      })
    })
    return promise;
  }
  getAllUsers(){
    return new Promise((resolve, reject)=>{
      this.fireUserData.orderByChild('uid').once('value', (snapchot)=>{
        let usersData =snapchot.val();
        let temps = []
        for(let key in usersData){
          temps.push(usersData[key])
        }
        resolve(temps);
      }).catch((err)=>{
        reject(err);
      })
    });  
  }
}


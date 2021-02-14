import {Subscription} from 'rxjs'
export class SubscriptionContainer{

private subs:Subscription[]=[];

set add(s:Subscription){

    this.subs.push(s);
}

dispose(){
    this.subs.forEach(s=>{  
        console.log("Subscription",s);
        s.unsubscribe() ;})
}

}
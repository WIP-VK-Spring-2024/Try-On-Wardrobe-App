import { Centrifuge } from "centrifuge";
import { apiEndpoint, centrifugeEndpoint, login, password, staticEndpoint } from "../../config";
import { appState } from "../stores/AppState";
import { garmentStore } from "../stores/GarmentStore";
import { resultStore } from "../store";


export const loginFunc = async () => {
    const loginBody = {
        name: login,
        password: password
    }
  
    const response = await fetch(apiEndpoint + '/login', {
        method: 'POST',
        body: JSON.stringify(loginBody),
        headers: {
            'Content-Type': 'application/json',
        }
    })
  
    if (!response.ok) {
        console.error(response);
        return;
    }
  
    const json = await response.json();
  
    console.log(json);
  
    appState.login(json.token, json.user_id);
  
    const centrifuge = new Centrifuge(centrifugeEndpoint, {
        token: json.token
    });
    
    centrifuge.on('connecting', function(ctx) {
        console.log('connecting', ctx);
    });
    
    centrifuge.on('connected', function(ctx) {
        console.log('connected', ctx);
    });
    
    centrifuge.on('disconnected', function(ctx) {
        console.log('disconnected', ctx);
    });
    
    const processing_sub = centrifuge.newSubscription(`processing:user#${json.user_id}`);
    const try_on_sub = centrifuge.newSubscription(`try-on:user#${json.user_id}`);
  
    processing_sub.on('subscribing', function(ctx) {
        console.log('subscribing to processing');
    });
  
    processing_sub.on('subscribed', function(ctx) {
        console.log('subscribed to processing');
    });
  
    processing_sub.on('unsubscribed', function(ctx) {
        console.log('unsubscribed from porcessing');
    });
  
    try_on_sub.on('subscribing', function(ctx) {
        console.log('subscribing to try on');
    });
  
    try_on_sub.on('subscribed', function(ctx) {
        console.log('subscribed to try on');
    });
  
    try_on_sub.on('unsubscribed', function(ctx) {
        console.log('unsubscribed from try on');
    });
  
    processing_sub.on('publication', function(ctx) {
        console.log(ctx.data);

        garmentStore.garments.find(garment => garment.uuid === ctx.data.uuid)?.setImage({
            type: 'remote',
            uri: `/photos/${ctx.data.uuid}`
        })
    });
    
    try_on_sub.on('publication', function(ctx) {
        console.log(ctx.data);
        console.log(staticEndpoint + ctx.data.image)

        resultStore.setResultUrl(staticEndpoint + ctx.data.image);
        resultStore.setResultUUID(ctx.data.uuid);
    });
  
    processing_sub.on('error', function(ctx) {
      console.log("subscription error", ctx);
    });
    
    processing_sub.subscribe();
    try_on_sub.subscribe();
    
    centrifuge.connect();
}

import { Centrifuge, PublicationContext } from "centrifuge";
import { apiEndpoint, centrifugeEndpoint, login, password, staticEndpoint } from "../../config";
import { appState } from "../stores/AppState";
import { garmentStore } from "../stores/GarmentStore";
import { resultStore } from "../store";
import { runInAction } from "mobx";
import { outfitGenResutlStore, outfitGenUUIDStore } from "../stores/OutfitGenStores";

interface CentrifugeSubscriptionProps {
    connection: Centrifuge
    name: string,
    onPublication: (ctx: PublicationContext)=>void
}

const subsribeToChannel = (props: CentrifugeSubscriptionProps) => {
    const channel = props.connection.newSubscription(props.name);

    channel.on('subscribing', (ctx) => {
        console.log(`subscribing to ${props.name}`);
    });
  
    channel.on('subscribed', function(ctx) {
        console.log(`subscribed to ${props.name}`);
    });
  
    channel.on('unsubscribed', function(ctx) {
        console.log(`unsubscribed from ${props.name}`);
    });

    channel.on('error', ctx => {
        console.log(`error in ${props.name}`, ctx);
    })

    channel.on('publication', props.onPublication);

    channel.subscribe();
    return channel;
}

export const loginFunc = async () => {
    const loginBody = {
        name: login,
        password: password
    }
  
    const response = await fetch(apiEndpoint + 'login', {
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
    
    const processing_sub = subsribeToChannel({
        connection: centrifuge,
        name: `processing:user#${json.user_id}`,
        onPublication: ctx => {
            console.log('processing', ctx.data);

            const garment = garmentStore.getGarmentByUUID(ctx.data.uuid);
    
            if (garment === undefined) {
                console.error(`garment with uuid ${ctx.data.uuid} does not exist`);
                return false;
            }
    
            const type = garmentStore.getTypeByUUID(ctx.data.classification.type);
            const subtype = garmentStore.getSubTypeByUUID(ctx.data.classification.subtype);
            const style = garmentStore.getStyleByUUID(ctx.data.classification.style);
            const tags = ctx.data.classification.tags;
            const seasons = ctx.data.classification.seasons;
            
            
            runInAction(() => {
                garment.image = {
                    type: 'remote',
                    uri: ctx.data.image
                }
    
                if (type === undefined) {
                    console.log(`type with uuid ${ctx.data.classification.type} does not exist`)
                } else {
                    garment.type = type;
                }
    
                if (subtype === undefined) {
                    console.log(`subtype with uuid ${ctx.data.classification.subtype} does not exist`)
                } else {
                    garment.subtype = subtype;
                }
    
                if (style === undefined) {
                    console.log(`style with uuid ${ctx.data.classification.style} does not exist`)
                } else {
                    garment.style = style;
                }
                garment.tags = tags;
                garment.seasons = seasons;
                garment.tryOnAble = ctx.data.tryonable;
            })
        }
    });

    const try_on_sub = subsribeToChannel({
        connection: centrifuge,
        name: `try-on:user#${json.user_id}`,
        onPublication: ctx => {
            resultStore.setResultUrl(staticEndpoint + ctx.data.image);
            resultStore.setResultUUID(ctx.data.uuid);
        }
    });

    const outfit_gen = subsribeToChannel({
        connection: centrifuge,
        name: `outfit-gen:user#${json.user_id}`,
        onPublication: ctx => {
            const outfits = ctx.data.outfits.map((outfit: {clothes: {clothes_id: string}[]}) => 
                outfit.clothes.map(c => c.clothes_id))
            
            outfitGenUUIDStore.setOutfits(outfits);
        }
    });
    
    centrifuge.connect();
}

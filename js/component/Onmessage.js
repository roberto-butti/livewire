import MethodAction from '@/action/method'
import { wireDirectives } from '@/util'
import store from '@/Store'

export default function () {
    const directiveName = 'onmessage';
    const pusherKey = '';
    const pusherCluster = 'mt1';
    const pusherChannel = 'my-channel';
    const pusherEvent = 'my-event';


    store.registerHook('element.initialized', (el, component) => {
        let directives = wireDirectives(el)
        if (directives.missing(directiveName)) return
        let onmesssage = directives.get(directiveName);
        //Pusher.logToConsole = true;
        var pusher = new Pusher(pusherKey, {
            cluster: pusherCluster
        });

        var channel = pusher.subscribe(pusherChannel);
        channel.bind(pusherEvent, function (data) {
            //alert(JSON.stringify(data));
            const directive = directives.get(directiveName)

            const method = directive.method || '$refresh'

            component.addAction(new MethodAction(method, directive.params, el))
        });
        //let intervalId = fireActionOnInterval(el, component)

        component.addListenerForTeardown(() => {
            //clearInterval(intervalId)
        })

        //el.__livewire_polling_interval = intervalId
    })

    store.registerHook('element.updating', (from, to, component) => {
        if (from.__livewire_polling_interval !== undefined) return

        if (wireDirectives(from).missing(directiveName) && wireDirectives(to).has(directiveName)) {

        }
    })
}

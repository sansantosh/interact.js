import InteractEvent from '@interactjs/core/InteractEvent';
import { ActionName } from '@interactjs/core/scope';
import * as utils from '@interactjs/utils';
ActionName.Gesture = 'gesture';
function install(scope) {
    const { actions, Interactable, interactions, defaults, } = scope;
    /**
     * ```js
     * interact(element).gesturable({
     *     onstart: function (event) {},
     *     onmove : function (event) {},
     *     onend  : function (event) {},
     *
     *     // limit multiple gestures.
     *     // See the explanation in {@link Interactable.draggable} example
     *     max: Infinity,
     *     maxPerElement: 1,
     * });
     *
     * var isGestureable = interact(element).gesturable();
     * ```
     *
     * Gets or sets whether multitouch gestures can be performed on the target
     *
     * @param {boolean | object} [options] true/false or An object with event
     * listeners to be fired on gesture events (makes the Interactable gesturable)
     * @return {boolean | Interactable} A boolean indicating if this can be the
     * target of gesture events, or this Interactable
     */
    Interactable.prototype.gesturable = function (options) {
        if (utils.is.object(options)) {
            this.options.gesture.enabled = options.enabled !== false;
            this.setPerAction('gesture', options);
            this.setOnEvents('gesture', options);
            return this;
        }
        if (utils.is.bool(options)) {
            this.options.gesture.enabled = options;
            return this;
        }
        return this.options.gesture;
    };
    interactions.signals.on('action-start', updateGestureProps);
    interactions.signals.on('action-move', updateGestureProps);
    interactions.signals.on('action-end', updateGestureProps);
    interactions.signals.on('new', ({ interaction }) => {
        interaction.gesture = {
            angle: 0,
            distance: 0,
            scale: 1,
            startAngle: 0,
            startDistance: 0,
        };
    });
    actions[ActionName.Gesture] = gesture;
    actions.names.push(ActionName.Gesture);
    utils.arr.merge(actions.eventTypes, [
        'gesturestart',
        'gesturemove',
        'gestureend',
    ]);
    actions.methodDict.gesture = 'gesturable';
    defaults.actions.gesture = gesture.defaults;
}
const gesture = {
    install,
    defaults: {},
    checker(_pointer, _event, _interactable, _element, interaction) {
        if (interaction.pointers.length >= 2) {
            return { name: 'gesture' };
        }
        return null;
    },
    getCursor() {
        return '';
    },
};
function updateGestureProps({ interaction, iEvent, event, phase }) {
    if (interaction.prepared.name !== 'gesture') {
        return;
    }
    const pointers = interaction.pointers.map((p) => p.pointer);
    const starting = phase === 'start';
    const ending = phase === 'end';
    const deltaSource = interaction.interactable.options.deltaSource;
    iEvent.touches = [pointers[0], pointers[1]];
    if (starting) {
        iEvent.distance = utils.pointer.touchDistance(pointers, deltaSource);
        iEvent.box = utils.pointer.touchBBox(pointers);
        iEvent.scale = 1;
        iEvent.ds = 0;
        iEvent.angle = utils.pointer.touchAngle(pointers, deltaSource);
        iEvent.da = 0;
        interaction.gesture.startDistance = iEvent.distance;
        interaction.gesture.startAngle = iEvent.angle;
    }
    else if (ending || event instanceof InteractEvent) {
        const prevEvent = interaction.prevEvent;
        iEvent.distance = prevEvent.distance;
        iEvent.box = prevEvent.box;
        iEvent.scale = prevEvent.scale;
        iEvent.ds = 0;
        iEvent.angle = prevEvent.angle;
        iEvent.da = 0;
    }
    else {
        iEvent.distance = utils.pointer.touchDistance(pointers, deltaSource);
        iEvent.box = utils.pointer.touchBBox(pointers);
        iEvent.scale = iEvent.distance / interaction.gesture.startDistance;
        iEvent.angle = utils.pointer.touchAngle(pointers, deltaSource);
        iEvent.ds = iEvent.scale - interaction.gesture.scale;
        iEvent.da = iEvent.angle - interaction.gesture.angle;
    }
    interaction.gesture.distance = iEvent.distance;
    interaction.gesture.angle = iEvent.angle;
    interaction.gesture.scale = iEvent.scale;
    if (utils.is.number(iEvent.scale) &&
        iEvent.scale !== Infinity &&
        !isNaN(iEvent.scale)) {
        interaction.gesture.scale = iEvent.scale;
    }
}
export default gesture;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VzdHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdlc3R1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxhQUFhLE1BQU0sZ0NBQWdDLENBQUE7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzFELE9BQU8sS0FBSyxLQUFLLE1BQU0sbUJBQW1CLENBQUE7QUF1Q3pDLFVBQWtCLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQTtBQWtCdkMsU0FBUyxPQUFPLENBQUUsS0FBWTtJQUM1QixNQUFNLEVBQ0osT0FBTyxFQUNQLFlBQVksRUFDWixZQUFZLEVBQ1osUUFBUSxHQUNULEdBQUcsS0FBSyxDQUFBO0lBRVQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FzQkc7SUFDSCxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUF1QyxPQUE2QztRQUN0SCxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQTtZQUN4RCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUVwQyxPQUFPLElBQUksQ0FBQTtTQUNaO1FBRUQsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1lBRXRDLE9BQU8sSUFBSSxDQUFBO1NBQ1o7UUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBMkIsQ0FBQTtJQUNqRCxDQUFxQixDQUFBO0lBRXJCLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO0lBQzNELFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO0lBQzFELFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO0lBRXpELFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRTtRQUNqRCxXQUFXLENBQUMsT0FBTyxHQUFHO1lBQ3BCLEtBQUssRUFBRSxDQUFDO1lBQ1IsUUFBUSxFQUFFLENBQUM7WUFDWCxLQUFLLEVBQUUsQ0FBQztZQUNSLFVBQVUsRUFBRSxDQUFDO1lBQ2IsYUFBYSxFQUFFLENBQUM7U0FDakIsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0lBRUYsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUE7SUFDckMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3RDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7UUFDbEMsY0FBYztRQUNkLGFBQWE7UUFDYixZQUFZO0tBQ2IsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFBO0lBRXpDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7QUFDN0MsQ0FBQztBQUVELE1BQU0sT0FBTyxHQUFHO0lBQ2QsT0FBTztJQUNQLFFBQVEsRUFBRSxFQUNUO0lBRUQsT0FBTyxDQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxXQUErQztRQUNqRyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNwQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFBO1NBQzNCO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sRUFBRSxDQUFBO0lBQ1gsQ0FBQztDQUNGLENBQUE7QUFFRCxTQUFTLGtCQUFrQixDQUFFLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFvQjtJQUNsRixJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUFFLE9BQU07S0FBRTtJQUV2RCxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzNELE1BQU0sUUFBUSxHQUFHLEtBQUssS0FBSyxPQUFPLENBQUE7SUFDbEMsTUFBTSxNQUFNLEdBQUcsS0FBSyxLQUFLLEtBQUssQ0FBQTtJQUM5QixNQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUE7SUFFaEUsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUUzQyxJQUFJLFFBQVEsRUFBRTtRQUNaLE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBQ3BFLE1BQU0sQ0FBQyxHQUFHLEdBQVEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDbkQsTUFBTSxDQUFDLEtBQUssR0FBTSxDQUFDLENBQUE7UUFDbkIsTUFBTSxDQUFDLEVBQUUsR0FBUyxDQUFDLENBQUE7UUFDbkIsTUFBTSxDQUFDLEtBQUssR0FBTSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFDakUsTUFBTSxDQUFDLEVBQUUsR0FBUyxDQUFDLENBQUE7UUFFbkIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQTtRQUNuRCxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFBO0tBQzlDO1NBQ0ksSUFBSSxNQUFNLElBQUksS0FBSyxZQUFZLGFBQWEsRUFBRTtRQUNqRCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBeUIsQ0FBQTtRQUV2RCxNQUFNLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUE7UUFDcEMsTUFBTSxDQUFDLEdBQUcsR0FBUSxTQUFTLENBQUMsR0FBRyxDQUFBO1FBQy9CLE1BQU0sQ0FBQyxLQUFLLEdBQU0sU0FBUyxDQUFDLEtBQUssQ0FBQTtRQUNqQyxNQUFNLENBQUMsRUFBRSxHQUFTLENBQUMsQ0FBQTtRQUNuQixNQUFNLENBQUMsS0FBSyxHQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUE7UUFDakMsTUFBTSxDQUFDLEVBQUUsR0FBUyxDQUFDLENBQUE7S0FDcEI7U0FDSTtRQUNILE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBQ3BFLE1BQU0sQ0FBQyxHQUFHLEdBQVEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDbkQsTUFBTSxDQUFDLEtBQUssR0FBTSxNQUFNLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFBO1FBQ3JFLE1BQU0sQ0FBQyxLQUFLLEdBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBRWpFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQTtRQUNwRCxNQUFNLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUE7S0FDckQ7SUFFRCxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFBO0lBQzlDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDeEMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUV4QyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDN0IsTUFBTSxDQUFDLEtBQUssS0FBSyxRQUFRO1FBQ3pCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4QixXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFBO0tBQ3pDO0FBQ0gsQ0FBQztBQUVELGVBQWUsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEludGVyYWN0RXZlbnQgZnJvbSAnQGludGVyYWN0anMvY29yZS9JbnRlcmFjdEV2ZW50J1xuaW1wb3J0IHsgQWN0aW9uTmFtZSwgU2NvcGUgfSBmcm9tICdAaW50ZXJhY3Rqcy9jb3JlL3Njb3BlJ1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnQGludGVyYWN0anMvdXRpbHMnXG5cbmV4cG9ydCB0eXBlIEdlc3R1cmFibGVNZXRob2QgPSBJbnRlcmFjdC5BY3Rpb25NZXRob2Q8SW50ZXJhY3QuR2VzdHVyYWJsZU9wdGlvbnM+XG5cbmRlY2xhcmUgbW9kdWxlICdAaW50ZXJhY3Rqcy9jb3JlL0ludGVyYWN0aW9uJyB7XG4gIGludGVyZmFjZSBJbnRlcmFjdGlvbiB7XG4gICAgZ2VzdHVyZT86IHtcbiAgICAgIGFuZ2xlOiBudW1iZXIsICAgICAgICAgIC8vIGFuZ2xlIGZyb20gZmlyc3QgdG8gc2Vjb25kIHRvdWNoXG4gICAgICBkaXN0YW5jZTogbnVtYmVyLFxuICAgICAgc2NhbGU6IG51bWJlciwgICAgICAgICAgLy8gZ2VzdHVyZS5kaXN0YW5jZSAvIGdlc3R1cmUuc3RhcnREaXN0YW5jZVxuICAgICAgc3RhcnRBbmdsZTogbnVtYmVyLCAgICAgLy8gYW5nbGUgb2YgbGluZSBqb2luaW5nIHR3byB0b3VjaGVzXG4gICAgICBzdGFydERpc3RhbmNlOiBudW1iZXIsICAvLyBkaXN0YW5jZSBiZXR3ZWVuIHR3byB0b3VjaGVzIG9mIHRvdWNoU3RhcnRcbiAgICB9XG4gIH1cbn1cblxuZGVjbGFyZSBtb2R1bGUgJ0BpbnRlcmFjdGpzL2NvcmUvSW50ZXJhY3RhYmxlJyB7XG4gIGludGVyZmFjZSBJbnRlcmFjdGFibGUge1xuICAgIGdlc3R1cmFibGU6IEdlc3R1cmFibGVNZXRob2RcbiAgfVxufVxuXG5kZWNsYXJlIG1vZHVsZSAnQGludGVyYWN0anMvY29yZS9kZWZhdWx0T3B0aW9ucycge1xuICBpbnRlcmZhY2UgQWN0aW9uRGVmYXVsdHMge1xuICAgIGdlc3R1cmU6IEludGVyYWN0Lkdlc3R1cmFibGVPcHRpb25zXG4gIH1cbn1cblxuZGVjbGFyZSBtb2R1bGUgJ0BpbnRlcmFjdGpzL2NvcmUvc2NvcGUnIHtcbiAgaW50ZXJmYWNlIEFjdGlvbnMge1xuICAgIFtBY3Rpb25OYW1lLkdlc3R1cmVdPzogdHlwZW9mIGdlc3R1cmVcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgZW51bSBBY3Rpb25OYW1lIHtcbiAgICBHZXN0dXJlID0gJ2dlc3R1cmUnXG4gIH1cbn1cblxuKEFjdGlvbk5hbWUgYXMgYW55KS5HZXN0dXJlID0gJ2dlc3R1cmUnXG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VzdHVyZUV2ZW50IGV4dGVuZHMgSW50ZXJhY3QuSW50ZXJhY3RFdmVudDxBY3Rpb25OYW1lLkdlc3R1cmU+IHtcbiAgZGlzdGFuY2U6IG51bWJlclxuICBhbmdsZTogbnVtYmVyXG4gIGRhOiBudW1iZXIgLy8gYW5nbGUgY2hhbmdlXG4gIHNjYWxlOiBudW1iZXIgLy8gcmF0aW8gb2YgZGlzdGFuY2Ugc3RhcnQgdG8gY3VycmVudCBldmVudFxuICBkczogbnVtYmVyIC8vIHNjYWxlIGNoYW5nZVxuICBib3g6IEludGVyYWN0LlJlY3QgLy8gZW5jbG9zaW5nIGJveCBvZiBhbGwgcG9pbnRzXG4gIHRvdWNoZXM6IEludGVyYWN0LlBvaW50ZXJUeXBlW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXN0dXJlU2lnbmFsQXJnIGV4dGVuZHMgSW50ZXJhY3QuU2lnbmFsQXJnIHtcbiAgaUV2ZW50OiBHZXN0dXJlRXZlbnRcbiAgaW50ZXJhY3Rpb246IEludGVyYWN0LkludGVyYWN0aW9uPEFjdGlvbk5hbWUuR2VzdHVyZT5cbiAgZXZlbnQ6IEludGVyYWN0LlBvaW50ZXJFdmVudFR5cGUgfCBHZXN0dXJlRXZlbnRcbn1cblxuZnVuY3Rpb24gaW5zdGFsbCAoc2NvcGU6IFNjb3BlKSB7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb25zLFxuICAgIEludGVyYWN0YWJsZSxcbiAgICBpbnRlcmFjdGlvbnMsXG4gICAgZGVmYXVsdHMsXG4gIH0gPSBzY29wZVxuXG4gIC8qKlxuICAgKiBgYGBqc1xuICAgKiBpbnRlcmFjdChlbGVtZW50KS5nZXN0dXJhYmxlKHtcbiAgICogICAgIG9uc3RhcnQ6IGZ1bmN0aW9uIChldmVudCkge30sXG4gICAqICAgICBvbm1vdmUgOiBmdW5jdGlvbiAoZXZlbnQpIHt9LFxuICAgKiAgICAgb25lbmQgIDogZnVuY3Rpb24gKGV2ZW50KSB7fSxcbiAgICpcbiAgICogICAgIC8vIGxpbWl0IG11bHRpcGxlIGdlc3R1cmVzLlxuICAgKiAgICAgLy8gU2VlIHRoZSBleHBsYW5hdGlvbiBpbiB7QGxpbmsgSW50ZXJhY3RhYmxlLmRyYWdnYWJsZX0gZXhhbXBsZVxuICAgKiAgICAgbWF4OiBJbmZpbml0eSxcbiAgICogICAgIG1heFBlckVsZW1lbnQ6IDEsXG4gICAqIH0pO1xuICAgKlxuICAgKiB2YXIgaXNHZXN0dXJlYWJsZSA9IGludGVyYWN0KGVsZW1lbnQpLmdlc3R1cmFibGUoKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEdldHMgb3Igc2V0cyB3aGV0aGVyIG11bHRpdG91Y2ggZ2VzdHVyZXMgY2FuIGJlIHBlcmZvcm1lZCBvbiB0aGUgdGFyZ2V0XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbiB8IG9iamVjdH0gW29wdGlvbnNdIHRydWUvZmFsc2Ugb3IgQW4gb2JqZWN0IHdpdGggZXZlbnRcbiAgICogbGlzdGVuZXJzIHRvIGJlIGZpcmVkIG9uIGdlc3R1cmUgZXZlbnRzIChtYWtlcyB0aGUgSW50ZXJhY3RhYmxlIGdlc3R1cmFibGUpXG4gICAqIEByZXR1cm4ge2Jvb2xlYW4gfCBJbnRlcmFjdGFibGV9IEEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoaXMgY2FuIGJlIHRoZVxuICAgKiB0YXJnZXQgb2YgZ2VzdHVyZSBldmVudHMsIG9yIHRoaXMgSW50ZXJhY3RhYmxlXG4gICAqL1xuICBJbnRlcmFjdGFibGUucHJvdG90eXBlLmdlc3R1cmFibGUgPSBmdW5jdGlvbiAodGhpczogSW50ZXJhY3QuSW50ZXJhY3RhYmxlLCBvcHRpb25zOiBJbnRlcmFjdC5HZXN0dXJhYmxlT3B0aW9ucyB8IGJvb2xlYW4pIHtcbiAgICBpZiAodXRpbHMuaXMub2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZ2VzdHVyZS5lbmFibGVkID0gb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZVxuICAgICAgdGhpcy5zZXRQZXJBY3Rpb24oJ2dlc3R1cmUnLCBvcHRpb25zKVxuICAgICAgdGhpcy5zZXRPbkV2ZW50cygnZ2VzdHVyZScsIG9wdGlvbnMpXG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzLmJvb2wob3B0aW9ucykpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5nZXN0dXJlLmVuYWJsZWQgPSBvcHRpb25zXG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5nZXN0dXJlIGFzIEludGVyYWN0Lk9wdGlvbnNcbiAgfSBhcyBHZXN0dXJhYmxlTWV0aG9kXG5cbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2FjdGlvbi1zdGFydCcsIHVwZGF0ZUdlc3R1cmVQcm9wcylcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2FjdGlvbi1tb3ZlJywgdXBkYXRlR2VzdHVyZVByb3BzKVxuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYWN0aW9uLWVuZCcsIHVwZGF0ZUdlc3R1cmVQcm9wcylcblxuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignbmV3JywgKHsgaW50ZXJhY3Rpb24gfSkgPT4ge1xuICAgIGludGVyYWN0aW9uLmdlc3R1cmUgPSB7XG4gICAgICBhbmdsZTogMCxcbiAgICAgIGRpc3RhbmNlOiAwLFxuICAgICAgc2NhbGU6IDEsXG4gICAgICBzdGFydEFuZ2xlOiAwLFxuICAgICAgc3RhcnREaXN0YW5jZTogMCxcbiAgICB9XG4gIH0pXG5cbiAgYWN0aW9uc1tBY3Rpb25OYW1lLkdlc3R1cmVdID0gZ2VzdHVyZVxuICBhY3Rpb25zLm5hbWVzLnB1c2goQWN0aW9uTmFtZS5HZXN0dXJlKVxuICB1dGlscy5hcnIubWVyZ2UoYWN0aW9ucy5ldmVudFR5cGVzLCBbXG4gICAgJ2dlc3R1cmVzdGFydCcsXG4gICAgJ2dlc3R1cmVtb3ZlJyxcbiAgICAnZ2VzdHVyZWVuZCcsXG4gIF0pXG4gIGFjdGlvbnMubWV0aG9kRGljdC5nZXN0dXJlID0gJ2dlc3R1cmFibGUnXG5cbiAgZGVmYXVsdHMuYWN0aW9ucy5nZXN0dXJlID0gZ2VzdHVyZS5kZWZhdWx0c1xufVxuXG5jb25zdCBnZXN0dXJlID0ge1xuICBpbnN0YWxsLFxuICBkZWZhdWx0czoge1xuICB9LFxuXG4gIGNoZWNrZXIgKF9wb2ludGVyLCBfZXZlbnQsIF9pbnRlcmFjdGFibGUsIF9lbGVtZW50LCBpbnRlcmFjdGlvbjogeyBwb2ludGVyczogeyBsZW5ndGg6IG51bWJlcjsgfTsgfSkge1xuICAgIGlmIChpbnRlcmFjdGlvbi5wb2ludGVycy5sZW5ndGggPj0gMikge1xuICAgICAgcmV0dXJuIHsgbmFtZTogJ2dlc3R1cmUnIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9LFxuXG4gIGdldEN1cnNvciAoKSB7XG4gICAgcmV0dXJuICcnXG4gIH0sXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUdlc3R1cmVQcm9wcyAoeyBpbnRlcmFjdGlvbiwgaUV2ZW50LCBldmVudCwgcGhhc2UgfTogR2VzdHVyZVNpZ25hbEFyZykge1xuICBpZiAoaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSAhPT0gJ2dlc3R1cmUnKSB7IHJldHVybiB9XG5cbiAgY29uc3QgcG9pbnRlcnMgPSBpbnRlcmFjdGlvbi5wb2ludGVycy5tYXAoKHApID0+IHAucG9pbnRlcilcbiAgY29uc3Qgc3RhcnRpbmcgPSBwaGFzZSA9PT0gJ3N0YXJ0J1xuICBjb25zdCBlbmRpbmcgPSBwaGFzZSA9PT0gJ2VuZCdcbiAgY29uc3QgZGVsdGFTb3VyY2UgPSBpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGUub3B0aW9ucy5kZWx0YVNvdXJjZVxuXG4gIGlFdmVudC50b3VjaGVzID0gW3BvaW50ZXJzWzBdLCBwb2ludGVyc1sxXV1cblxuICBpZiAoc3RhcnRpbmcpIHtcbiAgICBpRXZlbnQuZGlzdGFuY2UgPSB1dGlscy5wb2ludGVyLnRvdWNoRGlzdGFuY2UocG9pbnRlcnMsIGRlbHRhU291cmNlKVxuICAgIGlFdmVudC5ib3ggICAgICA9IHV0aWxzLnBvaW50ZXIudG91Y2hCQm94KHBvaW50ZXJzKVxuICAgIGlFdmVudC5zY2FsZSAgICA9IDFcbiAgICBpRXZlbnQuZHMgICAgICAgPSAwXG4gICAgaUV2ZW50LmFuZ2xlICAgID0gdXRpbHMucG9pbnRlci50b3VjaEFuZ2xlKHBvaW50ZXJzLCBkZWx0YVNvdXJjZSlcbiAgICBpRXZlbnQuZGEgICAgICAgPSAwXG5cbiAgICBpbnRlcmFjdGlvbi5nZXN0dXJlLnN0YXJ0RGlzdGFuY2UgPSBpRXZlbnQuZGlzdGFuY2VcbiAgICBpbnRlcmFjdGlvbi5nZXN0dXJlLnN0YXJ0QW5nbGUgPSBpRXZlbnQuYW5nbGVcbiAgfVxuICBlbHNlIGlmIChlbmRpbmcgfHwgZXZlbnQgaW5zdGFuY2VvZiBJbnRlcmFjdEV2ZW50KSB7XG4gICAgY29uc3QgcHJldkV2ZW50ID0gaW50ZXJhY3Rpb24ucHJldkV2ZW50IGFzIEdlc3R1cmVFdmVudFxuXG4gICAgaUV2ZW50LmRpc3RhbmNlID0gcHJldkV2ZW50LmRpc3RhbmNlXG4gICAgaUV2ZW50LmJveCAgICAgID0gcHJldkV2ZW50LmJveFxuICAgIGlFdmVudC5zY2FsZSAgICA9IHByZXZFdmVudC5zY2FsZVxuICAgIGlFdmVudC5kcyAgICAgICA9IDBcbiAgICBpRXZlbnQuYW5nbGUgICAgPSBwcmV2RXZlbnQuYW5nbGVcbiAgICBpRXZlbnQuZGEgICAgICAgPSAwXG4gIH1cbiAgZWxzZSB7XG4gICAgaUV2ZW50LmRpc3RhbmNlID0gdXRpbHMucG9pbnRlci50b3VjaERpc3RhbmNlKHBvaW50ZXJzLCBkZWx0YVNvdXJjZSlcbiAgICBpRXZlbnQuYm94ICAgICAgPSB1dGlscy5wb2ludGVyLnRvdWNoQkJveChwb2ludGVycylcbiAgICBpRXZlbnQuc2NhbGUgICAgPSBpRXZlbnQuZGlzdGFuY2UgLyBpbnRlcmFjdGlvbi5nZXN0dXJlLnN0YXJ0RGlzdGFuY2VcbiAgICBpRXZlbnQuYW5nbGUgICAgPSB1dGlscy5wb2ludGVyLnRvdWNoQW5nbGUocG9pbnRlcnMsIGRlbHRhU291cmNlKVxuXG4gICAgaUV2ZW50LmRzID0gaUV2ZW50LnNjYWxlIC0gaW50ZXJhY3Rpb24uZ2VzdHVyZS5zY2FsZVxuICAgIGlFdmVudC5kYSA9IGlFdmVudC5hbmdsZSAtIGludGVyYWN0aW9uLmdlc3R1cmUuYW5nbGVcbiAgfVxuXG4gIGludGVyYWN0aW9uLmdlc3R1cmUuZGlzdGFuY2UgPSBpRXZlbnQuZGlzdGFuY2VcbiAgaW50ZXJhY3Rpb24uZ2VzdHVyZS5hbmdsZSA9IGlFdmVudC5hbmdsZVxuICBpbnRlcmFjdGlvbi5nZXN0dXJlLnNjYWxlID0gaUV2ZW50LnNjYWxlXG5cbiAgaWYgKHV0aWxzLmlzLm51bWJlcihpRXZlbnQuc2NhbGUpICYmXG4gICAgICBpRXZlbnQuc2NhbGUgIT09IEluZmluaXR5ICYmXG4gICAgICAhaXNOYU4oaUV2ZW50LnNjYWxlKSkge1xuICAgIGludGVyYWN0aW9uLmdlc3R1cmUuc2NhbGUgPSBpRXZlbnQuc2NhbGVcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZXN0dXJlXG4iXX0=
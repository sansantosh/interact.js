import * as utils from './index';
const finder = {
    methodOrder: ['simulationResume', 'mouseOrPen', 'hasPointer', 'idle'],
    search(details) {
        for (const method of finder.methodOrder) {
            const interaction = finder[method](details);
            if (interaction) {
                return interaction;
            }
        }
    },
    // try to resume simulation with a new pointer
    simulationResume({ pointerType, eventType, eventTarget, scope }) {
        if (!/down|start/i.test(eventType)) {
            return null;
        }
        for (const interaction of scope.interactions.list) {
            let element = eventTarget;
            if (interaction.simulation && interaction.simulation.allowResume &&
                (interaction.pointerType === pointerType)) {
                while (element) {
                    // if the element is the interaction element
                    if (element === interaction.element) {
                        return interaction;
                    }
                    element = utils.dom.parentNode(element);
                }
            }
        }
        return null;
    },
    // if it's a mouse or pen interaction
    mouseOrPen({ pointerId, pointerType, eventType, scope }) {
        if (pointerType !== 'mouse' && pointerType !== 'pen') {
            return null;
        }
        let firstNonActive;
        for (const interaction of scope.interactions.list) {
            if (interaction.pointerType === pointerType) {
                // if it's a down event, skip interactions with running simulations
                if (interaction.simulation && !hasPointerId(interaction, pointerId)) {
                    continue;
                }
                // if the interaction is active, return it immediately
                if (interaction.interacting()) {
                    return interaction;
                }
                // otherwise save it and look for another active interaction
                else if (!firstNonActive) {
                    firstNonActive = interaction;
                }
            }
        }
        // if no active mouse interaction was found use the first inactive mouse
        // interaction
        if (firstNonActive) {
            return firstNonActive;
        }
        // find any mouse or pen interaction.
        // ignore the interaction if the eventType is a *down, and a simulation
        // is active
        for (const interaction of scope.interactions.list) {
            if (interaction.pointerType === pointerType && !(/down/i.test(eventType) && interaction.simulation)) {
                return interaction;
            }
        }
        return null;
    },
    // get interaction that has this pointer
    hasPointer({ pointerId, scope }) {
        for (const interaction of scope.interactions.list) {
            if (hasPointerId(interaction, pointerId)) {
                return interaction;
            }
        }
        return null;
    },
    // get first idle interaction with a matching pointerType
    idle({ pointerType, scope }) {
        for (const interaction of scope.interactions.list) {
            // if there's already a pointer held down
            if (interaction.pointers.length === 1) {
                const target = interaction.interactable;
                // don't add this pointer if there is a target interactable and it
                // isn't gesturable
                if (target && !target.options.gesture.enabled) {
                    continue;
                }
            }
            // maximum of 2 pointers per interaction
            else if (interaction.pointers.length >= 2) {
                continue;
            }
            if (!interaction.interacting() && (pointerType === interaction.pointerType)) {
                return interaction;
            }
        }
        return null;
    },
};
function hasPointerId(interaction, pointerId) {
    return utils.arr.some(interaction.pointers, ({ id }) => id === pointerId);
}
export default finder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJhY3Rpb25GaW5kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlcmFjdGlvbkZpbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssS0FBSyxNQUFNLFNBQVMsQ0FBQTtBQVloQyxNQUFNLE1BQU0sR0FBRztJQUNiLFdBQVcsRUFBRSxDQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFFO0lBRXZFLE1BQU0sQ0FBRSxPQUFPO1FBQ2IsS0FBSyxNQUFNLE1BQU0sSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO1lBQ3ZDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUUzQyxJQUFJLFdBQVcsRUFBRTtnQkFDZixPQUFPLFdBQVcsQ0FBQTthQUNuQjtTQUNGO0lBQ0gsQ0FBQztJQUVELDhDQUE4QztJQUM5QyxnQkFBZ0IsQ0FBRSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBaUI7UUFDN0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUE7U0FDWjtRQUVELEtBQUssTUFBTSxXQUFXLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUU7WUFDakQsSUFBSSxPQUFPLEdBQUcsV0FBVyxDQUFBO1lBRXpCLElBQUksV0FBVyxDQUFDLFVBQVUsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDLFdBQVc7Z0JBQzVELENBQUMsV0FBVyxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsRUFBRTtnQkFDN0MsT0FBTyxPQUFPLEVBQUU7b0JBQ2QsNENBQTRDO29CQUM1QyxJQUFJLE9BQU8sS0FBSyxXQUFXLENBQUMsT0FBTyxFQUFFO3dCQUNuQyxPQUFPLFdBQVcsQ0FBQTtxQkFDbkI7b0JBQ0QsT0FBTyxHQUFHLEtBQUssQ0FBQyxH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QUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFBO0FBQzNFLENBQUM7QUFFRCxlQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vaW5kZXgnXG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VhcmNoRGV0YWlscyB7XG4gIHBvaW50ZXI6IEludGVyYWN0LlBvaW50ZXJUeXBlXG4gIHBvaW50ZXJJZDogbnVtYmVyXG4gIHBvaW50ZXJUeXBlOiBzdHJpbmdcbiAgZXZlbnRUeXBlOiBzdHJpbmdcbiAgZXZlbnRUYXJnZXQ6IEludGVyYWN0LkV2ZW50VGFyZ2V0XG4gIGN1ckV2ZW50VGFyZ2V0OiBJbnRlcmFjdC5FdmVudFRhcmdldFxuICBzY29wZTogSW50ZXJhY3QuU2NvcGVcbn1cblxuY29uc3QgZmluZGVyID0ge1xuICBtZXRob2RPcmRlcjogWyAnc2ltdWxhdGlvblJlc3VtZScsICdtb3VzZU9yUGVuJywgJ2hhc1BvaW50ZXInLCAnaWRsZScgXSxcblxuICBzZWFyY2ggKGRldGFpbHMpIHtcbiAgICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBmaW5kZXIubWV0aG9kT3JkZXIpIHtcbiAgICAgIGNvbnN0IGludGVyYWN0aW9uID0gZmluZGVyW21ldGhvZF0oZGV0YWlscylcblxuICAgICAgaWYgKGludGVyYWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBpbnRlcmFjdGlvblxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvLyB0cnkgdG8gcmVzdW1lIHNpbXVsYXRpb24gd2l0aCBhIG5ldyBwb2ludGVyXG4gIHNpbXVsYXRpb25SZXN1bWUgKHsgcG9pbnRlclR5cGUsIGV2ZW50VHlwZSwgZXZlbnRUYXJnZXQsIHNjb3BlIH06IFNlYXJjaERldGFpbHMpIHtcbiAgICBpZiAoIS9kb3dufHN0YXJ0L2kudGVzdChldmVudFR5cGUpKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGZvciAoY29uc3QgaW50ZXJhY3Rpb24gb2Ygc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QpIHtcbiAgICAgIGxldCBlbGVtZW50ID0gZXZlbnRUYXJnZXRcblxuICAgICAgaWYgKGludGVyYWN0aW9uLnNpbXVsYXRpb24gJiYgaW50ZXJhY3Rpb24uc2ltdWxhdGlvbi5hbGxvd1Jlc3VtZSAmJlxuICAgICAgICAgIChpbnRlcmFjdGlvbi5wb2ludGVyVHlwZSA9PT0gcG9pbnRlclR5cGUpKSB7XG4gICAgICAgIHdoaWxlIChlbGVtZW50KSB7XG4gICAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgdGhlIGludGVyYWN0aW9uIGVsZW1lbnRcbiAgICAgICAgICBpZiAoZWxlbWVudCA9PT0gaW50ZXJhY3Rpb24uZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGludGVyYWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsZW1lbnQgPSB1dGlscy5kb20ucGFyZW50Tm9kZShlbGVtZW50KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbiAgfSxcblxuICAvLyBpZiBpdCdzIGEgbW91c2Ugb3IgcGVuIGludGVyYWN0aW9uXG4gIG1vdXNlT3JQZW4gKHsgcG9pbnRlcklkLCBwb2ludGVyVHlwZSwgZXZlbnRUeXBlLCBzY29wZSB9OiBTZWFyY2hEZXRhaWxzKSB7XG4gICAgaWYgKHBvaW50ZXJUeXBlICE9PSAnbW91c2UnICYmIHBvaW50ZXJUeXBlICE9PSAncGVuJykge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBsZXQgZmlyc3ROb25BY3RpdmVcblxuICAgIGZvciAoY29uc3QgaW50ZXJhY3Rpb24gb2Ygc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QpIHtcbiAgICAgIGlmIChpbnRlcmFjdGlvbi5wb2ludGVyVHlwZSA9PT0gcG9pbnRlclR5cGUpIHtcbiAgICAgICAgLy8gaWYgaXQncyBhIGRvd24gZXZlbnQsIHNraXAgaW50ZXJhY3Rpb25zIHdpdGggcnVubmluZyBzaW11bGF0aW9uc1xuICAgICAgICBpZiAoaW50ZXJhY3Rpb24uc2ltdWxhdGlvbiAmJiAhaGFzUG9pbnRlcklkKGludGVyYWN0aW9uLCBwb2ludGVySWQpKSB7IGNvbnRpbnVlIH1cblxuICAgICAgICAvLyBpZiB0aGUgaW50ZXJhY3Rpb24gaXMgYWN0aXZlLCByZXR1cm4gaXQgaW1tZWRpYXRlbHlcbiAgICAgICAgaWYgKGludGVyYWN0aW9uLmludGVyYWN0aW5nKCkpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJhY3Rpb25cbiAgICAgICAgfVxuICAgICAgICAvLyBvdGhlcndpc2Ugc2F2ZSBpdCBhbmQgbG9vayBmb3IgYW5vdGhlciBhY3RpdmUgaW50ZXJhY3Rpb25cbiAgICAgICAgZWxzZSBpZiAoIWZpcnN0Tm9uQWN0aXZlKSB7XG4gICAgICAgICAgZmlyc3ROb25BY3RpdmUgPSBpbnRlcmFjdGlvblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgbm8gYWN0aXZlIG1vdXNlIGludGVyYWN0aW9uIHdhcyBmb3VuZCB1c2UgdGhlIGZpcnN0IGluYWN0aXZlIG1vdXNlXG4gICAgLy8gaW50ZXJhY3Rpb25cbiAgICBpZiAoZmlyc3ROb25BY3RpdmUpIHtcbiAgICAgIHJldHVybiBmaXJzdE5vbkFjdGl2ZVxuICAgIH1cblxuICAgIC8vIGZpbmQgYW55IG1vdXNlIG9yIHBlbiBpbnRlcmFjdGlvbi5cbiAgICAvLyBpZ25vcmUgdGhlIGludGVyYWN0aW9uIGlmIHRoZSBldmVudFR5cGUgaXMgYSAqZG93biwgYW5kIGEgc2ltdWxhdGlvblxuICAgIC8vIGlzIGFjdGl2ZVxuICAgIGZvciAoY29uc3QgaW50ZXJhY3Rpb24gb2Ygc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QpIHtcbiAgICAgIGlmIChpbnRlcmFjdGlvbi5wb2ludGVyVHlwZSA9PT0gcG9pbnRlclR5cGUgJiYgISgvZG93bi9pLnRlc3QoZXZlbnRUeXBlKSAmJiBpbnRlcmFjdGlvbi5zaW11bGF0aW9uKSkge1xuICAgICAgICByZXR1cm4gaW50ZXJhY3Rpb25cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9LFxuXG4gIC8vIGdldCBpbnRlcmFjdGlvbiB0aGF0IGhhcyB0aGlzIHBvaW50ZXJcbiAgaGFzUG9pbnRlciAoeyBwb2ludGVySWQsIHNjb3BlIH06IFNlYXJjaERldGFpbHMpIHtcbiAgICBmb3IgKGNvbnN0IGludGVyYWN0aW9uIG9mIHNjb3BlLmludGVyYWN0aW9ucy5saXN0KSB7XG4gICAgICBpZiAoaGFzUG9pbnRlcklkKGludGVyYWN0aW9uLCBwb2ludGVySWQpKSB7XG4gICAgICAgIHJldHVybiBpbnRlcmFjdGlvblxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH0sXG5cbiAgLy8gZ2V0IGZpcnN0IGlkbGUgaW50ZXJhY3Rpb24gd2l0aCBhIG1hdGNoaW5nIHBvaW50ZXJUeXBlXG4gIGlkbGUgKHsgcG9pbnRlclR5cGUsIHNjb3BlIH06IFNlYXJjaERldGFpbHMpIHtcbiAgICBmb3IgKGNvbnN0IGludGVyYWN0aW9uIG9mIHNjb3BlLmludGVyYWN0aW9ucy5saXN0KSB7XG4gICAgICAvLyBpZiB0aGVyZSdzIGFscmVhZHkgYSBwb2ludGVyIGhlbGQgZG93blxuICAgICAgaWYgKGludGVyYWN0aW9uLnBvaW50ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBpbnRlcmFjdGlvbi5pbnRlcmFjdGFibGVcbiAgICAgICAgLy8gZG9uJ3QgYWRkIHRoaXMgcG9pbnRlciBpZiB0aGVyZSBpcyBhIHRhcmdldCBpbnRlcmFjdGFibGUgYW5kIGl0XG4gICAgICAgIC8vIGlzbid0IGdlc3R1cmFibGVcbiAgICAgICAgaWYgKHRhcmdldCAmJiAhdGFyZ2V0Lm9wdGlvbnMuZ2VzdHVyZS5lbmFibGVkKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gbWF4aW11bSBvZiAyIHBvaW50ZXJzIHBlciBpbnRlcmFjdGlvblxuICAgICAgZWxzZSBpZiAoaW50ZXJhY3Rpb24ucG9pbnRlcnMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKCFpbnRlcmFjdGlvbi5pbnRlcmFjdGluZygpICYmIChwb2ludGVyVHlwZSA9PT0gaW50ZXJhY3Rpb24ucG9pbnRlclR5cGUpKSB7XG4gICAgICAgIHJldHVybiBpbnRlcmFjdGlvblxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH0sXG59XG5cbmZ1bmN0aW9uIGhhc1BvaW50ZXJJZCAoaW50ZXJhY3Rpb24sIHBvaW50ZXJJZCkge1xuICByZXR1cm4gdXRpbHMuYXJyLnNvbWUoaW50ZXJhY3Rpb24ucG9pbnRlcnMsICh7IGlkIH0pID0+IGlkID09PSBwb2ludGVySWQpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpbmRlclxuIl19
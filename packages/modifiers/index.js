import base from './base';
import restrictEdgesModule from './restrict/edges';
import restrictModule from './restrict/pointer';
import restrictSizeModule from './restrict/size';
import snapEdgesModule from './snap/edges';
import snapModule from './snap/pointer';
import snapSizeModule from './snap/size';
const { makeModifier } = base;
export const snap = makeModifier(snapModule, 'snap');
export const snapSize = makeModifier(snapSizeModule, 'snapSize');
export const snapEdges = makeModifier(snapEdgesModule, 'snapEdges');
export const restrict = makeModifier(restrictModule, 'restrict');
export const restrictEdges = makeModifier(restrictEdgesModule, 'restrictEdges');
export const restrictSize = makeModifier(restrictSizeModule, 'restrictSize');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLElBQUksTUFBTSxRQUFRLENBQUE7QUFDekIsT0FBTyxtQkFBbUIsTUFBTSxrQkFBa0IsQ0FBQTtBQUNsRCxPQUFPLGNBQWMsTUFBTSxvQkFBb0IsQ0FBQTtBQUMvQyxPQUFPLGtCQUFrQixNQUFNLGlCQUFpQixDQUFBO0FBQ2hELE9BQU8sZUFBZSxNQUFNLGNBQWMsQ0FBQTtBQUMxQyxPQUFPLFVBQVUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUN2QyxPQUFPLGNBQWMsTUFBTSxhQUFhLENBQUE7QUFFeEMsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQTtBQUU3QixNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUNwRCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUNoRSxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUNuRSxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUNoRSxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLG1CQUFtQixFQUFFLGVBQWUsQ0FBQyxDQUFBO0FBQy9FLE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmFzZSBmcm9tICcuL2Jhc2UnXG5pbXBvcnQgcmVzdHJpY3RFZGdlc01vZHVsZSBmcm9tICcuL3Jlc3RyaWN0L2VkZ2VzJ1xuaW1wb3J0IHJlc3RyaWN0TW9kdWxlIGZyb20gJy4vcmVzdHJpY3QvcG9pbnRlcidcbmltcG9ydCByZXN0cmljdFNpemVNb2R1bGUgZnJvbSAnLi9yZXN0cmljdC9zaXplJ1xuaW1wb3J0IHNuYXBFZGdlc01vZHVsZSBmcm9tICcuL3NuYXAvZWRnZXMnXG5pbXBvcnQgc25hcE1vZHVsZSBmcm9tICcuL3NuYXAvcG9pbnRlcidcbmltcG9ydCBzbmFwU2l6ZU1vZHVsZSBmcm9tICcuL3NuYXAvc2l6ZSdcblxuY29uc3QgeyBtYWtlTW9kaWZpZXIgfSA9IGJhc2VcblxuZXhwb3J0IGNvbnN0IHNuYXAgPSBtYWtlTW9kaWZpZXIoc25hcE1vZHVsZSwgJ3NuYXAnKVxuZXhwb3J0IGNvbnN0IHNuYXBTaXplID0gbWFrZU1vZGlmaWVyKHNuYXBTaXplTW9kdWxlLCAnc25hcFNpemUnKVxuZXhwb3J0IGNvbnN0IHNuYXBFZGdlcyA9IG1ha2VNb2RpZmllcihzbmFwRWRnZXNNb2R1bGUsICdzbmFwRWRnZXMnKVxuZXhwb3J0IGNvbnN0IHJlc3RyaWN0ID0gbWFrZU1vZGlmaWVyKHJlc3RyaWN0TW9kdWxlLCAncmVzdHJpY3QnKVxuZXhwb3J0IGNvbnN0IHJlc3RyaWN0RWRnZXMgPSBtYWtlTW9kaWZpZXIocmVzdHJpY3RFZGdlc01vZHVsZSwgJ3Jlc3RyaWN0RWRnZXMnKVxuZXhwb3J0IGNvbnN0IHJlc3RyaWN0U2l6ZSA9IG1ha2VNb2RpZmllcihyZXN0cmljdFNpemVNb2R1bGUsICdyZXN0cmljdFNpemUnKVxuIl19
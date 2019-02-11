import { JSDOM } from '@interactjs/_dev/test/domator';
import test from '@interactjs/_dev/test/test';
test('typings', async (t) => {
    let error;
    const { window } = new JSDOM('');
    global.window = window;
    global.document = window.document;
    try {
        require('./interactjs-test');
    }
    catch (e) {
        error = e;
    }
    delete global.window;
    delete global.document;
    t.error(error, 'interactjs-test.ts compiles without error');
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGVzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLCtCQUErQixDQUFBO0FBQ3JELE9BQU8sSUFBSSxNQUFNLDRCQUE0QixDQUFBO0FBRTdDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzFCLElBQUksS0FBSyxDQUFBO0lBRVQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRWhDLE1BQWMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQy9CLE1BQWMsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQTtJQUUxQyxJQUFJO1FBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7S0FBRTtJQUNwQyxPQUFPLENBQUMsRUFBRTtRQUFFLEtBQUssR0FBRyxDQUFDLENBQUE7S0FBRTtJQUV2QixPQUFRLE1BQWMsQ0FBQyxNQUFNLENBQUE7SUFDN0IsT0FBUSxNQUFjLENBQUMsUUFBUSxDQUFBO0lBRS9CLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLDJDQUEyQyxDQUFDLENBQUE7SUFDM0QsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ1QsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBKU0RPTSB9IGZyb20gJ0BpbnRlcmFjdGpzL19kZXYvdGVzdC9kb21hdG9yJ1xuaW1wb3J0IHRlc3QgZnJvbSAnQGludGVyYWN0anMvX2Rldi90ZXN0L3Rlc3QnXG5cbnRlc3QoJ3R5cGluZ3MnLCBhc3luYyAodCkgPT4ge1xuICBsZXQgZXJyb3JcblxuICBjb25zdCB7IHdpbmRvdyB9ID0gbmV3IEpTRE9NKCcnKTtcblxuICAoZ2xvYmFsIGFzIGFueSkud2luZG93ID0gd2luZG93O1xuICAoZ2xvYmFsIGFzIGFueSkuZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnRcblxuICB0cnkgeyByZXF1aXJlKCcuL2ludGVyYWN0anMtdGVzdCcpIH1cbiAgY2F0Y2ggKGUpIHsgZXJyb3IgPSBlIH1cblxuICBkZWxldGUgKGdsb2JhbCBhcyBhbnkpLndpbmRvd1xuICBkZWxldGUgKGdsb2JhbCBhcyBhbnkpLmRvY3VtZW50XG5cbiAgdC5lcnJvcihlcnJvciwgJ2ludGVyYWN0anMtdGVzdC50cyBjb21waWxlcyB3aXRob3V0IGVycm9yJylcbiAgdC5lbmQoKVxufSlcbiJdfQ==
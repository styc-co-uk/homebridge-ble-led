const noble = require('@abandonware/noble');

noble.on('stateChange', async (state) => {
  console.log(state);
  if (state === 'poweredOn') {
    console.log('Start scanning...');
    await noble.startScanningAsync();
  }
});

var deviceId = 'A105000002BA'
var deviceId = deviceId.toLowerCase();
var device = undefined

noble.on('discover', async (peripheral) => {
  var periId = peripheral.id.toLowerCase();
  console.log(periId,periId==deviceId,peripheral.advertisement.localName);
  if (periId == deviceId) {
    await noble.stopScanningAsync();
    console.log('Device found.');
    // console.log(peripheral);
    const handleWrite = 0x0009;
    const bufferWrite = [0x56,Array(3).fill(0x55),0x00,0xf0,0xaa];
    peripheral.connect();
    peripheral.once('connect', (callback) => {
      console.log('Connected');
      peripheral.writeHandle(handleWrite, Buffer.from(bufferWrite),true)
    });
    peripheral.once(`handleWrite${handleWrite}`, () => {
      console.log('Wrote');
      setTimeout( async () => {
	await peripheral.disconnectAsync()
      },50);
      // process.exit(0);
    });
  };
});


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
    const handleListen = 0x000c;

    peripheral.connect();
    peripheral.once('connect', (callback) => {
      console.log('Connected');
      peripheral.writeHandle(handleWrite, Buffer.from([0xef,0x01,0x77]),true)
    });
    peripheral.on('handleNotify', async (handle,value) => {
      console.log('notified',handle,value);
      await peripheral.disconnectAsync();
      process.exit(0);
    });
  };
});

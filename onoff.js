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
    console.log(peripheral);
    const handleWrite = 0x0009;
    await peripheral.connectAsync().then(() => {var connected = true});
    await peripheral.writeHandleAsync(0x0009, new Buffer([0xcc,0x23,0x33]));
    await peripheral.disconnectAsync();
    process.exit(0);
  };
});


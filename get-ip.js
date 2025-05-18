const { networkInterfaces } = require('os');

// Get the local IP address
function getLocalIpAddress() {
  const nets = networkInterfaces();
  const results = {};

  // Create a list of all network interfaces
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (loopback) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  console.log('\n=== Your Local IP Addresses ===\n');
  
  // Print all network interfaces and their IPv4 addresses
  let foundAny = false;
  for (const [name, addresses] of Object.entries(results)) {
    if (addresses.length > 0) {
      foundAny = true;
      console.log(`Interface: ${name}`);
      addresses.forEach(address => {
        console.log(`  IP: ${address}`);
      });
    }
  }
  
  if (!foundAny) {
    console.log('No network interfaces with IPv4 addresses found.');
    console.log('Make sure you are connected to a network.');
  }
  
  console.log('\nUse one of these IP addresses to update PHYSICAL_DEVICE_API_URL in:');
  console.log('frontend/.env\n');
  console.log('Example:');
  console.log('PHYSICAL_DEVICE_API_URL=http://192.168.1.5:3000/api\n');
  console.log('After updating the .env file, restart your development server.\n');
}

getLocalIpAddress();
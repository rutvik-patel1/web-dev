
<template>
  <div>
    <h2>Hardware and Browser Information</h2>

    <div>
      <h3>Device Information</h3>
      <p>Browser: {{ browserInfo }}</p>
      <p>OS: {{ osInfo }}</p>
    </div>


    <div>
      <h3>Geolocation</h3>
      <p>Latitude: {{ latitude }}</p>
      <p>Longitude: {{ longitude }}</p>
    </div>

    <div>
      <h3>Local Storage</h3>
      <p>Local Storage Supported: {{ isLocalStorageSupported ? 'Yes' : 'No' }}</p>
    </div>

    <div>
      <h3>Clipboard</h3>
      <p>Clipboard API Supported: {{ isClipboardSupported ? 'Yes' : 'No' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      browserInfo: navigator.userAgent,
      osInfo: this.detectOS(),
      batteryLevel: null,
      isCharging: null,
      latitude: null,
      longitude: null,
      alpha: null,
      beta: null,
      gamma: null,
      isOnline: navigator.onLine,
      connectionType: navigator.connection ? navigator.connection.type : 'Unknown',
      isLocalStorageSupported: 'localStorage' in window && window.localStorage !== null,
      isClipboardSupported: navigator.clipboard !== undefined,
    };
  },
  methods: {
    detectOS() {
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf('Win') !== -1) return 'Windows';
      if (userAgent.indexOf('Mac') !== -1) return 'MacOS';
      if (userAgent.indexOf('Linux') !== -1) return 'Linux';
      if (userAgent.indexOf('Android') !== -1) return 'Android';
      if (userAgent.indexOf('iOS') !== -1) return 'iOS';
      return 'Unknown';
    },
    updateBatteryStatus() {
      const battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
      if (battery) {
        this.batteryLevel = Math.floor(battery.level * 100);
        this.isCharging = battery.charging;
      }
    },
    updateGeolocation() {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        error => {
          console.error(error.message);
        }
      );
    },
    updateDeviceOrientation() {
      window.addEventListener('deviceorientation', event => {
        this.alpha = event.alpha;
        this.beta = event.beta;
        this.gamma = event.gamma;
      });
    },
    updateNetworkStatus() {
      window.addEventListener('online', () => {
        this.isOnline = true;
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    },
  },
  mounted() {
    // Fetch initial values
    this.updateBatteryStatus();
    this.updateGeolocation();
    this.updateDeviceOrientation();
    this.updateNetworkStatus();

    // Add listeners for real-time updates
    navigator.getBattery().then(battery => {
      battery.addEventListener('levelchange', () => {
        this.updateBatteryStatus();
      });

      battery.addEventListener('chargingchange', () => {
        this.updateBatteryStatus();
      });
    });
  },
};
</script>

<style scoped>
/* Add your component styles here */
</style>

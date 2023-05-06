import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
 
 // const handleBarCodeScanned = false;
 const handleBarCodeScanned = async ({ type, data, bounds }) => {
  const scanningFieldSize = 200; // Change this to your desired scanning field size
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const centerX = screenWidth / 2;
  const centerY = screenHeight / 2;

  const isQRCodeInScanningField =
    bounds.origin.x >= centerX - scanningFieldSize / 2 &&
    bounds.origin.x <= centerX + scanningFieldSize / 2 &&
    bounds.origin.y >= centerY - scanningFieldSize / 2 &&
    bounds.origin.y <= centerY + scanningFieldSize / 2;

  if (!isQRCodeInScanningField) {
    return;
  }

  setScanned(true);
  const response = await fetch(`https://your-backend-server.com/validate-qr-code?data=${data}`);
  const result = await response.json();

  //testcode ab hier
/*
  const simulateSuccess = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500); // Simulate a delay of 1000ms
    });
  };
  
  const result = await simulateSuccess();
*/
//testcode bis hier
  setResult(result);
};


  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
  
      <View style={styles.overlay}>
        <View style={styles.transparentHole} />
      </View>

      <View style={styles.scanArea}>

      </View>

      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => {
          setScanned(false);
          setResult(null); // Reset the result state to null
      }}>
          <Image source={require('./assets/scan-again.png')} style={styles.scanAgainImage} />
        </TouchableOpacity>
      )}
      {result === true && <Image source={require('./assets/green-hook.png')} style={styles.greenHookImage} />}
      {result === false && <Image source={require('./assets/x-symbol.png')} style={styles.xSymbolImage} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 25,
    left: '50%',
    marginLeft: -55,
    alignItems: 'center',
  },
  scanAgainImage: {
    width: 110,
    height: 110,
  },
  greenHookImage: {
    position: 'absolute',
    top: 30,
    left: '50%',
    width: 110,
    height: 110,
    marginLeft: -55,
  },
  xSymbolImage: {
    position: 'absolute',
    top: 20,
    left: '50%',
    width: 140,
    height: 140,
    marginLeft: -70,

  },
  scanArea: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    height: 250,
    marginTop: -125,
    marginLeft: -125,
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginTop: -100,
    marginLeft: -100,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  transparentHole: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200, // Change the width here
    height: 200, // Change the height here
    marginTop: -100, // Adjust the margin to half of the height
    marginLeft: -100, // Adjust the margin to half of the width
    backgroundColor: 'transparent',
    borderColor: 'red',
    borderWidth: 5,
  },
  
  
});
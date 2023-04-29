import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const response = await fetch(`https://your-backend-server.com/validate-qr-code?data=${data}`);
    const result = await response.json();
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
      <View style={styles.scanFieldContainer}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}/>
    </View>

      <View style={styles.overlay}>
        <View style={styles.transparentHole} />
      </View>

      <View style={styles.scanArea}>
        <View style={[styles.scanCorner, styles.topLeftCorner]} />
        <View style={[styles.scanCorner, styles.topRightCorner]} />
        <View style={[styles.scanCorner, styles.bottomLeftCorner]} />
        <View style={[styles.scanCorner, styles.bottomRightCorner]} />
      </View>

      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
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
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanAgainImage: {
    width: 100,
    height: 100,
  },
  greenHookImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  xSymbolImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
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
  scanCorner: {
    position: 'absolute',
    borderColor: 'white',
    borderWidth: 6,
  },
  topLeftCorner: {
    borderTopLeftRadius: 5,
    left: 0,
    top: 0,
  },
  topRightCorner: {
    borderTopRightRadius: 5,
    right: 0,
    top: 0,
  },
  bottomLeftCorner: {
    borderBottomLeftRadius: 5,
    left: 0,
    bottom: 0,
  },
  bottomRightCorner: {
    borderBottomRightRadius: 5,
    right: 0,
    bottom: 0,
  },
 
  transparentHole: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    height: 250,
    marginTop: -125,
    marginLeft: -125,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 125,
  },
  scanFieldContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250, // Change the width here
    height: 250, // Change the height here
    marginTop: -125, // Adjust the margin to half of the height
    marginLeft: -125, // Adjust the margin to half of the width
    overflow: 'hidden', // This will crop the scanner view
  },
  
});
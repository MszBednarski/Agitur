import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Button,
} from 'react-native';
import {walletManager} from './lib/Wallet';
import {observer} from 'mobx-react-lite';
import {Section} from './lib/Section';

const App = observer(() => {
  useEffect(() => {
    walletManager.init();
  }, []);
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          {walletManager.loading ? (
            <Text>Loading</Text>
          ) : walletManager.walletExists ? (
            <Section title="Your wallet">{`Balance: ${500}`}</Section>
          ) : (
            <Button
              title="Create Wallet"
              onPress={() => walletManager.createWallet()}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default App;

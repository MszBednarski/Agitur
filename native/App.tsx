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
import {BalanceDisp} from './lib/BalanceDisp';
import Clipboard from '@react-native-clipboard/clipboard';

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
            <>
              <Section title="Agitur">
                {`Address: ${walletManager.walletInfo.pubkey}`}
              </Section>
              <Button
                title="Copy Address"
                onPress={() => {
                  Clipboard.setString(walletManager.walletInfo.pubkey);
                }}
              />
              <BalanceDisp pubkey={walletManager.walletInfo.pubkey} />
            </>
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
